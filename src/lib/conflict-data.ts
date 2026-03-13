import { Conflict, ConflictType, HeatmapPoint } from '@/types';

// Known ongoing conflicts with approximate data
// In production, this would be fetched from news APIs and conflict databases
export const KNOWN_CONFLICTS: Conflict[] = [
  {
    id: 'ukraine-russia',
    title: 'Russia-Ukraine War',
    description: 'Full-scale Russian invasion of Ukraine ongoing since February 2022',
    location: { name: 'Eastern Ukraine', country: 'Ukraine', lat: 48.5, lng: 37.5 },
    severity: 10,
    casualties: 500000,
    displaced: 8000000,
    articles: [],
    lastUpdated: new Date(),
    startDate: new Date('2022-02-24'),
    conflictType: 'war',
    actors: ['Russia', 'Ukraine', 'NATO (support)'],
  },
  {
    id: 'gaza-israel',
    title: 'Israel-Gaza War',
    description: 'Israeli military operations in Gaza following October 7 attacks',
    location: { name: 'Gaza Strip', country: 'Palestine', lat: 31.5, lng: 34.47 },
    severity: 10,
    casualties: 45000,
    displaced: 2000000,
    articles: [],
    lastUpdated: new Date(),
    startDate: new Date('2023-10-07'),
    conflictType: 'war',
    actors: ['Israel', 'Hamas', 'Hezbollah'],
  },
  {
    id: 'sudan-civil-war',
    title: 'Sudan Civil War',
    description: 'Armed conflict between SAF and RSF paramilitary forces',
    location: { name: 'Khartoum', country: 'Sudan', lat: 15.5, lng: 32.5 },
    severity: 9,
    casualties: 150000,
    displaced: 10000000,
    articles: [],
    lastUpdated: new Date(),
    startDate: new Date('2023-04-15'),
    conflictType: 'civil_war',
    actors: ['Sudan Armed Forces', 'Rapid Support Forces'],
  },
  {
    id: 'myanmar-civil-war',
    title: 'Myanmar Civil War',
    description: 'Armed resistance against military junta following 2021 coup',
    location: { name: 'Myanmar', country: 'Myanmar', lat: 21.9, lng: 96.0 },
    severity: 8,
    casualties: 50000,
    displaced: 3000000,
    articles: [],
    lastUpdated: new Date(),
    startDate: new Date('2021-02-01'),
    conflictType: 'civil_war',
    actors: ['Military Junta', 'PDF', 'Ethnic Armed Groups'],
  },
  {
    id: 'ethiopia-regional',
    title: 'Ethiopia Regional Conflicts',
    description: 'Multiple ongoing conflicts in Amhara, Oromia, and other regions',
    location: { name: 'Amhara Region', country: 'Ethiopia', lat: 11.5, lng: 37.5 },
    severity: 7,
    casualties: 30000,
    displaced: 5000000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'civil_war',
    actors: ['Ethiopian Government', 'Fano Militia', 'OLA'],
  },
  {
    id: 'drc-east',
    title: 'Eastern DRC Conflict',
    description: 'M23 rebellion and multiple armed group conflicts',
    location: { name: 'North Kivu', country: 'DR Congo', lat: -1.5, lng: 29.0 },
    severity: 8,
    casualties: 25000,
    displaced: 7000000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['DRC Army', 'M23', 'ADF', 'FDLR'],
  },
  {
    id: 'yemen-war',
    title: 'Yemen Civil War',
    description: 'Ongoing conflict between Houthi forces and Saudi-backed government',
    location: { name: 'Yemen', country: 'Yemen', lat: 15.5, lng: 44.0 },
    severity: 7,
    casualties: 380000,
    displaced: 4000000,
    articles: [],
    lastUpdated: new Date(),
    startDate: new Date('2014-09-01'),
    conflictType: 'civil_war',
    actors: ['Houthis', 'Saudi Coalition', 'Yemen Government'],
  },
  {
    id: 'syria-ongoing',
    title: 'Syria Conflict',
    description: 'Continued instability following Assad regime collapse',
    location: { name: 'Syria', country: 'Syria', lat: 35.0, lng: 38.0 },
    severity: 6,
    casualties: 500000,
    displaced: 13000000,
    articles: [],
    lastUpdated: new Date(),
    startDate: new Date('2011-03-15'),
    conflictType: 'civil_war',
    actors: ['HTS', 'SDF', 'Turkey', 'Various Factions'],
  },
  {
    id: 'haiti-gangs',
    title: 'Haiti Gang Violence',
    description: 'Armed gang control of Port-au-Prince and ongoing violence',
    location: { name: 'Port-au-Prince', country: 'Haiti', lat: 18.5, lng: -72.3 },
    severity: 7,
    casualties: 8000,
    displaced: 700000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['Gang Coalitions', 'Haitian Police', 'UN Mission'],
  },
  {
    id: 'sahel-insurgency',
    title: 'Sahel Insurgency',
    description: 'Jihadist insurgency across Mali, Burkina Faso, Niger',
    location: { name: 'Sahel Region', country: 'Mali', lat: 14.0, lng: -3.0 },
    severity: 7,
    casualties: 20000,
    displaced: 3000000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['JNIM', 'ISGS', 'Wagner Group', 'Regional Armies'],
  },
  {
    id: 'somalia-alshabaab',
    title: 'Somalia Al-Shabaab Conflict',
    description: 'Ongoing insurgency by Al-Shabaab against Somali government',
    location: { name: 'Somalia', country: 'Somalia', lat: 5.0, lng: 46.0 },
    severity: 6,
    casualties: 15000,
    displaced: 3500000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['Al-Shabaab', 'Somali Government', 'ATMIS'],
  },
  {
    id: 'pakistan-terrorism',
    title: 'Pakistan Terrorism',
    description: 'TTP and other militant attacks in Pakistan',
    location: { name: 'KPK Province', country: 'Pakistan', lat: 34.0, lng: 71.5 },
    severity: 5,
    casualties: 3000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'terrorism',
    actors: ['TTP', 'Pakistani Military', 'BLA'],
  },
  {
    id: 'afghanistan-isis',
    title: 'Afghanistan ISIS-K',
    description: 'ISIS-K attacks against Taliban government and civilians',
    location: { name: 'Afghanistan', country: 'Afghanistan', lat: 34.5, lng: 69.0 },
    severity: 5,
    casualties: 5000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'terrorism',
    actors: ['ISIS-K', 'Taliban', 'NRF'],
  },
  {
    id: 'mexico-cartel',
    title: 'Mexico Cartel Violence',
    description: 'Ongoing cartel warfare and violence across Mexico',
    location: { name: 'Sinaloa', country: 'Mexico', lat: 24.8, lng: -107.4 },
    severity: 6,
    casualties: 40000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['Sinaloa Cartel', 'CJNG', 'Mexican Military'],
  },
  {
    id: 'west-bank',
    title: 'West Bank Violence',
    description: 'Israeli raids and settler violence in occupied West Bank',
    location: { name: 'West Bank', country: 'Palestine', lat: 32.0, lng: 35.2 },
    severity: 6,
    casualties: 1500,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'military_operation',
    actors: ['IDF', 'Palestinian Militants', 'Settlers'],
  },
  {
    id: 'lebanon-instability',
    title: 'Lebanon Post-War Instability',
    description: 'Aftermath of Israel-Hezbollah war and ongoing tensions',
    location: { name: 'South Lebanon', country: 'Lebanon', lat: 33.3, lng: 35.5 },
    severity: 5,
    casualties: 4000,
    displaced: 1000000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'border_dispute',
    actors: ['Hezbollah', 'Israel', 'LAF'],
  },
  {
    id: 'cameroon-separatists',
    title: 'Cameroon Anglophone Crisis',
    description: 'Separatist conflict in English-speaking regions',
    location: { name: 'Northwest Region', country: 'Cameroon', lat: 6.0, lng: 10.0 },
    severity: 5,
    casualties: 6000,
    displaced: 700000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['Ambazonia Separatists', 'Cameroon Military'],
  },
  {
    id: 'mozambique-cabo',
    title: 'Mozambique Insurgency',
    description: 'ISIS-linked insurgency in Cabo Delgado province',
    location: { name: 'Cabo Delgado', country: 'Mozambique', lat: -12.5, lng: 40.0 },
    severity: 5,
    casualties: 5000,
    displaced: 1000000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['ISIS-Mozambique', 'FADM', 'SAMIM'],
  },
  {
    id: 'india-manipur',
    title: 'India Manipur Violence',
    description: 'Ethnic violence between Meitei and Kuki communities',
    location: { name: 'Manipur', country: 'India', lat: 24.8, lng: 93.9 },
    severity: 5,
    casualties: 250,
    displaced: 70000,
    articles: [],
    lastUpdated: new Date(),
    startDate: new Date('2023-05-03'),
    conflictType: 'ethnic_violence',
    actors: ['Meitei', 'Kuki', 'Indian Security Forces'],
  },
  {
    id: 'philippines-npa',
    title: 'Philippines NPA Insurgency',
    description: 'Communist insurgency ongoing for decades',
    location: { name: 'Mindanao', country: 'Philippines', lat: 7.5, lng: 124.0 },
    severity: 4,
    casualties: 2000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['NPA', 'Philippine Military'],
  },
  {
    id: 'colombia-armed-groups',
    title: 'Colombia Armed Groups',
    description: 'ELN, FARC dissidents, and cartel violence',
    location: { name: 'Colombia', country: 'Colombia', lat: 4.0, lng: -72.0 },
    severity: 5,
    casualties: 3000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['ELN', 'FARC Dissidents', 'Colombian Military'],
  },
  {
    id: 'iraq-isis-remnants',
    title: 'Iraq ISIS Remnants',
    description: 'ISIS sleeper cells and occasional attacks',
    location: { name: 'Iraq', country: 'Iraq', lat: 35.0, lng: 44.0 },
    severity: 4,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'terrorism',
    actors: ['ISIS Remnants', 'Iraqi Forces', 'PMF'],
  },
  {
    id: 'nigeria-banditry',
    title: 'Nigeria Banditry & Terrorism',
    description: 'Boko Haram, ISWAP, and armed banditry',
    location: { name: 'Northeast Nigeria', country: 'Nigeria', lat: 11.5, lng: 13.0 },
    severity: 6,
    casualties: 10000,
    displaced: 3000000,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'insurgency',
    actors: ['Boko Haram', 'ISWAP', 'Bandits', 'Nigerian Military'],
  },
  {
    id: 'taiwan-tensions',
    title: 'Taiwan Strait Tensions',
    description: 'Rising military tensions between China and Taiwan',
    location: { name: 'Taiwan Strait', country: 'Taiwan', lat: 24.0, lng: 120.0 },
    severity: 4,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'border_dispute',
    actors: ['China', 'Taiwan', 'USA'],
  },
  {
    id: 'korea-tensions',
    title: 'Korean Peninsula Tensions',
    description: 'North Korea provocations and missile tests',
    location: { name: 'Korean DMZ', country: 'South Korea', lat: 38.0, lng: 127.0 },
    severity: 3,
    articles: [],
    lastUpdated: new Date(),
    conflictType: 'border_dispute',
    actors: ['North Korea', 'South Korea', 'USA'],
  },
];

