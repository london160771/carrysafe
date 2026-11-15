import { describe, expect, it, vi } from 'vitest';
import { runRouteCheck } from './runRouteCheck.js';

describe('runRouteCheck', () => {
  it('checks every ingredient at every stop, fetching each country once', async () => {
    const fetchSources = vi.fn(async () => ({ pages: [{ url: 'u', authority: 'a', text: 'nothing relevant', contentHash: 'h' }] }));
    const progress = vi.fn();
    const route = [{ country: 'NG', role: 'home' }, { country: 'AE', role: 'layover' }, { country: 'JP', role: 'destination' }, { country: 'NG', role: 'destination' }];
    const meds = [{ confirmed: true, ingredients: ['loratadine', 'cetirizine'] }];
    const results = await runRouteCheck(route.slice(0, 3), meds, { fetchSources, cloudVerdict: vi.fn(), cache: { get: async () => null, set: async () => {} } }, progress);
    expect(results.map((result) => `${result.ingredient}@${result.country}:${result.verdict}`)).toEqual([
      'loratadine@AE:not_confirmed',
      'cetirizine@AE:not_confirmed',
      'loratadine@JP:not_confirmed',
      'cetirizine@JP:not_confirmed',
    ]);
    expect(fetchSources).toHaveBeenCalledTimes(2);
    expect(progress).toHaveBeenLastCalledWith({ done: 4, total: 4, current: null });
    expect(route).toHaveLength(4);
  });
});
