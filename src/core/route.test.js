import { describe, expect, it } from 'vitest';
import { expandChecks, stopsToCheck, validateRoute } from './route.js';

const ROUTE = [
  { country: 'NG', role: 'home' },
  { country: 'AE', role: 'layover' },
  { country: 'JP', role: 'destination' },
];

describe('route expansion (FR-ROUTE-001)', () => {
  it('validates the shape', () => {
    expect(validateRoute(ROUTE)).toEqual([]);
    expect(validateRoute([{ country: 'NG', role: 'home' }])).toEqual(['A route needs a home and a destination']);
    expect(validateRoute([{ country: 'JP', role: 'destination' }, { country: 'xx', role: 'home' }])).toEqual(
      expect.arrayContaining(['The first stop must be home', 'The last stop must be the destination', 'Unknown country code: xx']),
    );
  });

  it('checks layovers and the destination, not home, without duplicates', () => {
    expect(stopsToCheck([...ROUTE.slice(0, 2), { country: 'AE', role: 'layover' }, ROUTE[2]]).map((stop) => stop.country)).toEqual(['AE', 'JP']);
  });

  it('crosses confirmed ingredients with every checked stop', () => {
    const meds = [
      { confirmed: true, ingredients: ['pseudoephedrine hydrochloride', 'paracetamol'] },
      { confirmed: true, ingredients: ['acetaminophen'] },
      { confirmed: false, ingredients: ['codeine'] },
    ];
    expect(expandChecks(ROUTE, meds)).toEqual([
      { ingredient: 'pseudoephedrine', country: 'AE', role: 'layover' },
      { ingredient: 'paracetamol', country: 'AE', role: 'layover' },
      { ingredient: 'pseudoephedrine', country: 'JP', role: 'destination' },
      { ingredient: 'paracetamol', country: 'JP', role: 'destination' },
    ]);
  });
});
