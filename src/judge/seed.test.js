import { describe, expect, it } from 'vitest';
import { expandChecks, validateRoute } from '../core/route.js';
import { DEMO_MEDS, DEMO_ROUTE } from './seed.js';

describe('seed "Amaka-Tokyo" (PRD §19)', () => {
  it('is a valid Lagos → Dubai → Tokyo route with 3 confirmed, labelled demo medicines', () => {
    expect(validateRoute(DEMO_ROUTE)).toEqual([]);
    expect(DEMO_MEDS.every((med) => med.demo && med.confirmed)).toBe(true);
  });

  it('expands to 3 ingredients × 2 stops, layover included', () => {
    expect(expandChecks(DEMO_ROUTE, DEMO_MEDS).map((check) => `${check.ingredient}@${check.country}`)).toEqual([
      'methylphenidate@AE',
      'pseudoephedrine@AE',
      'paracetamol@AE',
      'methylphenidate@JP',
      'pseudoephedrine@JP',
      'paracetamol@JP',
    ]);
  });
});
