import { Conflict } from '@/types';

/**
 * CONFLICT CONNECTIONS
 * 
 * Defines relationships between conflicts - shared actors, proxy relationships,
 * supply chains, and geographic/strategic links.
 * 
 * Connection strength (1-10):
 * 10 = Same war / direct extension
 * 8-9 = Direct military support / same actors
 * 6-7 = Proxy relationship / arms supply
 * 4-5 = Strategic alliance / shared interests
 * 2-3 = Indirect influence / regional spillover
 */

export interface ConflictConnection {
  source: string;      // conflict ID
  target: string;      // conflict ID
  strength: number;    // 1-10
  type: ConnectionType;
  description: string;
}

export type ConnectionType = 
  | 'direct'           // Same conflict / direct extension
  | 'proxy'            // Proxy war relationship
  | 'alliance'         // Military alliance / support
  | 'arms'             // Arms supply chain
  | 'actor'            // Shared actor (same group fighting in both)
  | 'regional'         // Regional spillover / geographic
  | 'ideological';     // Ideological alignment

export const CONFLICT_CONNECTIONS: ConflictConnection[] = [
  // === IRAN AXIS ===
  {
    source: 'gaza-israel',
    target: 'red-sea-houthi',
    strength: 9,
    type: 'proxy',
    description: 'Houthi attacks in solidarity with Gaza, Iran-backed',
  },
  {
    source: 'gaza-israel',
    target: 'lebanon-instability',
    strength: 9,
    type: 'direct',
    description: 'Hezbollah-Israel front, same war theater',
  },
  {
    source: 'gaza-israel',
    target: 'iran-israel-shadow',
    strength: 10,
    type: 'proxy',
    description: 'Iran backs Hamas, direct confrontation',
  },
  {
    source: 'gaza-israel',
    target: 'west-bank',
    strength: 10,
    type: 'direct',
    description: 'Same Israeli-Palestinian conflict',
  },
  {
    source: 'iran-israel-shadow',
    target: 'red-sea-houthi',
    strength: 8,
    type: 'proxy',
    description: 'Iran supplies Houthis with weapons/intel',
  },
  {
    source: 'iran-israel-shadow',
    target: 'lebanon-instability',
    strength: 9,
    type: 'proxy',
    description: 'Iran funds and arms Hezbollah',
  },
  {
    source: 'iran-israel-shadow',
    target: 'syria-ongoing',
    strength: 8,
    type: 'alliance',
    description: 'Iran military presence in Syria',
  },
  {
    source: 'iran-israel-shadow',
    target: 'hormuz-tensions',
    strength: 9,
    type: 'direct',
    description: 'Same Iran-West confrontation',
  },
  {
    source: 'iran-israel-shadow',
    target: 'iraq-isis-remnants',
    strength: 6,
    type: 'proxy',
    description: 'Iran-backed PMF militias in Iraq',
  },
  {
    source: 'red-sea-houthi',
    target: 'yemen-war',
    strength: 10,
    type: 'direct',
    description: 'Same Houthi forces, same conflict',
  },
  {
    source: 'yemen-war',
    target: 'hormuz-tensions',
    strength: 5,
    type: 'regional',
    description: 'Saudi-Iran proxy dimension',
  },
  {
    source: 'lebanon-instability',
    target: 'syria-ongoing',
    strength: 7,
    type: 'regional',
    description: 'Hezbollah involved in both, border spillover',
  },

  // === RUSSIA CONNECTIONS ===
  {
    source: 'ukraine-russia',
    target: 'syria-ongoing',
    strength: 5,
    type: 'actor',
    description: 'Russia military involvement in both',
  },
  {
    source: 'ukraine-russia',
    target: 'sahel-insurgency',
    strength: 4,
    type: 'actor',
    description: 'Wagner Group / Africa Corps in both theaters',
  },

  // === AFRICAN CONFLICTS ===
  {
    source: 'sudan-civil-war',
    target: 'ethiopia-regional',
    strength: 5,
    type: 'regional',
    description: 'Border tensions, refugee flows, arms trafficking',
  },
  {
    source: 'sudan-civil-war',
    target: 'drc-east',
    strength: 3,
    type: 'regional',
    description: 'Central African instability corridor',
  },
  {
    source: 'ethiopia-regional',
    target: 'somalia-alshabaab',
    strength: 5,
    type: 'regional',
    description: 'Ethiopian troops in Somalia, border issues',
  },
  {
    source: 'sahel-insurgency',
    target: 'nigeria-banditry',
    strength: 6,
    type: 'actor',
    description: 'Jihadist groups operate across borders',
  },
  {
    source: 'sahel-insurgency',
    target: 'cameroon-separatists',
    strength: 3,
    type: 'regional',
    description: 'Regional instability, arms flows',
  },
  {
    source: 'drc-east',
    target: 'mozambique-cabo',
    strength: 3,
    type: 'ideological',
    description: 'ISIS-linked groups in both regions',
  },

  // === ASIAN TENSIONS ===
  {
    source: 'taiwan-tensions',
    target: 'korea-tensions',
    strength: 6,
    type: 'alliance',
    description: 'US alliance system, China-North Korea axis',
  },
  {
    source: 'myanmar-civil-war',
    target: 'india-manipur',
    strength: 4,
    type: 'regional',
    description: 'Border spillover, ethnic connections',
  },
  {
    source: 'afghanistan-isis',
    target: 'pakistan-terrorism',
    strength: 7,
    type: 'actor',
    description: 'TTP safe havens in Afghanistan, shared militants',
  },

  // === AMERICAS ===
  {
    source: 'mexico-cartel',
    target: 'colombia-armed-groups',
    strength: 5,
    type: 'arms',
    description: 'Drug trafficking routes, cartel connections',
  },
  {
    source: 'haiti-gangs',
    target: 'mexico-cartel',
    strength: 3,
    type: 'arms',
    description: 'Weapons trafficking from Central America',
  },

  // === GLOBAL JIHADIST NETWORK ===
  {
    source: 'sahel-insurgency',
    target: 'somalia-alshabaab',
    strength: 4,
    type: 'ideological',
    description: 'Al-Qaeda affiliates coordination',
  },
  {
    source: 'afghanistan-isis',
    target: 'mozambique-cabo',
    strength: 4,
    type: 'ideological',
    description: 'ISIS global network, propaganda',
  },
  {
    source: 'afghanistan-isis',
    target: 'iraq-isis-remnants',
    strength: 6,
    type: 'ideological',
    description: 'ISIS central coordination',
  },
  {
    source: 'nigeria-banditry',
    target: 'mozambique-cabo',
    strength: 3,
    type: 'ideological',
    description: 'ISWAP / ISIS-Mozambique links',
  },
];

