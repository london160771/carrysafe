import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../core/errors.js';
import { checkIngredientAtStop } from './checkStop.js';

const FCDO_TEXT = [
  'It is illegal to carry some common prescription and over-the-counter medicines under Japan’s strictly enforced law on anti-stimulant drugs.',
  'This includes:',
  'cold and flu medication containing pseudoephedrine',
].join('\n');

const PAGES = { pages: [{ url: 'https://www.gov.uk/foreign-travel-advice/japan/health', authority: 'UK FCDO', text: FCDO_TEXT, contentHash: 'h1', fetchedAt: '2026-11-15T10:00:00.000Z' }] };
const NOW = () => new Date('2026-11-15T12:00:00Z');

function memoryCache(initial = {}) {
  const data = { ...initial };
  return { data, get: vi.fn(async (key) => data[key] ?? null), set: vi.fn(async (key, value) => void (data[key] = value)) };
}

function deps(overrides = {}) {
  return {
    fetchSources: vi.fn(async () => PAGES),
    cloudVerdict: vi.fn(async () => ({ modelVerdict: 'prohibited', quote: 'cold and flu medication containing pseudoephedrine', conditions: 'Do not bring it.', inferenceSource: 'in_cloud' })),
    cache: memoryCache(),
    now: NOW,
    ...overrides,
  };
}

describe('checkIngredientAtStop (FR-CHECK-001..005)', () => {
  it('returns a verified verdict, sends only allow-listed data and caches it without user fields', async () => {
    const d = deps();
    const result = await checkIngredientAtStop({ ingredient: 'Pseudoephedrine Hydrochloride', country: 'JP' }, d);
    expect(result).toMatchObject({ verdict: 'prohibited', quoteVerified: true, origin: 'live', inferenceSource: 'in_cloud', authority: 'UK FCDO', cacheWrite: 'saved' });
    expect(result.transitions).toEqual(['unchecked', 'fetching', 'checking', 'prohibited']);
    expect(Object.keys(d.cloudVerdict.mock.calls[0][0]).sort()).toEqual(['country', 'ingredient', 'paragraphs']);
    expect(Object.keys(d.cache.data.pseudoephedrine_JP).sort()).toEqual(['authority', 'conditions', 'contentHash', 'country', 'fetchedAt', 'ingredient', 'quote', 'sourceUrl', 'verdict']);
  });

  it('downgrades an invented quote to not_confirmed and does not cache it', async () => {
    const d = deps({ cloudVerdict: vi.fn(async () => ({ modelVerdict: 'prohibited', quote: 'Pseudoephedrine is banned everywhere in Japan.', conditions: '', inferenceSource: 'in_cloud' })) });
    const result = await checkIngredientAtStop({ ingredient: 'pseudoephedrine', country: 'JP' }, d);
    expect(result).toMatchObject({ verdict: 'not_confirmed', reason: 'quote_not_found', quoteVerified: false });
    expect(d.cache.set).not.toHaveBeenCalled();
  });

  it('reuses a cached verdict when the page has not changed', async () => {
    const cached = { verdict: 'prohibited', quote: 'cold and flu medication containing pseudoephedrine', contentHash: 'h1', sourceUrl: 'u', authority: 'UK FCDO' };
    const d = deps({ cache: memoryCache({ pseudoephedrine_JP: cached }) });
    const result = await checkIngredientAtStop({ ingredient: 'pseudoephedrine', country: 'JP' }, d);
    expect(result).toMatchObject({ verdict: 'prohibited', origin: 'cache' });
    expect(d.cloudVerdict).not.toHaveBeenCalled();
  });

  it('shows the cached verdict when the cloud is unavailable', async () => {
    const cached = { verdict: 'prohibited', quote: 'cold and flu medication containing pseudoephedrine', contentHash: 'old', sourceUrl: 'u', authority: 'UK FCDO' };
    const d = deps({ cache: memoryCache({ pseudoephedrine_JP: cached }), cloudVerdict: vi.fn(async () => Promise.reject(new AppError('cloud_unavailable', 'quota'))) });
    const result = await checkIngredientAtStop({ ingredient: 'pseudoephedrine', country: 'JP' }, d);
    expect(result).toMatchObject({ verdict: 'prohibited', origin: 'cache', reason: 'cloud_unavailable' });
  });

  it('is not_confirmed when the cloud fails and nothing is cached', async () => {
    const d = deps({ cloudVerdict: vi.fn(async () => Promise.reject(new AppError('cloud_unavailable'))) });
    await expect(checkIngredientAtStop({ ingredient: 'pseudoephedrine', country: 'JP' }, d)).resolves.toMatchObject({ verdict: 'not_confirmed', reason: 'cloud_unavailable' });
  });

  it('is not_confirmed without a cloud call when the page never mentions the ingredient', async () => {
    const d = deps();
    const result = await checkIngredientAtStop({ ingredient: 'loratadine', country: 'JP' }, d);
    expect(result).toMatchObject({ verdict: 'not_confirmed', reason: 'not_mentioned' });
    expect(d.cloudVerdict).not.toHaveBeenCalled();
  });

  it('is not_covered for countries outside the registry, with no fetch', async () => {
    const d = deps();
    const result = await checkIngredientAtStop({ ingredient: 'paracetamol', country: 'NG' }, d);
    expect(result).toMatchObject({ verdict: 'not_covered', reason: 'country_not_covered' });
    expect(d.fetchSources).not.toHaveBeenCalled();
  });

  it('is not_confirmed when the official page cannot be fetched and there is no saved copy', async () => {
    const d = deps({ fetchSources: vi.fn(async () => Promise.reject(new AppError('source_unavailable', 'timeout'))) });
    await expect(checkIngredientAtStop({ ingredient: 'loratadine', country: 'JP' }, d)).resolves.toMatchObject({ verdict: 'not_confirmed', reason: 'source_unavailable' });
  });

  it('treats a cache read failure as a miss', async () => {
    const d = deps({ cache: { get: async () => Promise.reject(new Error('permission-denied')), set: async () => Promise.reject(new Error('x')) } });
    await expect(checkIngredientAtStop({ ingredient: 'pseudoephedrine', country: 'JP' }, d)).resolves.toMatchObject({ verdict: 'prohibited', cacheWrite: 'failed' });
  });
});
