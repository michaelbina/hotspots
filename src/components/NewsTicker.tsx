'use client';

import { Article } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface NewsTickerProps {
  headlines: Article[];
  isLoading?: boolean;
}

export default function NewsTicker({ headlines, isLoading }: NewsTickerProps) {
  const [expanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-red-500 font-bold text-xs uppercase tracking-wider animate-pulse">
            Loading Live Feed...
          </span>
        </div>
      </div>
    );
  }

  if (headlines.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900/95 backdrop-blur border-b border-gray-800">
      {/* Ticker bar */}
      <div className="px-4 py-2 flex items-center gap-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-500 font-bold text-xs uppercase tracking-wider">
            LIVE
          </span>
        </button>
        
        <div className="flex-1 overflow-hidden">
          <div className={`${expanded ? '' : 'animate-marquee'} whitespace-nowrap`}>
            {headlines.slice(0, 10).map((article, idx) => (
              <span key={idx} className="inline-flex items-center mx-4">
                <span className="text-gray-400 text-sm">
                  {article.title}
                </span>
                <span className="text-gray-600 text-xs ml-2">
                  — {article.source}
                </span>
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-white text-sm px-2"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Expanded news list */}
      {expanded && (
        <div className="border-t border-gray-800 max-h-64 overflow-y-auto">
          {headlines.map((article, idx) => (
            <a
              key={idx}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors border-b border-gray-800/50"
            >
              <span className="text-red-500 font-mono text-xs mt-1">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 line-clamp-2">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <span className="text-gray-700">•</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <span className="text-gray-600 text-sm">↗</span>
            </a>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
