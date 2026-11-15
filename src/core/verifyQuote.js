import { normaliseText } from './normaliseText.js';

export const MIN_QUOTE_CHARS = 20;

export function verifyQuote(quote, pageText) {
  const normalisedQuote = normaliseText(quote ?? '');
  if (normalisedQuote.length < MIN_QUOTE_CHARS) return { verified: false, reason: 'quote_too_short' };
  const pages = Array.isArray(pageText) ? pageText : [pageText];
  const index = pages.findIndex((text) => normaliseText(text ?? '').includes(normalisedQuote));
  return index === -1 ? { verified: false, reason: 'quote_not_found' } : { verified: true, pageIndex: index };
}
