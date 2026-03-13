'use client';

import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ConflictArticlesProps {
  articles: Article[];
  conflictTitle: string;
}

export default function ConflictArticles({ articles, conflictTitle }: ConflictArticlesProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        No recent articles found
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Live Coverage
      </h4>
      
      {articles.slice(0, 5).map((article, idx) => (
        <a
          key={idx}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors group"
        >
          <p className="text-sm text-gray-300 group-hover:text-white line-clamp-2 leading-snug">
            {article.title}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-gray-500">{article.source}</span>
            <span className="text-gray-700">•</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </span>
            <span className="ml-auto text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Read →
            </span>
          </div>
        </a>
      ))}
      
      {articles.length > 5 && (
        <p className="text-xs text-gray-500 text-center pt-2">
          +{articles.length - 5} more articles
        </p>
      )}
    </div>
  );
}
