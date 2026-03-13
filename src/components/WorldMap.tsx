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
          radius: 35,
          blur: 25,
          maxZoom: 10,
          max: 1.0,
          gradient: {
            0.0: '#000000',
            0.2: '#2b0000',
            0.4: '#660000',
            0.6: '#cc3300',
            0.8: '#ff6600',
            1.0: '#ff0000',
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
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="relative">
            <div class="absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full animate-ping opacity-75" style="background-color: ${color}"></div>
            <div class="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white" style="background-color: ${color}"></div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
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
      <div className="absolute bottom-8 left-4 z-[1000] bg-gray-900/90 backdrop-blur rounded-lg p-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Severity</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-xs text-gray-300">Critical (9-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-300">High (7-8)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-300">Medium (5-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-300">Low (1-4)</span>
          </div>
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
      `}</style>
    </div>
  );
}
