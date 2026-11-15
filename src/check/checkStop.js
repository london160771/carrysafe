import { AppError } from '../core/errors.js';
import { paragraphPicker } from '../core/paragraphPicker.js';
import { searchTerms } from '../core/synonyms.js';
import { assertTransition, decideVerdict } from '../core/verdictState.js';
import { verifyQuote } from '../core/verifyQuote.js';
import { findCountrySources } from '../data/sourcesRegistry.js';
import { findFallback } from './fallbackVerdicts.js';
import { combinedHash, ruleCacheKey } from './ruleCacheKey.js';

export const UNCOVERED_ADVICE_URL = 'https://www.gov.uk/foreign-travel-advice';

function tracker(base) {
  const transitions = ['unchecked'];
  const move = (to, evidence) => {
    assertTransition(transitions.at(-1), to, evidence);
    transitions.push(to);
  };
  const finish = (verdict, details) => {
    move(verdict, { quoteVerified: details.quoteVerified === true });
    return { ...base, verdict, quoteVerified: false, quote: '', conditions: '', reason: '', inferenceSource: null, ...details, transitions };
  };
  return { move, finish };
}

function fromSaved(state, saved, reason) {
  return state.finish(saved.verdict, {
    origin: 'saved',
    savedOn: saved.savedOn,
    quote: saved.quote,
    quoteVerified: true,
    conditions: saved.conditions ?? '',
    sourceUrl: saved.sourceUrl,
    authority: saved.authority,
    reason,
  });
}

function fromCache(state, cached, pageTexts, origin) {
  const check = verifyQuote(cached.quote, pageTexts);
  if (!check.verified) return null;
  return state.finish(cached.verdict, { ...cached, origin, quoteVerified: true });
}

async function safeCacheGet(cache, key) {
  try {
    return await cache.get(key);
  } catch {
    return null;
  }
}

export async function checkIngredientAtStop({ ingredient, country }, { fetchSources, cloudVerdict, cache, now = () => new Date() }) {
  const terms = searchTerms(ingredient);
  const base = { ingredient: terms.canonical, country, checkedAt: now().toISOString() };
  const state = tracker(base);
  const registry = findCountrySources(country);
  if (!registry) return state.finish('not_covered', { origin: 'live', reason: 'country_not_covered', sourceUrl: UNCOVERED_ADVICE_URL, authority: 'Not covered yet: check with the embassy' });

  state.move('fetching');
  const firstSource = registry.urls[0];
  let pages = [];
  try {
    pages = (await fetchSources(country)).pages.filter((page) => !page.error);
  } catch (error) {
    if (!(error instanceof AppError)) throw error;
  }
  const saved = findFallback(terms.canonical, country);
  if (pages.length === 0) {
    if (saved) return fromSaved(state, saved, 'source_unavailable');
    return state.finish('not_confirmed', { origin: 'live', reason: 'source_unavailable', sourceUrl: firstSource.url, authority: firstSource.authority });
  }

  const pageTexts = pages.map((page) => page.text);
  const contentHash = combinedHash(pages);
  const key = ruleCacheKey(terms.canonical, country);
  const cached = await safeCacheGet(cache, key);
  if (cached?.contentHash === contentHash) {
    const reused = fromCache(state, cached, pageTexts, 'cache');
    if (reused) return reused;
  }

  const paragraphs = paragraphPicker(pages, terms);
  if (paragraphs.length === 0) {
    return state.finish('not_confirmed', { origin: 'live', reason: 'not_mentioned', sourceUrl: firstSource.url, authority: firstSource.authority, contentHash });
  }

  state.move('checking');
  let model;
  try {
    model = await cloudVerdict({ ingredient: terms.canonical, country, paragraphs: paragraphs.map((paragraph) => paragraph.text) });
  } catch (error) {
    if (!(error instanceof AppError)) throw error;
    const reused = cached ? fromCache(state, cached, pageTexts, 'cache') : null;
    if (reused) return { ...reused, reason: error.code };
    return state.finish('not_confirmed', { origin: 'live', reason: error.code, sourceUrl: firstSource.url, authority: firstSource.authority, contentHash });
  }

  const decision = decideVerdict({ modelVerdict: model.modelVerdict, quote: model.quote, pageTexts });
  const page = pages[decision.pageIndex ?? 0];
  const result = state.finish(decision.verdict, {
    origin: 'live',
    reason: decision.reason,
    quote: model.quote,
    quoteVerified: decision.quoteVerified,
    conditions: model.conditions,
    inferenceSource: model.inferenceSource,
    sourceUrl: page.url,
    authority: page.authority,
    fetchedAt: page.fetchedAt,
    contentHash,
  });
  if (decision.quoteVerified) {
    const entry = { ingredient: terms.canonical, country, verdict: result.verdict, quote: result.quote, conditions: result.conditions, sourceUrl: result.sourceUrl, authority: result.authority, fetchedAt: result.fetchedAt, contentHash };
    result.cacheWrite = await cache.set(key, entry).then(() => 'saved', () => 'failed');
  }
  return result;
}
