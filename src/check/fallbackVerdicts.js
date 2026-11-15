import savedVerdicts from '../data/fallback-verdicts.json' with { type: 'json' };
import { verifyQuote } from '../core/verifyQuote.js';

export function validateFallbacks(entries) {
  return entries.flatMap((entry) => {
    const label = `${entry.ingredient}_${entry.country}`;
    const problems = [];
    if (!['allowed', 'needs_documents', 'prohibited'].includes(entry.verdict)) problems.push(`${label}: verdict`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.savedOn ?? '')) problems.push(`${label}: savedOn`);
    if (!String(entry.sourceUrl ?? '').startsWith('https://')) problems.push(`${label}: sourceUrl`);
    if (!entry.authority) problems.push(`${label}: authority`);
    if (!verifyQuote(entry.quote, entry.pageExcerpt).verified) problems.push(`${label}: quote not in pageExcerpt`);
    return problems;
  });
}

export function findFallback(ingredient, country, entries = savedVerdicts) {
  return entries.find((entry) => entry.ingredient === ingredient && entry.country === country) ?? null;
}

export { savedVerdicts };
