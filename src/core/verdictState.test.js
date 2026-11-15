import { describe, expect, it } from 'vitest';
import { assertTransition, decideVerdict } from './verdictState.js';

const PAGE = 'All Travelers carrying controlled medication into the UAE must apply for approval through the Ministry of Health (MoH) website.';

describe('verdict state machine (PRD §11)', () => {
  it('walks the happy path', () => {
    expect(assertTransition('unchecked', 'fetching')).toBe('fetching');
    expect(assertTransition('fetching', 'checking')).toBe('checking');
    expect(assertTransition('checking', 'prohibited', { quoteVerified: true })).toBe('prohibited');
  });

  it('allows not_covered only from unchecked and not_confirmed without a quote', () => {
    expect(assertTransition('unchecked', 'not_covered')).toBe('not_covered');
    expect(assertTransition('checking', 'not_confirmed')).toBe('not_confirmed');
    expect(() => assertTransition('checking', 'not_covered')).toThrow(RangeError);
  });

  it('throws on illegal transitions', () => {
    expect(() => assertTransition('unchecked', 'allowed', { quoteVerified: true })).toThrow(/Illegal/);
    expect(() => assertTransition('allowed', 'prohibited', { quoteVerified: true })).toThrow(/Illegal/);
  });

  it('refuses ✅/⛔/documents without a verified quote (INV-3)', () => {
    for (const verdict of ['allowed', 'prohibited', 'needs_documents']) {
      expect(() => assertTransition('checking', verdict)).toThrow(/verified official quote/);
    }
  });
});

describe('decideVerdict', () => {
  it('keeps the model verdict when the quote is on the page', () => {
    expect(decideVerdict({ modelVerdict: 'needs_documents', quote: 'must apply for approval through the Ministry of Health', pageTexts: [PAGE] })).toEqual({
      verdict: 'needs_documents',
      reason: '',
      quoteVerified: true,
      pageIndex: 0,
    });
  });

  it('downgrades to not_confirmed when the quote is invented', () => {
    expect(decideVerdict({ modelVerdict: 'prohibited', quote: 'Methylphenidate is banned in the UAE in all forms.', pageTexts: [PAGE] })).toMatchObject({
      verdict: 'not_confirmed',
      reason: 'quote_not_found',
    });
  });

  it('treats unknown model output as not_confirmed', () => {
    expect(decideVerdict({ modelVerdict: 'safe', quote: PAGE, pageTexts: [PAGE] })).toMatchObject({ verdict: 'not_confirmed', reason: 'model_unsure' });
  });
});
