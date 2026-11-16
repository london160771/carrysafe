export const ERROR_CODES = Object.freeze({
  field_not_allowed: { retryable: false, nextAction: 'Fix the caller; nothing was sent' },
  image_not_allowed: { retryable: false, nextAction: 'Use on-device extraction or type the name' },
  nano_unavailable: { retryable: false, nextAction: 'Type or speak the medicine' },
  label_unreadable: { retryable: true, nextAction: 'Follow the hint and rescan' },
  source_not_allowed: { retryable: false, nextAction: 'Country shows "not covered yet"' },
  source_unavailable: { retryable: true, nextAction: 'Saved copy shown with its date, or ⚠' },
  quote_not_found: { retryable: true, nextAction: 'Shown as ⚠ with the official link' },
  country_not_covered: { retryable: false, nextAction: 'Embassy link' },
  cloud_unavailable: { retryable: true, nextAction: 'Retry; cached verdict shown if present' },
  not_trip_member: { retryable: false, nextAction: 'Ask for an invite' },
  card_link_invalid: { retryable: false, nextAction: 'Make the card again and scan the new code' },
  config_missing: { retryable: false, nextAction: 'Add the Firebase web config to .env.local' },
});

export class AppError extends Error {
  constructor(code, detail = '') {
    const spec = ERROR_CODES[code];
    if (!spec) throw new TypeError(`Unknown error code: ${code}`);
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'AppError';
    this.code = code;
    this.retryable = spec.retryable;
    this.nextAction = spec.nextAction;
    this.detail = detail;
  }

  toJSON() {
    return { code: this.code, retryable: this.retryable, nextAction: this.nextAction, detail: this.detail };
  }
}
