import { describe, expect, it } from 'vitest';
import { COVERED_COUNTRIES, findCountrySources, isAllowedSourceUrl, sources, validateSources } from './sourcesRegistry.js';

describe('sources.json (FR-SRC-001)', () => {
  it('passes the schema', () => {
    expect(validateSources(sources)).toEqual([]);
  });

  it('covers exactly JP, AE, SG, GR, GB, US', () => {
    expect(sources.map((entry) => entry.country).sort()).toEqual([...COVERED_COUNTRIES].sort());
  });

  it('reports schema problems', () => {
    const problems = validateSources([{ country: 'jp', urls: [{ url: 'http://x' }] }, { country: 'jp', urls: [] }]);
    expect(problems).toEqual(
      expect.arrayContaining([
        'jp: country must be a 2-letter code',
        'jp: duplicate country',
        'jp: url must be https',
        'jp: authority missing',
        'jp: urls must be a non-empty array',
        'jp: lastVerified must be YYYY-MM-DD',
      ]),
    );
  });

  it('finds a country and rejects others', () => {
    expect(findCountrySources('JP').urls.length).toBeGreaterThan(0);
    expect(findCountrySources('NG')).toBeNull();
  });

  it('allows only listed URLs', () => {
    expect(isAllowedSourceUrl(sources[0].urls[0].url)).toBe(true);
    expect(isAllowedSourceUrl('https://example.com/')).toBe(false);
  });
});
