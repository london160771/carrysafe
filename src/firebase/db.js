import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './app.js';
import { EMULATOR_HOST, FIRESTORE_EMULATOR_PORT, usesEmulators } from './emulators.js';

let connected = false;

export function getDb() {
  const db = getFirestore(getFirebaseApp());
  if (usesEmulators(import.meta.env) && !connected) {
    connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
    connected = true;
  }
  return db;
}
