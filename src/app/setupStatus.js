import { readAppCheckSiteKey, readFirebaseConfig } from '../firebase/config.js';

export function describeSetup(env, hasPromptApi) {
  let firebase;
  try {
    readFirebaseConfig(env);
    firebase = { ok: true, label: 'Firebase web config found' };
  } catch (error) {
    firebase = { ok: false, label: `Firebase not configured (${error.detail})` };
  }
  return [
    firebase,
    readAppCheckSiteKey(env)
      ? { ok: true, label: 'App Check: reCAPTCHA Enterprise' }
      : { ok: false, label: 'App Check: debug token mode (register the token in the Firebase console)' },
    hasPromptApi
      ? { ok: true, label: 'On-device model API found in this browser' }
      : { ok: false, label: 'On-device model API not found: scanning needs desktop Chrome 139+' },
  ];
}
