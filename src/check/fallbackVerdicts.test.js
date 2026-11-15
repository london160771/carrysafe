import { describe, expect, it } from 'vitest';
import { findFallback, savedVerdicts, validateFallbacks } from './fallbackVerdicts.js';

const ENTRY = {
  ingredient: 'pseudoephedrine',
  country: 'JP',
  verdict: 'prohibited',
  quote: 'cold and flu medication containing pseudoephedrine',
  pageExcerpt: 'This includes:\ncold and flu medication containing pseudoephedrine',
  sourceUrl: 'https://www.gov.uk/foreign-travel-advice/japan/health',
  authority: 'UK FCDO',
  savedOn: '2026-11-15',
};

describe('fallback-verdicts.json (FR-CHECK-004)', () => {
  it('every shipped entry is valid and its quote is in its saved page excerpt', () => {
    expect(validateFallbacks(savedVerdicts)).toEqual([]);
  });

  it('flags entries whose quote is not in the excerpt or that lack a date', () => {
    expect(validateFallbacks([{ ...ENTRY, quote: 'Pseudoephedrine is fine in Japan for everyone.', savedOn: '' }])).toEqual([
      'pseudoephedrine_JP: savedOn',
      'pseudoephedrine_JP: quote not in pageExcerpt',
    ]);
  });

  it('finds an entry by ingredient and country', () => {
    expect(findFallback('pseudoephedrine', 'JP', [ENTRY])).toBe(ENTRY);
    expect(findFallback('pseudoephedrine', 'AE', [ENTRY])).toBeNull();
  });
});
