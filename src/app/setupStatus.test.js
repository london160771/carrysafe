import { describe, expect, it } from 'vitest';
import { describeSetup } from './setupStatus.js';

describe('describeSetup', () => {
  it('reports missing config without throwing', () => {
    const [firebase, appCheck, device] = describeSetup({}, false);
    expect(firebase.ok).toBe(false);
    expect(firebase.label).toMatch(/VITE_FIREBASE_API_KEY/);
    expect(appCheck.ok).toBe(false);
    expect(device.ok).toBe(false);
  });

  it('reports a configured setup', () => {
    const env = {
      VITE_FIREBASE_API_KEY: 'a',
      VITE_FIREBASE_AUTH_DOMAIN: 'b',
      VITE_FIREBASE_PROJECT_ID: 'c',
      VITE_FIREBASE_APP_ID: 'd',
      VITE_APPCHECK_SITE_KEY: 'e',
    };
    expect(describeSetup(env, true).every((item) => item.ok)).toBe(true);
  });
});
