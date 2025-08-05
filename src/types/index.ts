export interface LearningObjective {
  id: string;
  original: string;
  current: string;
  changes: Change[];
  highlights: Highlight[];
}

export interface Change {
  id: string;
  position: number;
  originalWord: string;
  newWord: string;
  timestamp: number;
  reason?: string;
}

export interface Highlight {
  start: number;
  end: number;
  word: string;
  type: 'blooms' | 'fink' | 'changed';
  category?: string;
  level?: number;
  definition?: string;
  synonyms?: string[];
}

export interface PedagogicalVerb {
  level?: number;
  category: string;
  definition: string;
  synonyms: string[];
}

export interface WordSuggestion {
  word: string;
  definition?: string;
  pedagogical: boolean;
  category?: string;
  level?: number;
}