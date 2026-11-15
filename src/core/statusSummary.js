export const SEVERITY = Object.freeze(['allowed', 'not_covered', 'not_confirmed', 'needs_documents', 'prohibited']);

export function summariseStatus(results) {
  const perCountry = {};
  for (const { country, verdict } of results) {
    const current = perCountry[country];
    if (!current || SEVERITY.indexOf(verdict) > SEVERITY.indexOf(current)) perCountry[country] = verdict;
  }
  return perCountry;
}
