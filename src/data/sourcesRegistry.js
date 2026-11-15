import sources from './sources.json' with { type: 'json' };

export const COVERED_COUNTRIES = Object.freeze(['JP', 'AE', 'SG', 'GR', 'GB', 'US']);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const COUNTRY_CODE = /^[A-Z]{2}$/;

export function validateSources(entries) {
  const problems = [];
  const seen = new Set();
  for (const entry of entries) {
    const label = entry?.country ?? '(missing country)';
    if (!COUNTRY_CODE.test(entry?.country ?? '')) problems.push(`${label}: country must be a 2-letter code`);
    if (seen.has(entry?.country)) problems.push(`${label}: duplicate country`);
    seen.add(entry?.country);
    if (!entry?.name) problems.push(`${label}: name missing`);
    if (!entry?.language) problems.push(`${label}: language missing`);
    if (!ISO_DATE.test(entry?.lastVerified ?? '')) problems.push(`${label}: lastVerified must be YYYY-MM-DD`);
    if (!Array.isArray(entry?.urls) || entry.urls.length === 0) problems.push(`${label}: urls must be a non-empty array`);
    for (const source of entry?.urls ?? []) {
      if (!source.authority) problems.push(`${label}: authority missing`);
      if (!String(source.url ?? '').startsWith('https://')) problems.push(`${label}: url must be https`);
    }
  }
  return problems;
}

export function findCountrySources(country) {
  return sources.find((entry) => entry.country === country) ?? null;
}

export function isAllowedSourceUrl(url) {
  return sources.some((entry) => entry.urls.some((source) => source.url === url));
}

export { sources };
