import { Conflict } from '@/types';

/**
 * WW3 RISK CALCULATOR
 * 
 * This calculates a "World War 3 Risk Index" based on current global conflicts.
 * The scale measures how close we are to a full-scale global war involving
 * major powers (US, Russia, China, NATO, etc.)
 * 
 * SCALE BREAKDOWN (0-100%):
 * 
 * 0-20%   - STABLE: Regional conflicts contained, great powers not directly engaged
 * 20-40%  - ELEVATED: Multiple severe conflicts, proxy wars between major powers
 * 40-60%  - HIGH: Direct military tensions between nuclear powers, active proxy wars
 * 60-80%  - SEVERE: Direct clashes between major powers, nuclear threats issued
 * 80-100% - CRITICAL: Active war between major powers, nuclear use imminent
 * 
 * FACTORS WEIGHTED:
 * - Number of active conflicts (max 15 pts)
 * - Severity of conflicts (max 20 pts)
 * - Great power involvement (max 25 pts)
 * - Nuclear-armed state tensions (max 20 pts)
 * - Geographic spread (max 10 pts)
 * - Escalation trajectory (max 10 pts)
 */

export interface WW3Assessment {
  percentage: number;
  level: 'STABLE' | 'ELEVATED' | 'HIGH' | 'SEVERE' | 'CRITICAL';
  levelDescription: string;
  color: string;
  factors: {
    name: string;
    score: number;
    maxScore: number;
    description: string;
  }[];
  keyThreats: string[];
  lastUpdated: Date;
}

// Conflicts involving nuclear powers or that could trigger great power war
const NUCLEAR_POWER_CONFLICTS = [
  'ukraine-russia',      // Direct Russia involvement, NATO support
  'taiwan-tensions',     // US-China flashpoint
  'korea-tensions',      // North Korea nuclear threat
  'iran-israel-shadow',  // Iran nuclear program, US involvement
];

const GREAT_POWER_PROXY_CONFLICTS = [
  'gaza-israel',         // US backs Israel, Iran backs Hamas/Hezbollah
  'syria-ongoing',       // Russia, US, Turkey, Iran all involved
  'red-sea-houthi',      // Iran proxy vs US/UK naval forces
  'yemen-war',           // Saudi (US ally) vs Houthis (Iran proxy)
];

const MAJOR_REGIONAL_CONFLICTS = [
  'sudan-civil-war',
  'myanmar-civil-war',
  'drc-east',
  'ethiopia-regional',
  'sahel-insurgency',
];

