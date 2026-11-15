import { describe, expect, it } from 'vitest';
import { buildCloudRequest, isGuardedRequest } from './buildCloudRequest.js';
import { REQUEST_SHAPES } from './requestShapes.js';

const VALID = {
  verdict: { task: 'verdict', ingredient: 'pseudoephedrine', country: 'JP', paragraphs: ['Official text.'] },
  brand: { task: 'brand', brand: 'Broncholyte' },
  translate: { task: 'translate', genericNames: ['pseudoephedrine'], quantities: ['24 tablets'], language: 'ja' },
};

const FORBIDDEN_KEYS = ['travellerName', 'name', 'condition', 'doctor', 'photo', 'image', 'uid', 'email', 'tripId', 'owner', 'dob', 'address'];

function seededRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

function randomKey(random) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
  const length = 1 + Math.floor(random() * 12);
  return Array.from({ length }, () => alphabet[Math.floor(random() * alphabet.length)]).join('');
}

describe('buildCloudRequest (INV-1, FR-PRIV-001)', () => {
  it.each(Object.keys(VALID))('accepts the %s shape and marks it guarded', (task) => {
    const request = buildCloudRequest(VALID[task]);
    expect(request).toEqual(VALID[task]);
    expect(isGuardedRequest(request)).toBe(true);
    expect(Object.isFrozen(request)).toBe(true);
  });

  it('does not mark lookalike objects as guarded', () => {
    expect(isGuardedRequest({ ...VALID.brand })).toBe(false);
  });

  it('copies the input so later mutation cannot leak', () => {
    const input = { ...VALID.verdict, paragraphs: ['a'] };
    const request = buildCloudRequest(input);
    input.paragraphs.push('Amaka');
    expect(request.paragraphs).toEqual(['a']);
  });

  it.each(FORBIDDEN_KEYS)('rejects a %s field with field_not_allowed', (key) => {
    for (const valid of Object.values(VALID)) {
      expect(() => buildCloudRequest({ ...valid, [key]: 'Amaka' })).toThrow(expect.objectContaining({ code: 'field_not_allowed' }));
    }
  });

  it('rejects any random extra field (property test, 500 cases)', () => {
    const random = seededRandom(20261115);
    const tasks = Object.keys(VALID);
    for (let index = 0; index < 500; index += 1) {
      const task = tasks[Math.floor(random() * tasks.length)];
      let key = randomKey(random);
      while (Object.hasOwn(REQUEST_SHAPES[task], key) || key === 'task') key = `${key}_x`;
      expect(() => buildCloudRequest({ ...VALID[task], [key]: random() })).toThrow(expect.objectContaining({ code: 'field_not_allowed' }));
    }
  });

  it('rejects unknown tasks, missing fields and wrong types', () => {
    for (const input of [
      { task: 'chat', text: 'hi' },
      { task: 'verdict', ingredient: 'x', country: 'JP' },
      { task: 'verdict', ingredient: 'x', country: 'Japan', paragraphs: ['p'] },
      { task: 'brand', brand: '' },
      { task: 'translate', genericNames: ['x'], quantities: ['1'], language: 'fr' },
      { task: 'toString' },
      null,
      ['brand'],
    ]) {
      expect(() => buildCloudRequest(input)).toThrow(expect.objectContaining({ code: 'field_not_allowed' }));
    }
  });

  it('rejects nested objects inside allowed fields', () => {
    expect(() => buildCloudRequest({ ...VALID.verdict, paragraphs: [{ text: 'p', owner: 'Mum' }] })).toThrow(
      expect.objectContaining({ code: 'field_not_allowed' }),
    );
  });
});

describe('buildCloudRequest (INV-2, image_not_allowed)', () => {
  const images = {
    'a data URL': 'data:image/jpeg;base64,/9j/4AAQ',
    'raw JPEG base64': '/9j/4AAQSkZJRgABAQ',
    'raw PNG base64': 'iVBORw0KGgoAAAANSUhEUg',
    'an inlineData part': { inlineData: { mimeType: 'image/jpeg', data: 'abc' } },
    'a Uint8Array': new Uint8Array([255, 216, 255]),
    'an ArrayBuffer': new ArrayBuffer(4),
    'a Blob': new Blob(['x'], { type: 'image/png' }),
  };

  it.each(Object.entries(images))('rejects %s anywhere in the request', (_label, image) => {
    expect(() => buildCloudRequest({ task: 'brand', brand: image })).toThrow(expect.objectContaining({ code: 'image_not_allowed' }));
    expect(() => buildCloudRequest({ ...VALID.verdict, paragraphs: ['ok', image] })).toThrow(expect.objectContaining({ code: 'image_not_allowed' }));
    expect(() => buildCloudRequest({ ...VALID.brand, photo: image })).toThrow(expect.objectContaining({ code: 'image_not_allowed' }));
  });
});
