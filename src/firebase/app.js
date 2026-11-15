import { getApp, getApps, initializeApp } from 'firebase/app';
import { readFirebaseConfig } from './config.js';
import { initAppCheck } from './appCheck.js';

export function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  const app = initializeApp(readFirebaseConfig(import.meta.env));
  initAppCheck(app);
  return app;
}
