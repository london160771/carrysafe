const STORAGE_KEY = 'carrysafe.settings';
export const SPEECH_RATE_RANGE = Object.freeze({ min: 0.5, max: 1.5, step: 0.1 });
export const DEFAULT_SETTINGS = Object.freeze({ bigText: false, highContrast: false, speechRate: 1 });

function load() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(globalThis.localStorage?.getItem(STORAGE_KEY) ?? '{}') };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

let settings = load();
const listeners = new Set();

export function getSettings() {
  return settings;
}

export function updateSettings(patch) {
  settings = { ...settings, ...patch };
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    settings = { ...settings };
  }
  listeners.forEach((listener) => listener());
}

export function subscribeSettings(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
