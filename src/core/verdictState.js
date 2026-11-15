import { verifyQuote } from './verifyQuote.js';

export const VERDICTS = Object.freeze(['allowed', 'needs_documents', 'prohibited', 'not_confirmed', 'not_covered']);
export const QUOTE_REQUIRED = Object.freeze(['allowed', 'needs_documents', 'prohibited']);

const TRANSITIONS = Object.freeze({
  unchecked: ['fetching', 'not_covered'],
  fetching: ['checking', 'not_confirmed', 'allowed', 'needs_documents', 'prohibited'],
  checking: ['allowed', 'needs_documents', 'prohibited', 'not_confirmed'],
});

export function assertTransition(from, to, { quoteVerified = false } = {}) {
  if (!(TRANSITIONS[from] ?? []).includes(to)) throw new RangeError(`Illegal verdict transition ${from} → ${to}`);
  if (QUOTE_REQUIRED.includes(to) && !quoteVerified) throw new RangeError(`${to} needs a verified official quote`);
  return to;
}

export function decideVerdict({ modelVerdict, quote, pageTexts }) {
  if (!QUOTE_REQUIRED.includes(modelVerdict)) return { verdict: 'not_confirmed', reason: 'model_unsure', quoteVerified: false };
  const check = verifyQuote(quote, pageTexts);
  if (!check.verified) return { verdict: 'not_confirmed', reason: check.reason, quoteVerified: false };
  return { verdict: modelVerdict, reason: '', quoteVerified: true, pageIndex: check.pageIndex };
}
