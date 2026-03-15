'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Conflict, HeatmapPoint, Article } from '@/types';
import { ConnectionLine } from '@/lib/conflict-connections';
import ConflictPanel from '@/components/ConflictPanel';
import NewsTicker from '@/components/NewsTicker';
import WW3Gauge from '@/components/WW3Gauge';
import { calculateWW3Risk, WW3Assessment } from '@/lib/ww3-calculator';

// Dynamic import to avoid SSR issues with Leaflet
const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading conflict data...</p>
      </div>
    </div>
  ),
});

interface ApiResponse {
  conflicts: Conflict[];
  heatmapPoints: HeatmapPoint[];
  connections: ConnectionLine[];
  headlines: Article[];
  meta: {
    totalConflicts: number;
    criticalCount: number;
    highCount?: number;
    totalCasualties?: number;
    totalDisplaced?: number;
    lastUpdated: string;
    dataSource: string;
  };
}

export default function Home() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [connections, setConnections] = useState<ConnectionLine[]>([]);
  const [headlines, setHeadlines] = useState<Article[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ww3Assessment, setWw3Assessment] = useState<WW3Assessment | null>(null);

  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const response = await fetch('/api/conflicts');
      const data: ApiResponse = await response.json();
      
      // Parse dates
      const parsedConflicts = data.conflicts.map(c => ({
        ...c,
        lastUpdated: new Date(c.lastUpdated),
        startDate: c.startDate ? new Date(c.startDate) : undefined,
        articles: c.articles?.map(a => ({
          ...a,
          publishedAt: new Date(a.publishedAt),
        })) || [],
      }));

      const parsedHeadlines = data.headlines.map(h => ({
        ...h,
        publishedAt: new Date(h.publishedAt),
      }));
      
      setConflicts(parsedConflicts);
      setHeatmapPoints(data.heatmapPoints);
      setConnections(data.connections);
      setHeadlines(parsedHeadlines);
      setLastUpdated(new Date(data.meta.lastUpdated));
      setDataSource(data.meta.dataSource);
      
      // Calculate WW3 risk
      const assessment = calculateWW3Risk(parsedConflicts);
      setWw3Assessment(assessment);
      setIsLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handleConflictSelect = (conflict: Conflict) => {
    setSelectedConflict(conflict);
    setPanelOpen(true);
  };

  return (
    <main className="h-screen w-screen flex flex-col bg-gray-950 overflow-hidden">
      {/* News Ticker */}
      <NewsTicker headlines={headlines} isLoading={isLoading} />

      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className={`flex-1 relative transition-all duration-300 ${panelOpen ? '' : 'w-full'}`}>
          {!isLoading && (
            <WorldMap
              conflicts={conflicts}
              heatmapPoints={heatmapPoints}
              connections={connections}
              onConflictSelect={handleConflictSelect}
            />
          )}
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-950 flex items-center justify-center z-[2000]">
              <div className="text-center">
                <div className="text-6xl mb-4">☢️</div>
                <div className="w-20 h-20 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-white mb-2">WORLD WAR 3 WATCH</h2>
                <p className="text-gray-400 text-sm">Analyzing global conflict data...</p>
              </div>
            </div>
          )}
          
          {/* Toggle Panel Button */}
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="absolute top-4 left-4 z-[1000] bg-gray-900/90 hover:bg-gray-800 backdrop-blur rounded-lg p-3 text-white transition-colors"
          >
            {panelOpen ? '← Hide Panel' : '→ Show Panel'}
          </button>

          {/* Title Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] text-center pointer-events-none">
            <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tight">
              ☢️ WORLD WAR 3 WATCH
            </h1>
            <p className="text-sm text-gray-300 drop-shadow mt-1">
              {conflicts.length} active conflicts • {conflicts.filter(c => c.severity >= 9).length} critical zones
            </p>
          </div>
          
          {/* WW3 Risk Gauge */}
          {ww3Assessment && (
            <div className="absolute top-20 left-4 z-[1000]">
              <WW3Gauge assessment={ww3Assessment} />
            </div>
          )}

          {/* Status Bar */}
          <div className="absolute top-4 right-4 z-[1000] bg-gray-900/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-gray-400 flex items-center gap-3">
            {isRefreshing && (
              <>
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading data...</span>
                </div>
                <span className="text-gray-600">|</span>
              </>
            )}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="hover:text-white transition-colors"
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
            </div>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => fetchData(true)}
              className="hover:text-white transition-colors"
              disabled={isRefreshing}
            >
              {isRefreshing ? 'Loading...' : '↻ Refresh'}
            </button>
            {lastUpdated && (
              <>
                <span className="text-gray-600">|</span>
                <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              </>
            )}
          </div>

          {/* Warning Banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-red-900/80 backdrop-blur text-white px-4 py-2 rounded-lg text-sm max-w-lg text-center">
            ⚠️ Live data from GDELT. Locations approximate. For informational purposes only.
          </div>

          {/* Data Source Badge */}
          {dataSource && (
            <div className="absolute bottom-4 right-4 z-[1000] bg-gray-900/80 backdrop-blur text-gray-400 px-3 py-1 rounded text-xs">
              Source: {dataSource}
            </div>
          )}
        </div>

        {/* Side Panel */}
        {panelOpen && (
          <div className="w-96 h-full shadow-2xl animate-slideIn">
            <ConflictPanel
              conflicts={conflicts}
              selectedConflict={selectedConflict}
              onSelect={handleConflictSelect}
              onClose={() => setSelectedConflict(null)}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