export function calculateWW3Risk(conflicts: Conflict[]): WW3Assessment {
  const factors: WW3Assessment['factors'] = [];
  let totalScore = 0;

  // FACTOR 1: Number of active conflicts (max 15 pts)
  const conflictCount = conflicts.length;
  const conflictCountScore = Math.min(15, conflictCount * 0.6);
  factors.push({
    name: 'Active Conflicts',
    score: Math.round(conflictCountScore * 10) / 10,
    maxScore: 15,
    description: `${conflictCount} active conflicts worldwide`,
  });
  totalScore += conflictCountScore;

  // FACTOR 2: Severity of conflicts (max 20 pts)
  const criticalConflicts = conflicts.filter(c => c.severity >= 9).length;
  const highConflicts = conflicts.filter(c => c.severity >= 7 && c.severity < 9).length;
  const avgSeverity = conflicts.reduce((sum, c) => sum + c.severity, 0) / conflicts.length;
  const severityScore = Math.min(20, (criticalConflicts * 4) + (highConflicts * 2) + (avgSeverity * 0.5));
  factors.push({
    name: 'Conflict Severity',
    score: Math.round(severityScore * 10) / 10,
    maxScore: 20,
    description: `${criticalConflicts} critical, ${highConflicts} high severity`,
  });
  totalScore += severityScore;

  // FACTOR 3: Great power involvement (max 25 pts)
  const nuclearConflictsActive = NUCLEAR_POWER_CONFLICTS.filter(id => 
    conflicts.some(c => c.id === id && c.severity >= 5)
  ).length;
  const proxyConflictsActive = GREAT_POWER_PROXY_CONFLICTS.filter(id =>
    conflicts.some(c => c.id === id && c.severity >= 5)
  ).length;
  const greatPowerScore = Math.min(25, (nuclearConflictsActive * 5) + (proxyConflictsActive * 2.5));
  factors.push({
    name: 'Great Power Involvement',
    score: Math.round(greatPowerScore * 10) / 10,
    maxScore: 25,
    description: `${nuclearConflictsActive} nuclear-power conflicts, ${proxyConflictsActive} proxy wars`,
  });
  totalScore += greatPowerScore;

  // FACTOR 4: Nuclear tensions (max 20 pts)
  const ukraineConflict = conflicts.find(c => c.id === 'ukraine-russia');
  const taiwanConflict = conflicts.find(c => c.id === 'taiwan-tensions');
  const koreaConflict = conflicts.find(c => c.id === 'korea-tensions');
  const iranConflict = conflicts.find(c => c.id === 'iran-israel-shadow');
  
  let nuclearScore = 0;
  if (ukraineConflict && ukraineConflict.severity >= 9) nuclearScore += 8; // Russia nuclear threats
  if (taiwanConflict && taiwanConflict.severity >= 5) nuclearScore += 5;   // US-China tension
  if (koreaConflict && koreaConflict.severity >= 4) nuclearScore += 4;     // Kim's missiles
  if (iranConflict && iranConflict.severity >= 6) nuclearScore += 3;       // Iran program
  nuclearScore = Math.min(20, nuclearScore);
  factors.push({
    name: 'Nuclear Escalation Risk',
    score: Math.round(nuclearScore * 10) / 10,
    maxScore: 20,
    description: 'Based on nuclear-armed state tensions',
  });
  totalScore += nuclearScore;

  // FACTOR 5: Geographic spread (max 10 pts)
  const regions = new Set<string>();
  conflicts.forEach(c => {
    const lat = c.location.lat;
    const lng = c.location.lng;
    if (lat > 35 && lng > -30 && lng < 60) regions.add('europe');
    if (lat > 10 && lat < 45 && lng > 30 && lng < 80) regions.add('middle-east');
    if (lat > -35 && lat < 35 && lng > -20 && lng < 55) regions.add('africa');
    if (lat > 0 && lat < 55 && lng > 60 && lng < 150) regions.add('asia');
    if (lat > -60 && lat < 15 && lng > -120 && lng < -30) regions.add('americas');
  });
  const spreadScore = Math.min(10, regions.size * 2);
  factors.push({
    name: 'Geographic Spread',
    score: spreadScore,
    maxScore: 10,
    description: `Conflicts in ${regions.size} major regions`,
  });
  totalScore += spreadScore;

  // FACTOR 6: Escalation trajectory (max 10 pts)
  // Based on recent severity (this would use historical data in production)
  const recentEscalations = conflicts.filter(c => c.severity >= 8).length;
  const escalationScore = Math.min(10, recentEscalations * 1.5);
  factors.push({
    name: 'Escalation Trend',
    score: Math.round(escalationScore * 10) / 10,
    maxScore: 10,
    description: `${recentEscalations} conflicts at high/critical level`,
  });
  totalScore += escalationScore;

  // Calculate final percentage
  const percentage = Math.round(totalScore);

  // Determine level
  let level: WW3Assessment['level'];
  let levelDescription: string;
  let color: string;

  if (percentage < 20) {
    level = 'STABLE';
    levelDescription = 'Regional conflicts contained. Great powers not directly engaged in combat.';
    color = '#22c55e'; // green
  } else if (percentage < 40) {
    level = 'ELEVATED';
    levelDescription = 'Multiple severe conflicts active. Proxy wars between major powers ongoing.';
    color = '#eab308'; // yellow
  } else if (percentage < 60) {
    level = 'HIGH';
    levelDescription = 'Direct military tensions between nuclear powers. Multiple active proxy wars.';
    color = '#f97316'; // orange
  } else if (percentage < 80) {
    level = 'SEVERE';
    levelDescription = 'Direct clashes between major powers possible. Nuclear threats have been issued.';
    color = '#ef4444'; // red
  } else {
    level = 'CRITICAL';
    levelDescription = 'Active war between major powers. Nuclear use considered imminent risk.';
    color = '#dc2626'; // dark red
  }

  // Key threats
  const keyThreats: string[] = [];
  if (ukraineConflict && ukraineConflict.severity >= 9) {
    keyThreats.push('Russia-NATO direct confrontation risk in Ukraine');
  }
  if (taiwanConflict && taiwanConflict.severity >= 4) {
    keyThreats.push('US-China military tensions over Taiwan');
  }
  const gazaConflict = conflicts.find(c => c.id === 'gaza-israel');
  if (gazaConflict && gazaConflict.severity >= 9) {
    keyThreats.push('Middle East regional war expansion (Iran involvement)');
  }
  const redSeaConflict = conflicts.find(c => c.id === 'red-sea-houthi');
  if (redSeaConflict && redSeaConflict.severity >= 7) {
    keyThreats.push('Red Sea crisis disrupting global trade');
  }
  if (koreaConflict && koreaConflict.severity >= 4) {
    keyThreats.push('North Korea nuclear/missile provocations');
  }

  return {
    percentage,
    level,
    levelDescription,
    color,
    factors,
    keyThreats,
    lastUpdated: new Date(),
  };
}

export function getRiskEmoji(level: WW3Assessment['level']): string {
  switch (level) {
    case 'STABLE': return '🟢';
    case 'ELEVATED': return '🟡';
    case 'HIGH': return '🟠';
    case 'SEVERE': return '🔴';
    case 'CRITICAL': return '💀';
  }
}
