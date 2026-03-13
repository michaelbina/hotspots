import { NextResponse } from 'next/server';
import { KNOWN_CONFLICTS, generateHeatmapPoints } from '@/lib/conflict-data';
import { fetchAllConflictNews, fetchGlobalHeadlines } from '@/lib/news-fetcher';
import { Conflict } from '@/types';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  try {
    // Fetch live news data for all conflicts
    const [newsMap, globalHeadlines] = await Promise.all([
      fetchAllConflictNews(),
      fetchGlobalHeadlines(),
    ]);

    // Merge live news with known conflicts
    const enrichedConflicts: Conflict[] = KNOWN_CONFLICTS.map(conflict => {
      const news = newsMap.get(conflict.id);
      
      if (news) {
        // Adjust severity based on recent news volume (with cap)
        const adjustedSeverity = Math.min(10, conflict.severity + (news.severityBoost * 0.5));
        
        return {
          ...conflict,
          severity: Math.round(adjustedSeverity * 10) / 10,
          articles: news.articles,
          lastUpdated: new Date(),
        };
      }
      
      return {
        ...conflict,
        lastUpdated: new Date(),
      };
    });

    // Sort by severity
    enrichedConflicts.sort((a, b) => b.severity - a.severity);

    const heatmapPoints = generateHeatmapPoints(enrichedConflicts);

    // Calculate summary stats
    const totalCasualties = enrichedConflicts.reduce((sum, c) => sum + (c.casualties || 0), 0);
    const totalDisplaced = enrichedConflicts.reduce((sum, c) => sum + (c.displaced || 0), 0);

    return NextResponse.json({
      conflicts: enrichedConflicts,
      heatmapPoints,
      headlines: globalHeadlines.slice(0, 20),
      meta: {
        totalConflicts: enrichedConflicts.length,
        criticalCount: enrichedConflicts.filter(c => c.severity >= 9).length,
        highCount: enrichedConflicts.filter(c => c.severity >= 7 && c.severity < 9).length,
        totalCasualties,
        totalDisplaced,
        lastUpdated: new Date().toISOString(),
        dataSource: 'GDELT + curated database',
      },
    });
  } catch (error) {
    console.error('Error fetching conflicts:', error);
    
    // Fallback to static data on error
    const conflicts = KNOWN_CONFLICTS.map(c => ({
      ...c,
      lastUpdated: new Date(),
    }));
    
    return NextResponse.json({
      conflicts,
      heatmapPoints: generateHeatmapPoints(KNOWN_CONFLICTS),
      headlines: [],
      meta: {
        totalConflicts: conflicts.length,
        criticalCount: conflicts.filter(c => c.severity >= 9).length,
        lastUpdated: new Date().toISOString(),
        dataSource: 'static (API fallback)',
        error: 'Live data unavailable',
      },
    });
  }
}
