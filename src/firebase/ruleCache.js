import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { recordOutgoing } from '../privacy/outgoingLog.js';
import { signInAsGuest } from './auth.js';
import { getDb } from './db.js';

export const RULES_COLLECTION = 'rules';

export function createRuleCache() {
  return {
    async get(key) {
      await signInAsGuest();
      const snapshot = await getDoc(doc(getDb(), RULES_COLLECTION, key));
      return snapshot.exists() ? snapshot.data() : null;
    },
    async set(key, entry) {
      await signInAsGuest();
      await setDoc(doc(getDb(), RULES_COLLECTION, key), { ...entry, updatedAt: serverTimestamp() });
      recordOutgoing({ channel: 'firestore', payload: { ruleCache: entry }, status: 'sent' });
    },
  };
}
