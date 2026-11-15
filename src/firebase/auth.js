import { connectAuthEmulator, getAuth, signInAnonymously } from 'firebase/auth';
import { getFirebaseApp } from './app.js';
import { AUTH_EMULATOR_PORT, EMULATOR_HOST, usesEmulators } from './emulators.js';

let connected = false;

export function getAppAuth() {
  const auth = getAuth(getFirebaseApp());
  if (usesEmulators(import.meta.env) && !connected) {
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`, { disableWarnings: true });
    connected = true;
  }
  return auth;
}

export async function signInAsGuest() {
  const auth = getAppAuth();
  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}
