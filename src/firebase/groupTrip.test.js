import { describe, expect, it } from 'vitest';
import { AppError } from '../core/errors.js';
import { toTripError } from './groupTrip.js';

describe('toTripError', () => {
  it('maps Firestore permission-denied to not_trip_member', () => {
    expect(toTripError({ code: 'permission-denied' })).toMatchObject({ code: 'not_trip_member', retryable: false });
  });

  it('keeps structured errors and maps the rest to cloud_unavailable', () => {
    const configError = new AppError('config_missing');
    expect(toTripError(configError)).toBe(configError);
    expect(toTripError(new Error('offline'))).toMatchObject({ code: 'cloud_unavailable' });
  });
});
