import { describe, expect, it } from 'vitest';
import { canonicalIngredient, searchTerms } from './synonyms.js';

describe('synonyms', () => {
  it('maps salts, local and US names to one canonical ingredient', () => {
    expect(canonicalIngredient('Pseudoephedrine Hydrochloride')).toBe('pseudoephedrine');
    expect(canonicalIngredient('Acetaminophen')).toBe('paracetamol');
    expect(canonicalIngredient('chlorhydrate de bromhexine')).toBe('bromhexine');
    expect(canonicalIngredient('プソイドエフェドリン')).toBe('pseudoephedrine');
  });

  it('strips common salt words for unknown ingredients', () => {
    expect(canonicalIngredient('Loratadine Hydrochloride')).toBe('loratadine');
  });

  it('returns names and class terms to search for', () => {
    const terms = searchTerms('methylphenidate hydrochloride');
    expect(terms.canonical).toBe('methylphenidate');
    expect(terms.names).toContain('dexmethylphenidate');
    expect(terms.classTerms).toContain('psychotropic');
    expect(searchTerms('loratadine')).toEqual({ canonical: 'loratadine', names: ['loratadine'], classTerms: [] });
  });
});
