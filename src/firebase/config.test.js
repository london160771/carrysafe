import { describe, expect, it } from 'vitest';
import { readAppCheckSiteKey, readFirebaseConfig } from './config.js';

const FULL_ENV = {
  VITE_FIREBASE_API_KEY: 'key',
  VITE_FIREBASE_AUTH_DOMAIN: 'carry-safe-30940.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'carry-safe-30940',
  VITE_FIREBASE_APP_ID: 'app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '123',
};

describe('readFirebaseConfig', () => {
  it('maps env vars to the Firebase web config', () => {
    expect(readFirebaseConfig(FULL_ENV)).toEqual({
      apiKey: 'key',
      authDomain: 'carry-safe-30940.firebaseapp.com',
      projectId: 'carry-safe-30940',
      appId: 'app',
      messagingSenderId: '123',
    });
  });

  it('fails closed with config_missing naming the missing vars', () => {
    expect(() => readFirebaseConfig({})).toThrow(/config_missing: VITE_FIREBASE_API_KEY/);
  });

  it('returns null when no App Check site key is set', () => {
    expect(readAppCheckSiteKey({})).toBeNull();
    expect(readAppCheckSiteKey({ VITE_APPCHECK_SITE_KEY: 'k' })).toBe('k');
  });
});
