import { getFirestore } from 'firebase/firestore';
import { getFirebaseApp } from './app.js';

export function getDb() {
  return getFirestore(getFirebaseApp());
}
