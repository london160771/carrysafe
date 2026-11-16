import { AppError } from '../core/errors.js';

const REQUIRED_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  appId: 'VITE_FIREBASE_APP_ID',
};

const OPTIONAL_KEYS = {
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
};

export function readFirebaseConfig(env) {
  const missing = Object.values(REQUIRED_KEYS).filter((name) => !env[name]);
  if (missing.length > 0) throw new AppError('config_missing', missing.join(', '));
  const config = {};
  for (const [field, name] of Object.entries({ ...REQUIRED_KEYS, ...OPTIONAL_KEYS })) {
    if (env[name]) config[field] = env[name];
  }
  return config;
}

export function readAppCheckProvider(env) {
  if (env.VITE_RECAPTCHA_SITE_KEY) return { kind: 'recaptcha-v3', siteKey: env.VITE_RECAPTCHA_SITE_KEY };
  if (env.VITE_APPCHECK_SITE_KEY) return { kind: 'recaptcha-enterprise', siteKey: env.VITE_APPCHECK_SITE_KEY };
  return null;
}