export interface ConnectionLine {
  sourceConflict: Conflict;
  targetConflict: Conflict;
  connection: ConflictConnection;
}

export function getConnectionLines(conflicts: Conflict[]): ConnectionLine[] {
  const conflictMap = new Map(conflicts.map(c => [c.id, c]));
  const lines: ConnectionLine[] = [];

  for (const conn of CONFLICT_CONNECTIONS) {
    const source = conflictMap.get(conn.source);
    const target = conflictMap.get(conn.target);
    
    if (source && target) {
      lines.push({
        sourceConflict: source,
        targetConflict: target,
        connection: conn,
      });
    }
  }

  return lines;
}

export function getConnectionColor(type: ConnectionType): string {
  switch (type) {
    case 'direct': return '#ef4444';      // red
    case 'proxy': return '#f97316';       // orange  
    case 'alliance': return '#3b82f6';    // blue
    case 'arms': return '#a855f7';        // purple
    case 'actor': return '#ec4899';       // pink
    case 'regional': return '#22c55e';    // green
    case 'ideological': return '#eab308'; // yellow
  }
}

export function getConnectionTypeLabel(type: ConnectionType): string {
  switch (type) {
    case 'direct': return 'Direct Extension';
    case 'proxy': return 'Proxy War';
    case 'alliance': return 'Military Alliance';
    case 'arms': return 'Arms Supply';
    case 'actor': return 'Shared Actor';
    case 'regional': return 'Regional Spillover';
    case 'ideological': return 'Ideological Link';
  }
}
