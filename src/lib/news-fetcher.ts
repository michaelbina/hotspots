import { Article } from '@/types';
import { CONFLICT_KEYWORDS, LOCATION_MAPPINGS } from './news-sources';

export interface GdeltArticle {
  url: string;
  title: string;
  seendate: string;
  socialimage: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

export interface GdeltResponse {
  articles: GdeltArticle[];
}

export interface ConflictNews {
  conflictId: string;
  articles: Article[];
  recentMentions: number;
  severityBoost: number;
}

// Fetch articles from GDELT API
export async function fetchGdeltArticles(query: string, maxRecords = 50): Promise<GdeltArticle[]> {
  const params = new URLSearchParams({
    query: query,
    mode: 'ArtList',
    maxrecords: maxRecords.toString(),
    format: 'json',
    sort: 'DateDesc',
  });

  try {
    const response = await fetch(
      `https://api.gdeltproject.org/api/v2/doc/doc?${params}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      console.error('GDELT API error:', response.status);
      return [];
    }

    const data: GdeltResponse = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching GDELT:', error);
    return [];
  }
}

// Fetch conflict-related news for a specific region
export async function fetchConflictNews(conflictId: string): Promise<ConflictNews> {
  const keywords = LOCATION_MAPPINGS[conflictId] || [];
  if (keywords.length === 0) {
    return { conflictId, articles: [], recentMentions: 0, severityBoost: 0 };
  }

  // Build GDELT query with location keywords + conflict terms
  const locationQuery = keywords.slice(0, 3).join(' OR ');
  const conflictTerms = '(war OR conflict OR attack OR fighting OR killed OR strike)';
  const query = `(${locationQuery}) ${conflictTerms}`;

  const gdeltArticles = await fetchGdeltArticles(query, 25);

  const articles: Article[] = gdeltArticles.map(article => ({
    title: article.title,
    source: article.domain,
    url: article.url,
    publishedAt: new Date(article.seendate.replace(/(\d{4})(\d{2})(\d{2}).*/, '$1-$2-$3')),
    summary: undefined,
  }));

  // Calculate severity boost based on article volume and keywords
  const severityBoost = calculateSeverityBoost(gdeltArticles);

  return {
    conflictId,
    articles: articles.slice(0, 10), // Keep top 10
    recentMentions: gdeltArticles.length,
    severityBoost,
  };
}

// Fetch all conflict news sequentially with rate limiting
export async function fetchAllConflictNews(): Promise<Map<string, ConflictNews>> {
  const conflictIds = Object.keys(LOCATION_MAPPINGS);
  const results = new Map<string, ConflictNews>();
  
  // Fetch top 10 conflicts only to avoid rate limits
  const priorityConflicts = [
    'ukraine-russia', 'gaza-israel', 'sudan-civil-war', 'red-sea-houthi',
    'myanmar-civil-war', 'drc-east', 'yemen-war', 'syria-ongoing', 
    'hormuz-tensions', 'iran-israel-shadow'
  ];
  
  const conflictsToFetch = priorityConflicts.filter(id => conflictIds.includes(id));
  
  for (const id of conflictsToFetch) {
    try {
      const result = await fetchConflictNews(id);
      results.set(result.conflictId, result);
      // Rate limit: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error fetching news for ${id}:`, error);
    }
  }
  
  return results;
}

// Calculate severity boost based on news content
function calculateSeverityBoost(articles: GdeltArticle[]): number {
  if (articles.length === 0) return 0;
  
  let score = 0;
  const allTitles = articles.map(a => a.title.toLowerCase()).join(' ');
  
  // Check for critical keywords
  for (const keyword of CONFLICT_KEYWORDS.critical) {
    if (allTitles.includes(keyword)) score += 0.5;
  }
  
  // Check for high severity keywords
  for (const keyword of CONFLICT_KEYWORDS.high) {
    if (allTitles.includes(keyword)) score += 0.3;
  }
  
  // Check for medium severity keywords
  for (const keyword of CONFLICT_KEYWORDS.medium) {
    if (allTitles.includes(keyword)) score += 0.1;
  }
  
  // Volume bonus (more articles = more active conflict)
  if (articles.length > 20) score += 0.5;
  else if (articles.length > 10) score += 0.3;
  else if (articles.length > 5) score += 0.1;
  
  // Cap at 2.0 boost
  return Math.min(score, 2.0);
}

// Parse RSS feed (simplified - in production use a proper RSS parser)
export async function fetchRSSFeed(url: string): Promise<Article[]> {
  try {
    const response = await fetch(url, { next: { revalidate: 600 } });
    const text = await response.text();
    
    // Simple regex-based RSS parsing
    const items: Article[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const dateRegex = /<pubDate>(.*?)<\/pubDate>/;
    
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      const item = match[1];
      const titleMatch = item.match(titleRegex);
      const linkMatch = item.match(linkRegex);
      const dateMatch = item.match(dateRegex);
      
      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1] || titleMatch[2] || '',
          source: new URL(url).hostname,
          url: linkMatch[1],
          publishedAt: dateMatch ? new Date(dateMatch[1]) : new Date(),
        });
      }
    }
    
    return items.slice(0, 20);
  } catch (error) {
    console.error('Error fetching RSS:', url, error);
    return [];
  }
}

// Aggregate headlines from multiple sources
export async function fetchGlobalHeadlines(): Promise<Article[]> {
  const gdeltArticles = await fetchGdeltArticles(
    '(war OR conflict OR attack OR military OR strike OR killed) NOT (sports OR entertainment)',
    100
  );

  return gdeltArticles.map(article => ({
    title: article.title,
    source: article.domain,
    url: article.url,
    publishedAt: new Date(article.seendate.replace(/(\d{4})(\d{2})(\d{2}).*/, '$1-$2-$3')),
  }));
}
