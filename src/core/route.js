import { canonicalIngredient } from './synonyms.js';

export const STOP_ROLES = Object.freeze(['home', 'layover', 'destination']);

export function validateRoute(route) {
  const problems = [];
  if (!Array.isArray(route) || route.length < 2) problems.push('A route needs a home and a destination');
  else {
    if (route[0].role !== 'home') problems.push('The first stop must be home');
    if (route.at(-1).role !== 'destination') problems.push('The last stop must be the destination');
    route.slice(1, -1).forEach((stop) => stop.role !== 'layover' && problems.push('Stops in between must be layovers'));
    route.forEach((stop) => !/^[A-Z]{2}$/.test(stop.country ?? '') && problems.push(`Unknown country code: ${stop.country}`));
  }
  return problems;
}

export function stopsToCheck(route) {
  const seen = new Set();
  return route
    .filter((stop) => stop.role !== 'home')
    .filter((stop) => !seen.has(stop.country) && seen.add(stop.country));
}

export function expandChecks(route, meds) {
  const stops = stopsToCheck(route);
  const ingredients = [...new Set(meds.filter((med) => med.confirmed).flatMap((med) => med.ingredients.map(canonicalIngredient)))];
  return stops.flatMap((stop) => ingredients.map((ingredient) => ({ ingredient, country: stop.country, role: stop.role })));
}
