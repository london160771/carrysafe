import { describe, expect, it } from 'vitest';
import { describeDeviceStatus } from './deviceStatus.js';

describe('describeDeviceStatus (FR-SCAN-004)', () => {
  it('allows scanning when the model is available', () => {
    expect(describeDeviceStatus('available')).toEqual({ usable: true, reason: '' });
  });

  it('warns about a download first', () => {
    expect(describeDeviceStatus('downloadable')).toMatchObject({ usable: true });
    expect(describeDeviceStatus('downloadable').reason).toMatch(/download/);
  });

  it('disables scanning with a reason otherwise', () => {
    for (const state of ['unsupported', 'unavailable', undefined]) {
      const status = describeDeviceStatus(state);
      expect(status.usable).toBe(false);
      expect(status.reason).toMatch(/type the medicine/);
    }
  });
});
