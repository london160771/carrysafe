import { useSyncExternalStore } from 'react';
import { getSettings, subscribeSettings } from './settingsStore.js';

export function useSettings() {
  return useSyncExternalStore(subscribeSettings, getSettings, getSettings);
}
