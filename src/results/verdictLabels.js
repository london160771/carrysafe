export const VERDICT_LABELS = Object.freeze({
  allowed: { word: 'Allowed', tone: 'ok' },
  needs_documents: { word: 'Needs documents', tone: 'warn' },
  prohibited: { word: 'Prohibited', tone: 'bad' },
  not_confirmed: { word: 'Not confirmed', tone: 'quiet' },
  not_covered: { word: 'Not covered yet', tone: 'quiet' },
});

export const REASON_TEXT = Object.freeze({
  quote_not_found: 'We could not find the AI’s quote on the official page, so we can’t confirm this.',
  quote_too_short: 'The quote was too short to prove anything.',
  model_unsure: 'The official page is not clear about this medicine.',
  not_mentioned: 'The official page does not mention this medicine.',
  source_unavailable: 'We could not open the official page right now.',
  cloud_unavailable: 'The check is not working right now. Try again.',
  config_missing: 'Checks are not set up on this copy of the app.',
  country_not_covered: 'We don’t cover this country yet. Ask its embassy.',
});

export function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
}
