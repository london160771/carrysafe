import { describe, expect, it } from 'vitest';
import { createMedStore } from './medStore.js';
import { createMemoryKv } from './memoryKv.js';

const med = (id) => ({ id, ingredients: ['paracetamol'], confirmed: true });

describe('medStore (local only)', () => {
  it('saves, replaces, lists and removes confirmed medicines', async () => {
    const store = createMedStore(createMemoryKv());
    await store.saveMed(med('a'));
    await store.saveMed(med('b'));
    await store.saveMed({ ...med('a'), ingredients: ['ibuprofen'] });
    expect((await store.listMeds()).map((item) => [item.id, item.ingredients[0]])).toEqual([
      ['b', 'paracetamol'],
      ['a', 'ibuprofen'],
    ]);
    await store.removeMed('b');
    expect((await store.listMeds()).map((item) => item.id)).toEqual(['a']);
  });

  it('refuses unconfirmed medicines', async () => {
    const store = createMedStore(createMemoryKv());
    await expect(store.saveMed({ id: 'x', confirmed: false })).rejects.toThrow(RangeError);
  });

  it('keeps the traveller name locally', async () => {
    const store = createMedStore(createMemoryKv());
    expect(await store.getTravellerName()).toBe('');
    await store.setTravellerName('Mum');
    expect(await store.getTravellerName()).toBe('Mum');
  });
});
