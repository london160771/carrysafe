import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { AppError } from '../core/errors.js';
import { recordOutgoing } from '../privacy/outgoingLog.js';
import { signInAsGuest } from './auth.js';
import { getDb } from './db.js';

export function toTripError(error) {
  if (error instanceof AppError) return error;
  if (error?.code === 'permission-denied') return new AppError('not_trip_member', 'permission-denied');
  return new AppError('cloud_unavailable', error?.message ?? 'firestore');
}

async function write(label, payload, action) {
  try {
    const result = await action();
    recordOutgoing({ channel: 'firestore', payload: { [label]: payload }, status: 'sent' });
    return result;
  } catch (error) {
    recordOutgoing({ channel: 'firestore', payload: { [label]: payload }, status: 'blocked', detail: error.code ?? error.message });
    throw toTripError(error);
  }
}

export async function createGroupTrip(route, displayLabel) {
  const user = await signInAsGuest();
  const trip = { route, createdAt: serverTimestamp(), createdBy: user.uid };
  const reference = await write('trip', { route }, () => addDoc(collection(getDb(), 'trips'), trip));
  await joinGroupTrip(reference.id, displayLabel);
  return reference.id;
}

export async function joinGroupTrip(tripId, displayLabel) {
  const user = await signInAsGuest();
  await write('member', { displayLabel }, () => setDoc(doc(getDb(), 'trips', tripId, 'members', user.uid), { displayLabel, joinedAt: serverTimestamp() }));
  return user.uid;
}

export async function publishStatus(tripId, perCountry) {
  const user = await signInAsGuest();
  await write('status', { perCountry }, () => setDoc(doc(getDb(), 'trips', tripId, 'status', user.uid), { perCountry, updatedAt: serverTimestamp() }));
}

export async function leaveGroupTrip(tripId) {
  const user = await signInAsGuest();
  await write('leave', { tripId }, async () => {
    await deleteDoc(doc(getDb(), 'trips', tripId, 'status', user.uid));
    await deleteDoc(doc(getDb(), 'trips', tripId, 'members', user.uid));
  });
}

export function subscribeGroup(tripId, onChange, onError) {
  const state = { members: {}, status: {} };
  const emit = () => onChange({ members: { ...state.members }, status: { ...state.status } });
  const listen = (name) =>
    onSnapshot(
      collection(getDb(), 'trips', tripId, name),
      (snapshot) => {
        state[name] = Object.fromEntries(snapshot.docs.map((item) => [item.id, item.data()]));
        emit();
      },
      (error) => onError(toTripError(error)),
    );
  const stops = [listen('members'), listen('status')];
  return () => stops.forEach((stop) => stop());
}

export const LAB_OTHER_TRIP_ID = 'lab-someone-elses-trip';

export async function readTripStatusAsOutsider() {
  await signInAsGuest();
  try {
    return await getDoc(doc(getDb(), 'trips', LAB_OTHER_TRIP_ID, 'status', 'someone'));
  } catch (error) {
    throw toTripError(error);
  }
}

export async function readGroupTrip(tripId) {
  await signInAsGuest();
  try {
    const snapshot = await getDoc(doc(getDb(), 'trips', tripId));
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    throw toTripError(error);
  }
}
