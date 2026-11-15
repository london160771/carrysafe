import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirebaseApp } from './app.js';

export function getAppAuth() {
  return getAuth(getFirebaseApp());
}

export async function signInAsGuest() {
  const auth = getAppAuth();
  if (auth.currentUser) return auth.currentUser;
  const credential = await signInAnonymously(auth);
  return credential.user;
}
