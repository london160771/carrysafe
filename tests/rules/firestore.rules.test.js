import { readFileSync } from 'node:fs';
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

const ROUTE = [{ country: 'NG', role: 'home' }, { country: 'JP', role: 'destination' }];
let env;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-carrysafe',
    firestore: { rules: readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'trips/t1'), { route: ROUTE, createdAt: 1, createdBy: 'amaka' });
    await setDoc(doc(db, 'trips/t1/members/amaka'), { displayLabel: 'Amaka', joinedAt: 1 });
    await setDoc(doc(db, 'trips/t1/members/mum'), { displayLabel: 'Mum', joinedAt: 1 });
    await setDoc(doc(db, 'trips/t1/status/mum'), { perCountry: { JP: 'prohibited' }, updatedAt: 1 });
  });
});

const as = (uid) => env.authenticatedContext(uid).firestore();

describe('firestore.rules (INV-4, FR-GRP-001, lab #5)', () => {
  it('lets members read the trip, members and status', async () => {
    await assertSucceeds(getDoc(doc(as('amaka'), 'trips/t1')));
    await assertSucceeds(getDoc(doc(as('amaka'), 'trips/t1/status/mum')));
  });

  it('denies non-members and signed-out users', async () => {
    await assertFails(getDoc(doc(as('stranger'), 'trips/t1/status/mum')));
    await assertFails(getDoc(doc(as('stranger'), 'trips/t1')));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'trips/t1/members/mum')));
  });

  it("stops a member writing another member's status", async () => {
    await assertFails(setDoc(doc(as('amaka'), 'trips/t1/status/mum'), { perCountry: { JP: 'allowed' }, updatedAt: 2 }));
    await assertSucceeds(setDoc(doc(as('amaka'), 'trips/t1/status/amaka'), { perCountry: { AE: 'needs_documents' }, updatedAt: 2 }));
  });

  it('rejects medicine fields in status', async () => {
    await assertFails(setDoc(doc(as('amaka'), 'trips/t1/status/amaka'), { perCountry: { JP: 'prohibited' }, medicine: 'pseudoephedrine', updatedAt: 2 }));
    await assertFails(setDoc(doc(as('amaka'), 'trips/t1/status/amaka'), { perCountry: { pseudoephedrine: 'prohibited' }, updatedAt: 2 }));
    await assertFails(setDoc(doc(as('amaka'), 'trips/t1/status/amaka'), { perCountry: { JP: 'pseudoephedrine' }, updatedAt: 2 }));
  });

  it('lets a user join with an invite (self member doc only) and leave', async () => {
    await assertSucceeds(setDoc(doc(as('dad'), 'trips/t1/members/dad'), { displayLabel: 'Dad', joinedAt: 2 }));
    await assertFails(setDoc(doc(as('dad'), 'trips/t1/members/mum'), { displayLabel: 'Not mum', joinedAt: 2 }));
    await assertFails(setDoc(doc(as('dad'), 'trips/t1/members/dad'), { displayLabel: 'Dad', condition: 'ADHD', joinedAt: 2 }));
    await assertSucceeds(deleteDoc(doc(as('mum'), 'trips/t1/members/mum')));
  });

  it('only lets the creator create or change the trip', async () => {
    await assertSucceeds(setDoc(doc(as('dad'), 'trips/t2'), { route: ROUTE, createdAt: 2, createdBy: 'dad' }));
    await assertFails(setDoc(doc(as('dad'), 'trips/t3'), { route: ROUTE, createdAt: 2, createdBy: 'amaka' }));
    await assertFails(setDoc(doc(as('mum'), 'trips/t1'), { route: ROUTE, createdAt: 3, createdBy: 'mum' }));
  });

  it('keeps the rule cache free of user fields', async () => {
    const entry = { ingredient: 'pseudoephedrine', country: 'JP', verdict: 'prohibited', quote: 'q', sourceUrl: 'u', authority: 'a', fetchedAt: 't', contentHash: 'h', conditions: '' };
    await assertSucceeds(setDoc(doc(as('amaka'), 'rules/pseudoephedrine_JP'), entry));
    await assertFails(setDoc(doc(as('amaka'), 'rules/pseudoephedrine_JP'), { ...entry, uid: 'amaka' }));
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'rules/pseudoephedrine_JP')));
  });
});
