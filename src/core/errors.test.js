import { describe, expect, it } from 'vitest';
import { AppError, ERROR_CODES } from './errors.js';

describe('AppError', () => {
  it('carries code, retryable and nextAction for every PRD §11 code', () => {
    for (const code of Object.keys(ERROR_CODES)) {
      const error = new AppError(code);
      expect(error.code).toBe(code);
      expect(typeof error.retryable).toBe('boolean');
      expect(error.nextAction.length).toBeGreaterThan(0);
    }
  });

  it('serialises to a structured object', () => {
    expect(new AppError('source_unavailable', 'timeout').toJSON()).toEqual({
      code: 'source_unavailable',
      retryable: true,
      nextAction: ERROR_CODES.source_unavailable.nextAction,
      detail: 'timeout',
    });
  });

  it('rejects unknown codes', () => {
    expect(() => new AppError('made_up')).toThrow(TypeError);
  });
});
