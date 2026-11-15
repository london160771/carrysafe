import { describe, expect, it } from 'vitest';
import { createMemoryKv } from './memoryKv.js';
import { createTripStore, DEFAULT_ROUTE } from './tripStore.js';

describe('tripStore', () => {
  it('starts with the default route and saves edits and results locally', async () => {
    const store = createTripStore(createMemoryKv());
    expect(await store.getRoute()).toEqual(DEFAULT_ROUTE);
    await store.setRoute([{ country: 'NG', role: 'home' }, { country: 'AE', role: 'destination' }]);
    expect((await store.getRoute())[1].country).toBe('AE');
    await store.setResults([{ verdict: 'allowed' }]);
    expect(await store.getResults()).toEqual([{ verdict: 'allowed' }]);
  });
});
