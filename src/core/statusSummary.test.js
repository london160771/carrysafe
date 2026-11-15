import { describe, expect, it } from 'vitest';
import { summariseStatus } from './statusSummary.js';

describe('summariseStatus (FR-GRP-001)', () => {
  it('keeps only the worst verdict per country and no ingredient names', () => {
    const status = summariseStatus([
      { ingredient: 'paracetamol', country: 'JP', verdict: 'allowed' },
      { ingredient: 'pseudoephedrine', country: 'JP', verdict: 'prohibited' },
      { ingredient: 'methylphenidate', country: 'AE', verdict: 'needs_documents' },
      { ingredient: 'paracetamol', country: 'AE', verdict: 'not_confirmed' },
    ]);
    expect(status).toEqual({ JP: 'prohibited', AE: 'needs_documents' });
    expect(JSON.stringify(status)).not.toMatch(/paracetamol|pseudoephedrine|methylphenidate/);
  });

  it('returns an empty map for no results', () => {
    expect(summariseStatus([])).toEqual({});
  });
});
