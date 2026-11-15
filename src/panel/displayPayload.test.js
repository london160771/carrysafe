import { describe, expect, it } from 'vitest';
import { displayPayload, MAX_SHOWN_CHARS } from './displayPayload.js';

describe('displayPayload', () => {
  it('shows short payloads exactly', () => {
    expect(displayPayload({ ingredient: 'pseudoephedrine', country: 'JP' })).toBe('{\n  "ingredient": "pseudoephedrine",\n  "country": "JP"\n}');
  });

  it('shortens very long strings and says how much is hidden', () => {
    const shown = JSON.parse(displayPayload({ brand: 'x'.repeat(MAX_SHOWN_CHARS + 5) }));
    expect(shown.brand).toBe(`${'x'.repeat(MAX_SHOWN_CHARS)}… (5 more characters)`);
  });
});
