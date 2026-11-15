import { expandChecks } from '../core/route.js';
import { checkIngredientAtStop } from './checkStop.js';

function memoiseByCountry(fetchSources) {
  const pending = new Map();
  return (country) => {
    if (!pending.has(country)) pending.set(country, fetchSources(country));
    return pending.get(country);
  };
}

export async function runRouteCheck(route, meds, deps, onProgress = () => {}) {
  const checks = expandChecks(route, meds);
  const fetchOnce = memoiseByCountry(deps.fetchSources);
  const results = [];
  for (const check of checks) {
    onProgress({ done: results.length, total: checks.length, current: check });
    const result = await checkIngredientAtStop(check, { ...deps, fetchSources: fetchOnce });
    results.push({ ...result, role: check.role });
  }
  onProgress({ done: results.length, total: checks.length, current: null });
  return results;
}
