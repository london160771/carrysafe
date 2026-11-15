import { describe, expect, it } from 'vitest';
import { MIN_QUOTE_CHARS, verifyQuote } from './verifyQuote.js';

const PAGE = `It is illegal to carry some common prescription and over-the-counter medicines under Japan’s strictly enforced law on anti-stimulant drugs.
This includes:
cold and flu medication containing pseudoephedrine`;

describe('verifyQuote (INV-3, FR-CHECK-002)', () => {
  it('accepts an exact quote', () => {
    expect(verifyQuote('cold and flu medication containing pseudoephedrine', PAGE)).toEqual({ verified: true, pageIndex: 0 });
  });

  it('ignores whitespace and line breaks', () => {
    expect(verifyQuote('This includes:   cold and flu\nmedication', PAGE).verified).toBe(true);
  });

  it('ignores case', () => {
    expect(verifyQuote('COLD AND FLU MEDICATION CONTAINING PSEUDOEPHEDRINE', PAGE).verified).toBe(true);
  });

  it('applies NFKC (full-width letters) and folds curly quotes', () => {
    expect(verifyQuote('ｃｏｌｄ ａｎｄ ｆｌｕ medication', PAGE).verified).toBe(true);
    expect(verifyQuote("under Japan's strictly enforced law", PAGE).verified).toBe(true);
  });

  it('rejects a near miss', () => {
    expect(verifyQuote('cold and flu medication containing pseudoephedrine is allowed', PAGE)).toEqual({ verified: false, reason: 'quote_not_found' });
    expect(verifyQuote('cold and flu medicine containing pseudoephedrine', PAGE).verified).toBe(false);
  });

  it('rejects quotes too short to prove anything', () => {
    expect(verifyQuote('pseudoephedrine', PAGE)).toEqual({ verified: false, reason: 'quote_too_short' });
    expect(verifyQuote('', PAGE).reason).toBe('quote_too_short');
    expect(verifyQuote(null, PAGE).reason).toBe('quote_too_short');
    expect(MIN_QUOTE_CHARS).toBeGreaterThan(10);
  });

  it('searches several pages and reports which one matched', () => {
    expect(verifyQuote('cold and flu medication containing pseudoephedrine', ['other page text', PAGE])).toEqual({ verified: true, pageIndex: 1 });
  });
});
