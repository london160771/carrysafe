import { CustomProvider, initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';
import { readAppCheckSiteKey } from './config.js';

export const APP_CHECK_DEBUG_STORAGE_KEY = 'carrysafe.appCheckDebugToken';

function readDebugToken() {
  try {
    return globalThis.localStorage?.getItem(APP_CHECK_DEBUG_STORAGE_KEY) || true;
  } catch {
    return true;
  }
}

function unavailableProvider() {
  return new CustomProvider({
    getToken: () => Promise.reject(new Error('App Check debug token required')),
  });
}

export function appCheckMode() {
  return readAppCheckSiteKey(import.meta.env) ? 'recaptcha-enterprise' : 'debug-token';
}

export function initAppCheck(app) {
  const siteKey = readAppCheckSiteKey(import.meta.env);
  if (!siteKey) globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = readDebugToken();
  return initializeAppCheck(app, {
    provider: siteKey ? new ReCaptchaEnterpriseProvider(siteKey) : unavailableProvider(),
    isTokenAutoRefreshEnabled: true,
  });
}
