import { describe, expect, it } from 'vitest';
import { parseModelJson } from './parseJson.js';

describe('parseModelJson', () => {
  it('parses bare JSON', () => {
    expect(parseModelJson('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses fenced JSON with surrounding text', () => {
    expect(parseModelJson('Here:\n```json\n{"readable": true}\n```\nDone')).toEqual({ readable: true });
  });

  it('throws when there is no object', () => {
    expect(() => parseModelJson('no json')).toThrow(SyntaxError);
  });
});
