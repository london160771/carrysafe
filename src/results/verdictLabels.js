export const VERDICT_LABELS = Object.freeze({
  allowed: { icon: '✅', word: 'Allowed', tone: 'success' },
  needs_documents: { icon: '⚠', word: 'Needs documents', tone: 'warning' },
  prohibited: { icon: '⛔', word: 'Prohibited', tone: 'danger' },
  not_confirmed: { icon: '⚠', word: 'Not confirmed', tone: 'secondary' },
  not_covered: { icon: '⚠', word: 'Not covered yet', tone: 'secondary' },
});

export const REASON_TEXT = Object.freeze({
  quote_not_found: 'The AI’s quote was not found on the official page, so we can’t confirm it.',
  quote_too_short: 'The AI’s quote was too short to prove anything.',
  model_unsure: 'The official text does not clearly cover this ingredient.',
  not_mentioned: 'The official page does not mention this ingredient.',
  source_unavailable: 'The official page could not be fetched right now.',
  cloud_unavailable: 'The cloud check is unavailable right now. Try again.',
  config_missing: 'The cloud check is not set up on this copy of the app.',
  country_not_covered: 'This country is not covered yet. Check with its embassy.',
});

export function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
}
