import { ReactNode } from 'react';
import pedagogicalData from '../data/pedagogicalVerbs.json';
import { Highlight } from '../types';

export function findPedagogicalTerms(text: string): Highlight[] {
  const highlights: Highlight[] = [];
  const words = text.toLowerCase().split(/\b/);
  let position = 0;

  words.forEach((word) => {
    const cleanWord = word.replace(/[^\w]/g, '');
    
    // Check Bloom's verbs
    const bloomsVerb = pedagogicalData.bloomsVerbs[cleanWord as keyof typeof pedagogicalData.bloomsVerbs];
    if (bloomsVerb) {
      const start = position;
      const end = position + word.length;
      highlights.push({
        start,
        end,
        word: cleanWord,
        type: 'blooms',
        category: bloomsVerb.category,
        level: bloomsVerb.level,
        definition: bloomsVerb.definition,
        synonyms: bloomsVerb.synonyms
      });
    }

    // Check Fink's verbs
    const finksVerb = pedagogicalData.finksVerbs[cleanWord as keyof typeof pedagogicalData.finksVerbs];
    if (finksVerb) {
      const start = position;
      const end = position + word.length;
      highlights.push({
        start,
        end,
        word: cleanWord,
        type: 'fink',
        category: finksVerb.category,
        definition: finksVerb.definition,
        synonyms: finksVerb.synonyms
      });
    }

    position += word.length;
  });

  return highlights;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}