import { describe, expect, it } from 'vitest';
import { AppError } from '../core/errors.js';
import { outgoingEntries } from '../privacy/outgoingLog.js';
import { createLabAttempts } from './attempts.js';

const deps = {
  loadPhoto: async () => 'data:image/jpeg;base64,/9j/4AAQSkZJRg',
  fetchSources: async () => ({ pages: [{ text: 'cold and flu medication containing pseudoephedrine' }] }),
  fetchImpl: async () => Response.json({ error: { code: 'source_not_allowed' } }, { status: 400 }),
  readOtherTrip: async () => {
    throw new AppError('not_trip_member', 'permission-denied');
  },
};

describe('privacy and truth lab (PRD §18)', () => {
  it('blocks all 5 attempts with the expected codes', async () => {
    const attempts = createLabAttempts(deps);
    expect(attempts).toHaveLength(5);
    for (const attempt of attempts) expect(await attempt.run()).toBe(attempt.expected);
  });

  it('records each block in the outgoing log as blocked', async () => {
    const before = outgoingEntries().length;
    await createLabAttempts(deps)[0].run();
    expect(outgoingEntries().slice(before)).toEqual([expect.objectContaining({ channel: 'lab', status: 'blocked', detail: 'field_not_allowed: blocked, nothing sent' })]);
  });

  it('reports a failure when the guard lets something through', async () => {
    const leaky = createLabAttempts({ ...deps, readOtherTrip: async () => ({}) });
    expect(await leaky[4].run()).toBe('none');
  });
});
