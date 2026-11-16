import { CustomProvider, initializeAppCheck, ReCaptchaEnterpriseProvider, ReCaptchaV3Provider } from 'firebase/app-check';
import { readAppCheckProvider } from './config.js';

export const APP_CHECK_DEBUG_STORAGE_KEY = 'carrysafe.appCheckDebugToken';

const PROVIDERS = {
  'recaptcha-v3': (siteKey) => new ReCaptchaV3Provider(siteKey),
  'recaptcha-enterprise': (siteKey) => new ReCaptchaEnterpriseProvider(siteKey),
};

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
  return readAppCheckProvider(import.meta.env)?.kind ?? 'debug-token';
}

export function initAppCheck(app) {
  const chosen = readAppCheckProvider(import.meta.env);
  if (!chosen) globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = readDebugToken();
  return initializeAppCheck(app, {
    provider: chosen ? PROVIDERS[chosen.kind](chosen.siteKey) : unavailableProvider(),
    isTokenAutoRefreshEnabled: true,
  });
}
