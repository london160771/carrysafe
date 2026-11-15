export const ROUTE_COUNTRIES = Object.freeze(['NG', 'AE', 'JP', 'SG', 'GR', 'GB', 'US', 'QA', 'TR', 'FR', 'DE', 'NL', 'IN', 'KE', 'GH', 'ZA', 'EG', 'SA', 'CA', 'AU']);

const displayNames = new Intl.DisplayNames(['en'], { type: 'region' });

export function countryName(code) {
  return displayNames.of(code) ?? code;
}
