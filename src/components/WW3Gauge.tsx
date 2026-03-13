'use client';

import { WW3Assessment, getRiskEmoji } from '@/lib/ww3-calculator';
import { useState } from 'react';

interface WW3GaugeProps {
  assessment: WW3Assessment;
}

export default function WW3Gauge({ assessment }: WW3GaugeProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* Main Gauge Display */}
      <button
        onClick={() => setShowDetails(true)}
        className="group relative bg-gray-900/95 backdrop-blur border border-gray-700 rounded-xl p-4 hover:border-gray-500 transition-all cursor-pointer"
      >
        <div className="text-center">
          <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
            WW3 Risk Index
          </div>
          
          {/* Big Percentage */}
          <div 
            className="text-6xl font-black tabular-nums leading-none"
            style={{ color: assessment.color }}
          >
            {assessment.percentage}%
          </div>
          
          {/* Level Badge */}
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-2xl">{getRiskEmoji(assessment.level)}</span>
            <span 
              className="text-lg font-bold uppercase tracking-wide"
              style={{ color: assessment.color }}
            >
              {assessment.level}
            </span>
          </div>
          
          {/* Mini Progress Bar */}
          <div className="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${assessment.percentage}%`,
                background: `linear-gradient(90deg, #22c55e 0%, #eab308 25%, #f97316 50%, #ef4444 75%, #dc2626 100%)`,
              }}
            />
          </div>
          
          {/* Scale Labels */}
          <div className="mt-1 flex justify-between text-[10px] text-gray-600">
            <span>STABLE</span>
            <span>ELEVATED</span>
            <span>HIGH</span>
            <span>SEVERE</span>
            <span>CRITICAL</span>
          </div>
          
          <div className="mt-3 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
            Click for details →
          </div>
        </div>
      </button>

      {/* Details Modal */}
      {showDetails && (
        <div 
          className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowDetails(false)}
        >
          <div 
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">WW3 Risk Assessment</h2>
                <p className="text-gray-400 text-sm mt-1">How close are we to global war?</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Big Number */}
            <div className="text-center py-6 border-y border-gray-800">
              <div 
                className="text-8xl font-black tabular-nums"
                style={{ color: assessment.color }}
              >
                {assessment.percentage}%
              </div>
              <div className="mt-2 flex items-center justify-center gap-3">
                <span className="text-3xl">{getRiskEmoji(assessment.level)}</span>
                <span 
                  className="text-2xl font-bold uppercase"
                  style={{ color: assessment.color }}
                >
                  {assessment.level}
                </span>
              </div>
              <p className="mt-3 text-gray-400 text-sm max-w-sm mx-auto">
                {assessment.levelDescription}
              </p>
            </div>

            {/* Scale Explanation */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Risk Scale
              </h3>
              <div className="space-y-2">
                {[
                  { range: '0-20%', level: 'STABLE', color: '#22c55e', desc: 'Regional conflicts contained' },
                  { range: '20-40%', level: 'ELEVATED', color: '#eab308', desc: 'Multiple severe conflicts, proxy wars' },
                  { range: '40-60%', level: 'HIGH', color: '#f97316', desc: 'Direct tensions between nuclear powers' },
                  { range: '60-80%', level: 'SEVERE', color: '#ef4444', desc: 'Direct clashes possible, nuclear threats' },
                  { range: '80-100%', level: 'CRITICAL', color: '#dc2626', desc: 'Active major power war, nuclear risk' },
                ].map(item => (
                  <div 
                    key={item.level}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      assessment.level === item.level ? 'bg-gray-800 ring-1' : ''
                    }`}
                    style={{ ringColor: assessment.level === item.level ? item.color : undefined }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-500 w-16">{item.range}</span>
                    <span className="text-sm font-medium text-white">{item.level}</span>
                    <span className="text-xs text-gray-500 ml-auto">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Factor Breakdown */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Contributing Factors
              </h3>
              <div className="space-y-3">
                {assessment.factors.map(factor => (
                  <div key={factor.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-300">{factor.name}</span>
                      <span className="text-gray-500">
                        {factor.score} / {factor.maxScore} pts
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${(factor.score / factor.maxScore) * 100}%`,
                          backgroundColor: assessment.color,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Threats */}
            {assessment.keyThreats.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  ⚠️ Key Escalation Risks
                </h3>
                <ul className="space-y-2">
                  {assessment.keyThreats.map((threat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span className="text-gray-300">{threat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-6 p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-500">
                <strong className="text-gray-400">Disclaimer:</strong> This index is calculated algorithmically 
                based on active conflict data and is for informational/educational purposes only. 
                It does not represent official intelligence assessments.
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-gray-600">
              Last calculated: {assessment.lastUpdated.toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
