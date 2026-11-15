import { useSyncExternalStore } from 'react';
import { outgoingEntries, subscribeOutgoing } from '../privacy/outgoingLog.js';

export function useOutgoingLog() {
  return useSyncExternalStore(subscribeOutgoing, outgoingEntries, outgoingEntries);
}
