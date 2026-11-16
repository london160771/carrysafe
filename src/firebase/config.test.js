import { describe, expect, it } from 'vitest';
import { readAppCheckProvider, readFirebaseConfig } from './config.js';

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
    expect(readAppCheckProvider({})).toBeNull();
  });

  it('prefers reCAPTCHA v3 over Enterprise when both keys are set', () => {
    expect(readAppCheckProvider({ VITE_APPCHECK_SITE_KEY: 'e' })).toEqual({ kind: 'recaptcha-enterprise', siteKey: 'e' });
    expect(readAppCheckProvider({ VITE_APPCHECK_SITE_KEY: 'e', VITE_RECAPTCHA_SITE_KEY: 'v' })).toEqual({ kind: 'recaptcha-v3', siteKey: 'v' });
  });
});
