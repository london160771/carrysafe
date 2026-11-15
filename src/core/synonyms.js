import synonyms from '../data/synonyms.json' with { type: 'json' };
import { normaliseText } from './normaliseText.js';

const SALT_WORDS = /\b(hydrochloride|hcl|sulfate|sulphate|citrate|phosphate|maleate|tartrate|sodium|potassium)\b/g;

export function canonicalIngredient(ingredient) {
  const normalised = normaliseText(ingredient);
  const entry = Object.entries(synonyms).find(([key, value]) => key === normalised || value.names.some((name) => normaliseText(name) === normalised));
  if (entry) return entry[0];
  return normalised.replace(SALT_WORDS, '').replace(/\s+/g, ' ').trim() || normalised;
}

export function searchTerms(ingredient) {
  const canonical = canonicalIngredient(ingredient);
  const entry = synonyms[canonical];
  return {
    canonical,
    names: [...new Set([canonical, ...(entry?.names ?? [])].map(normaliseText))],
    classTerms: (entry?.classTerms ?? []).map(normaliseText),
  };
}
