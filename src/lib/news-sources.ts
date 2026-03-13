// News source configuration for conflict monitoring

export interface NewsSource {
  id: string;
  name: string;
  type: 'gdelt' | 'rss' | 'api';
  url: string;
  enabled: boolean;
  category?: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  // GDELT - Global Database of Events, Language, and Tone
  {
    id: 'gdelt-gkg',
    name: 'GDELT Global Knowledge Graph',
    type: 'gdelt',
    url: 'https://api.gdeltproject.org/api/v2/doc/doc',
    enabled: true,
    category: 'events',
  },
  
  // Major News RSS Feeds
  {
    id: 'reuters-world',
    name: 'Reuters World News',
    type: 'rss',
    url: 'https://www.reutersagency.com/feed/?best-regions=middle-east&post_type=best',
    enabled: true,
    category: 'world',
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    type: 'rss',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    enabled: true,
    category: 'world',
  },
  {
    id: 'bbc-world',
    name: 'BBC World',
    type: 'rss',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    enabled: true,
    category: 'world',
  },
  {
    id: 'guardian-world',
    name: 'The Guardian World',
    type: 'rss',
    url: 'https://www.theguardian.com/world/rss',
    enabled: true,
    category: 'world',
  },
  {
    id: 'ap-top',
    name: 'AP News',
    type: 'rss',
    url: 'https://rsshub.app/apnews/topics/world-news',
    enabled: true,
    category: 'world',
  },
];

// Keywords for conflict detection and scoring
export const CONFLICT_KEYWORDS = {
  critical: [
    'war', 'invasion', 'massacre', 'genocide', 'mass killing', 'ethnic cleansing',
    'chemical weapons', 'nuclear', 'airstrike', 'bombing campaign', 'siege',
    'humanitarian catastrophe', 'famine', 'mass graves',
  ],
  high: [
    'military offensive', 'ground invasion', 'heavy fighting', 'shelling',
    'drone strike', 'missile attack', 'casualties mount', 'death toll',
    'civilian casualties', 'hospital bombed', 'school attacked', 'refugee crisis',
  ],
  medium: [
    'clashes', 'fighting', 'conflict', 'violence', 'insurgent', 'militant',
    'terrorist attack', 'explosion', 'gunfire', 'armed group', 'rebel',
    'coup', 'protests turn violent', 'state of emergency',
  ],
  low: [
    'tensions', 'unrest', 'protests', 'demonstrations', 'standoff',
    'diplomatic crisis', 'sanctions', 'military buildup', 'ceasefire violation',
  ],
};

// Location keywords mapped to conflict IDs
export const LOCATION_MAPPINGS: Record<string, string[]> = {
  'ukraine-russia': ['ukraine', 'kyiv', 'kharkiv', 'donetsk', 'zaporizhzhia', 'crimea', 'mariupol', 'bakhmut', 'avdiivka'],
  'gaza-israel': ['gaza', 'israel', 'hamas', 'idf', 'tel aviv', 'jerusalem', 'rafah', 'khan younis', 'west bank'],
  'sudan-civil-war': ['sudan', 'khartoum', 'darfur', 'rsf', 'rapid support forces', 'sudanese army'],
  'myanmar-civil-war': ['myanmar', 'burma', 'yangon', 'mandalay', 'junta', 'pdf', 'rohingya'],
  'ethiopia-regional': ['ethiopia', 'amhara', 'oromia', 'tigray', 'fano', 'addis ababa'],
  'drc-east': ['congo', 'drc', 'goma', 'm23', 'north kivu', 'south kivu'],
  'yemen-war': ['yemen', 'houthi', 'sanaa', 'aden', 'red sea', 'saudi'],
  'syria-ongoing': ['syria', 'damascus', 'aleppo', 'idlib', 'hts', 'sdf', 'kurdish'],
  'haiti-gangs': ['haiti', 'port-au-prince', 'gang', 'haitian'],
  'sahel-insurgency': ['sahel', 'mali', 'burkina faso', 'niger', 'jnim', 'wagner'],
  'somalia-alshabaab': ['somalia', 'mogadishu', 'al-shabaab', 'alshabaab'],
  'pakistan-terrorism': ['pakistan', 'ttp', 'peshawar', 'balochistan', 'khyber'],
  'afghanistan-isis': ['afghanistan', 'kabul', 'taliban', 'isis-k', 'islamic state'],
  'mexico-cartel': ['mexico', 'cartel', 'sinaloa', 'cjng', 'jalisco', 'fentanyl'],
  'west-bank': ['west bank', 'jenin', 'nablus', 'ramallah', 'settler'],
  'lebanon-instability': ['lebanon', 'hezbollah', 'beirut', 'south lebanon'],
  'cameroon-separatists': ['cameroon', 'ambazonia', 'anglophone'],
  'mozambique-cabo': ['mozambique', 'cabo delgado', 'pemba'],
  'india-manipur': ['manipur', 'meitei', 'kuki', 'imphal'],
  'philippines-npa': ['philippines', 'npa', 'mindanao', 'communist'],
  'colombia-armed-groups': ['colombia', 'eln', 'farc', 'bogota', 'dissident'],
  'iraq-isis-remnants': ['iraq', 'baghdad', 'isis', 'mosul', 'kirkuk'],
  'nigeria-banditry': ['nigeria', 'boko haram', 'iswap', 'lagos', 'abuja', 'bandit'],
  'taiwan-tensions': ['taiwan', 'taipei', 'china military', 'strait', 'pla'],
  'korea-tensions': ['north korea', 'pyongyang', 'kim jong', 'dmz', 'missile test'],
  'red-sea-houthi': ['red sea', 'houthi', 'bab el-mandeb', 'shipping attack', 'cargo ship', 'tanker attack', 'aden gulf'],
  'hormuz-tensions': ['strait of hormuz', 'hormuz', 'iran tanker', 'irgc navy', 'persian gulf', 'us navy iran'],
  'iran-israel-shadow': ['iran israel', 'mossad', 'irgc', 'iranian proxy', 'tehran attack', 'natanz', 'nuclear iran'],
};
