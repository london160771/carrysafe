import { describe, expect, it } from 'vitest';
import { confirmMedicine, createDraft, ingredientsForCloud } from './medicine.js';

describe('medicine confirm step (INV-6, FR-SCAN-003)', () => {
  const draft = createDraft({ source: 'device', brand: 'Orphesic', ingredients: [' Orphenadrine Citrate', 'PARACETAMOL', 'paracetamol', ''] });

  it('normalises and dedupes extracted ingredients but starts unconfirmed', () => {
    expect(draft.ingredients).toEqual(['orphenadrine citrate', 'paracetamol']);
    expect(draft.confirmed).toBe(false);
  });

  it('blocks cloud use of unconfirmed ingredients', () => {
    expect(() => ingredientsForCloud(draft)).toThrow(expect.objectContaining({ code: 'field_not_allowed' }));
    expect(() => ingredientsForCloud(undefined)).toThrow(expect.objectContaining({ code: 'field_not_allowed' }));
  });

  it('releases ingredients only after the user confirms, using their edits', () => {
    const confirmed = confirmMedicine(draft, { id: 'm1', ingredients: ['orphenadrine', 'paracetamol'] });
    expect(ingredientsForCloud(confirmed)).toEqual(['orphenadrine', 'paracetamol']);
    expect(confirmed.id).toBe('m1');
  });

  it('refuses to confirm an empty list', () => {
    expect(() => confirmMedicine(draft, { id: 'm2', ingredients: [' '] })).toThrow(RangeError);
  });

  it('rejects unknown sources', () => {
    expect(() => createDraft({ source: 'web' })).toThrow(TypeError);
  });
});
