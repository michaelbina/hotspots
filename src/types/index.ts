export interface Conflict {
  id: string;
  title: string;
  description: string;
  location: {
    name: string;
    country: string;
    lat: number;
    lng: number;
  };
  severity: number; // 1-10 scale
  casualties?: number;
  displaced?: number;
  articles: Article[];
  lastUpdated: Date;
  startDate?: Date;
  conflictType: ConflictType;
  actors: string[];
}

export interface Article {
  title: string;
  source: string;
  url: string;
  publishedAt: Date;
  summary?: string;
}

export type ConflictType = 
  | 'war'
  | 'civil_war'
  | 'insurgency'
  | 'terrorism'
  | 'ethnic_violence'
  | 'border_dispute'
  | 'coup'
  | 'protest_violence'
  | 'military_operation'
  | 'unknown';

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number; // 0-1 scale
}

export interface ConflictSummary {
  totalConflicts: number;
  totalCasualties: number;
  mostSevere: Conflict[];
  recentEscalations: Conflict[];
  lastUpdated: Date;
}

export interface NewsSource {
  name: string;
  type: 'rss' | 'api' | 'gdelt';
  url: string;
  enabled: boolean;
}
