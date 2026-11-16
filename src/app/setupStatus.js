import { readAppCheckSiteKey, readFirebaseConfig } from '../firebase/config.js';

export function describeSetup(env, hasPromptApi) {
  let firebase;
  try {
    readFirebaseConfig(env);
    firebase = { ok: true, label: 'Firebase connected' };
  } catch (error) {
    firebase = { ok: false, label: `Firebase not configured (${error.detail})` };
  }
  return [
    firebase,
    readAppCheckSiteKey(env)
      ? { ok: true, label: 'Cloud check protected by reCAPTCHA' }
      : { ok: false, label: 'Cloud check in test mode: needs a registered debug token' },
    hasPromptApi
      ? { ok: true, label: 'Label reading works in this browser' }
      : { ok: false, label: 'Label reading needs desktop Chrome 139+' },
  ];
}
