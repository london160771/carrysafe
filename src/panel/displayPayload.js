export const MAX_SHOWN_CHARS = 300;

export function displayPayload(payload) {
  return JSON.stringify(
    payload,
    (_key, value) => (typeof value === 'string' && value.length > MAX_SHOWN_CHARS ? `${value.slice(0, MAX_SHOWN_CHARS)}… (${value.length - MAX_SHOWN_CHARS} more characters)` : value),
    2,
  );
}
