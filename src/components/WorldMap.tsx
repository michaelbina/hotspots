'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Conflict, HeatmapPoint } from '@/types';
import { calculateSeverityColor, formatCasualties, getConflictTypeLabel } from '@/lib/conflict-data';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface WorldMapProps {
  conflicts: Conflict[];
  heatmapPoints: HeatmapPoint[];
  onConflictSelect?: (conflict: Conflict) => void;
}

export default function WorldMap({ conflicts, heatmapPoints, onConflictSelect }: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<L.Layer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      worldCopyJump: true,
      zoomControl: true,
    });

    // Dark theme tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    mapInstanceRef.current = map;
    markersLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update heat layer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const loadHeatmap = async () => {
      // @ts-expect-error leaflet.heat doesn't have types
      const heat = await import('leaflet.heat');
      
      if (heatLayerRef.current) {
        mapInstanceRef.current!.removeLayer(heatLayerRef.current);
      }

      if (showHeatmap && heatmapPoints.length > 0) {
        const heatData = heatmapPoints.map(p => [p.lat, p.lng, p.intensity] as [number, number, number]);
        
        // @ts-expect-error leaflet.heat extends L
        heatLayerRef.current = L.heatLayer(heatData, {
          radius: 50,
          blur: 30,
          maxZoom: 12,
          max: 1.0,
          minOpacity: 0.3,
          gradient: {
            0.0: 'transparent',
            0.1: '#1a0000',
            0.2: '#330000',
            0.3: '#4d0000',
            0.4: '#800000',
            0.5: '#b30000',
            0.6: '#cc2200',
            0.7: '#e64500',
            0.8: '#ff6600',
            0.9: '#ff8533',
            1.0: '#ffaa00',
          },
        }).addTo(mapInstanceRef.current!);
      }
    };

    loadHeatmap();
  }, [heatmapPoints, showHeatmap]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    if (!showMarkers) return;

    conflicts.forEach(conflict => {
      const color = calculateSeverityColor(conflict.severity);
      
      // Scale size based on severity (critical = larger)
      const baseSize = 12 + (conflict.severity * 4); // 16px to 52px
      const pulseSize = baseSize + 16;
      const glowSize = baseSize * 2.5;
      const pulseSpeed = 2 - (conflict.severity * 0.12); // faster pulse for higher severity
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="conflict-marker" style="--pulse-speed: ${pulseSpeed}s; --marker-color: ${color};">
            <!-- Outer glow -->
            <div class="marker-glow" style="width: ${glowSize}px; height: ${glowSize}px; background: radial-gradient(circle, ${color}40 0%, transparent 70%);"></div>
            <!-- Pulse ring -->
            <div class="marker-pulse" style="width: ${pulseSize}px; height: ${pulseSize}px; border-color: ${color};"></div>
            <!-- Inner solid circle -->
            <div class="marker-core" style="width: ${baseSize}px; height: ${baseSize}px; background: radial-gradient(circle at 30% 30%, ${color}, ${color}99); box-shadow: 0 0 ${baseSize/2}px ${color}, 0 0 ${baseSize}px ${color}80;"></div>
            <!-- Center highlight -->
            <div class="marker-highlight" style="width: ${baseSize * 0.4}px; height: ${baseSize * 0.4}px;"></div>
          </div>
        `,
        iconSize: [glowSize, glowSize],
        iconAnchor: [glowSize / 2, glowSize / 2],
      });

      const marker = L.marker([conflict.location.lat, conflict.location.lng], { icon })
        .addTo(markersLayerRef.current!);

      const popupContent = `
        <div class="min-w-[250px] p-2">
          <h3 class="font-bold text-lg mb-1">${conflict.title}</h3>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 rounded text-xs font-medium text-white" style="background-color: ${color}">
              Severity: ${conflict.severity}/10
            </span>
            <span class="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-200">
              ${getConflictTypeLabel(conflict.conflictType)}
            </span>
          </div>
          <p class="text-sm text-gray-300 mb-2">${conflict.description}</p>
          <div class="text-xs text-gray-400 space-y-1">
            <div><strong>Location:</strong> ${conflict.location.name}, ${conflict.location.country}</div>
            ${conflict.casualties ? `<div><strong>Casualties:</strong> ~${formatCasualties(conflict.casualties)}</div>` : ''}
            ${conflict.displaced ? `<div><strong>Displaced:</strong> ~${formatCasualties(conflict.displaced)}</div>` : ''}
            <div><strong>Actors:</strong> ${conflict.actors.join(', ')}</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'dark-popup',
        maxWidth: 350,
      });

      marker.on('click', () => {
        onConflictSelect?.(conflict);
      });
    });
  }, [conflicts, showMarkers, onConflictSelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-gray-900/90 backdrop-blur rounded-lg p-3 space-y-2">
        <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => setShowHeatmap(e.target.checked)}
            className="rounded"
          />
          Heat Map
        </label>
        <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
            className="rounded"
          />
          Markers
        </label>
      </div>

      {/* Legend */}
      <div className="absolute bottom-8 left-4 z-[1000] bg-gray-900/90 backdrop-blur rounded-lg p-4">
        <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Severity Scale</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10">
              <div className="w-6 h-6 rounded-full bg-red-600 shadow-lg shadow-red-600/50 animate-pulse"></div>
            </div>
            <span className="text-xs text-gray-300">Critical (9-10)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10">
              <div className="w-5 h-5 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
            </div>
            <span className="text-xs text-gray-300">High (7-8)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10">
              <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
            </div>
            <span className="text-xs text-gray-300">Medium (5-6)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10">
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
            </div>
            <span className="text-xs text-gray-300">Low (1-4)</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 italic">Size = severity intensity</p>
        </div>
      </div>

      <style jsx global>{`
        .dark-popup .leaflet-popup-content-wrapper {
          background-color: #1f2937;
          color: white;
          border-radius: 8px;
        }
        .dark-popup .leaflet-popup-tip {
          background-color: #1f2937;
        }
        .dark-popup .leaflet-popup-close-button {
          color: white;
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        
        /* Conflict marker styles */
        .conflict-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .marker-glow {
          position: absolute;
          border-radius: 50%;
          animation: glow-pulse var(--pulse-speed, 2s) ease-in-out infinite;
        }
        
        .marker-pulse {
          position: absolute;
          border-radius: 50%;
          border: 3px solid;
          opacity: 0;
          animation: ping var(--pulse-speed, 2s) cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .marker-core {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.8);
          transition: transform 0.2s ease;
        }
        
        .marker-highlight {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.9) 0%, transparent 70%);
          transform: translate(-25%, -25%);
        }
        
        .conflict-marker:hover .marker-core {
          transform: scale(1.15);
        }
        
        @keyframes ping {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