// Spread conflicts across multiple points for more realistic heat map
export function generateHeatmapPoints(conflicts: Conflict[]): HeatmapPoint[] {
  const points: HeatmapPoint[] = [];
  
  conflicts.forEach(conflict => {
    // Main point
    points.push({
      lat: conflict.location.lat,
      lng: conflict.location.lng,
      intensity: conflict.severity / 10,
    });
    
    // Add surrounding points for larger conflicts
    if (conflict.severity >= 7) {
      const spread = conflict.severity >= 9 ? 3 : 1.5;
      const numPoints = conflict.severity >= 9 ? 12 : 6;
      
      for (let i = 0; i < numPoints; i++) {
        const angle = (2 * Math.PI * i) / numPoints;
        const distance = spread * (0.5 + Math.random() * 0.5);
        points.push({
          lat: conflict.location.lat + distance * Math.sin(angle),
          lng: conflict.location.lng + distance * Math.cos(angle),
          intensity: (conflict.severity / 10) * (0.5 + Math.random() * 0.3),
        });
      }
    }
  });
  
  return points;
}

export function calculateSeverityColor(severity: number): string {
  if (severity >= 9) return '#ff0000'; // Critical - Red
  if (severity >= 7) return '#ff4500'; // High - Orange-Red
  if (severity >= 5) return '#ffa500'; // Medium - Orange
  if (severity >= 3) return '#ffff00'; // Low - Yellow
  return '#00ff00'; // Minimal - Green
}

export function formatCasualties(num?: number): string {
  if (!num) return 'Unknown';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
  return num.toString();
}

export function getConflictTypeLabel(type: ConflictType): string {
  const labels: Record<ConflictType, string> = {
    war: 'War',
    civil_war: 'Civil War',
    insurgency: 'Insurgency',
    terrorism: 'Terrorism',
    ethnic_violence: 'Ethnic Violence',
    border_dispute: 'Border Dispute',
    coup: 'Coup',
    protest_violence: 'Protest Violence',
    military_operation: 'Military Operation',
    unknown: 'Unknown',
  };
  return labels[type];
}
