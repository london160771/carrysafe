import { describe, expect, it } from 'vitest';
import { cardItems, UNKNOWN_QUANTITY } from './cardText.js';

describe('cardItems (FR-CARD-001)', () => {
  it('uses generic names and quantities only, from confirmed medicines', () => {
    const meds = [
      { confirmed: true, brand: 'Secret Brand', ingredients: ['pseudoephedrine'], strength: '60 mg', quantity: '24 tablets' },
      { confirmed: true, ingredients: ['orphenadrine', 'paracetamol'], strength: null, quantity: null },
      { confirmed: false, ingredients: ['codeine'] },
    ];
    expect(cardItems(meds)).toEqual([
      { genericName: 'pseudoephedrine', quantity: '60 mg, 24 tablets' },
      { genericName: 'orphenadrine + paracetamol', quantity: UNKNOWN_QUANTITY },
    ]);
  });
});
