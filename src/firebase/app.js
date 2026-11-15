import { getApp, getApps, initializeApp } from 'firebase/app';
import { initAppCheck } from './appCheck.js';
import { readFirebaseConfig } from './config.js';
import { usesEmulators } from './emulators.js';

export function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  const app = initializeApp(readFirebaseConfig(import.meta.env));
  if (!usesEmulators(import.meta.env)) initAppCheck(app);
  return app;
}
