'use client';

import { Conflict } from '@/types';
import { calculateSeverityColor, formatCasualties, getConflictTypeLabel } from '@/lib/conflict-data';
import { formatDistanceToNow } from 'date-fns';
import ConflictArticles from './ConflictArticles';

interface ConflictPanelProps {
  conflicts: Conflict[];
  selectedConflict: Conflict | null;
  onSelect: (conflict: Conflict) => void;
  onClose: () => void;
}

export default function ConflictPanel({ conflicts, selectedConflict, onSelect, onClose }: ConflictPanelProps) {
  const sortedConflicts = [...conflicts].sort((a, b) => b.severity - a.severity);
  
  const totalCasualties = conflicts.reduce((sum, c) => sum + (c.casualties || 0), 0);
  const totalDisplaced = conflicts.reduce((sum, c) => sum + (c.displaced || 0), 0);
  const criticalCount = conflicts.filter(c => c.severity >= 9).length;
  const highCount = conflicts.filter(c => c.severity >= 7 && c.severity < 9).length;

  return (
    <div className="h-full flex flex-col bg-gray-900 border-l border-gray-800">
      {/* Header Stats */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-red-900/20 to-transparent">
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          🔥 Global Hotspots
        </h1>
        <p className="text-gray-400 text-sm mb-4">Real-time conflict monitoring</p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-500">{conflicts.length}</div>
            <div className="text-xs text-gray-400">Active Conflicts</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-orange-500">{criticalCount}</div>
            <div className="text-xs text-gray-400">Critical</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-500">{formatCasualties(totalCasualties)}</div>
            <div className="text-xs text-gray-400">Est. Casualties</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{formatCasualties(totalDisplaced)}</div>
            <div className="text-xs text-gray-400">Displaced</div>
          </div>
        </div>
      </div>

      {/* Conflict List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
            Conflicts by Severity
          </h2>
          
          {sortedConflicts.map(conflict => (
            <button
              key={conflict.id}
              onClick={() => onSelect(conflict)}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                selectedConflict?.id === conflict.id
                  ? 'bg-gray-700 ring-1 ring-red-500'
                  : 'bg-gray-800/50 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">{conflict.title}</h3>
                  <p className="text-xs text-gray-400 truncate">
                    {conflict.location.country}
                  </p>
                </div>
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: calculateSeverityColor(conflict.severity) }}
                >
                  {conflict.severity}
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300">
                  {getConflictTypeLabel(conflict.conflictType)}
                </span>
                {conflict.casualties && (
                  <span className="px-2 py-0.5 rounded text-xs bg-red-900/50 text-red-300">
                    ~{formatCasualties(conflict.casualties)} casualties
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Conflict Detail */}
      {selectedConflict && (
        <div className="border-t border-gray-800 bg-gray-800/50 p-4 max-h-[40%] overflow-y-auto">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-white">{selectedConflict.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white p-1"
            >
              ✕
            </button>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{selectedConflict.description}</p>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="text-gray-300">{selectedConflict.location.name}, {selectedConflict.location.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Type:</span>
              <span className="text-gray-300">{getConflictTypeLabel(selectedConflict.conflictType)}</span>
            </div>
            {selectedConflict.startDate && (
              <div className="flex justify-between">
                <span className="text-gray-500">Started:</span>
                <span className="text-gray-300">
                  {formatDistanceToNow(selectedConflict.startDate, { addSuffix: true })}
                </span>
              </div>
            )}
            {selectedConflict.casualties && (
              <div className="flex justify-between">
                <span className="text-gray-500">Casualties:</span>
                <span className="text-red-400">~{formatCasualties(selectedConflict.casualties)}</span>
              </div>
            )}
            {selectedConflict.displaced && (
              <div className="flex justify-between">
                <span className="text-gray-500">Displaced:</span>
                <span className="text-blue-400">~{formatCasualties(selectedConflict.displaced)}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 block mb-1">Key Actors:</span>
              <div className="flex flex-wrap gap-1">
                {selectedConflict.actors.map(actor => (
                  <span key={actor} className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Live Articles */}
            {selectedConflict.articles && selectedConflict.articles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <ConflictArticles 
                  articles={selectedConflict.articles} 
                  conflictTitle={selectedConflict.title}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500">
          Data compiled from public sources. Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
