import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_SETTINGS, getSettings, subscribeSettings, updateSettings } from './settingsStore.js';

describe('settingsStore', () => {
  it('starts with defaults when storage is unavailable and notifies on change', () => {
    expect(getSettings()).toEqual(DEFAULT_SETTINGS);
    const listener = vi.fn();
    const unsubscribe = subscribeSettings(listener);
    updateSettings({ bigText: true, speechRate: 0.7 });
    expect(getSettings()).toMatchObject({ bigText: true, speechRate: 0.7, highContrast: false });
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});
