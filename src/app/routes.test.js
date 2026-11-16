import { describe, expect, it } from 'vitest';
import { joinPath, parseRoute, pathFor, pathFromOldHash } from './routes.js';

describe('parseRoute', () => {
  it('maps each path to its screen', () => {
    expect(parseRoute('/')).toEqual({ screen: 'trip', joinTripId: null });
    expect(parseRoute('/results')).toEqual({ screen: 'results', joinTripId: null });
    expect(parseRoute('/judge/')).toEqual({ screen: 'judge', joinTripId: null });
    expect(parseRoute('/privacy')).toEqual({ screen: 'privacy', joinTripId: null });
  });

  it('reads the trip id from an invite link', () => {
    expect(parseRoute(joinPath('abc123'))).toEqual({ screen: 'trip', joinTripId: 'abc123' });
  });

  it('falls back to the trip screen for unknown paths', () => {
    expect(parseRoute('/nowhere')).toEqual({ screen: 'trip', joinTripId: null });
    expect(parseRoute('/join')).toEqual({ screen: 'trip', joinTripId: null });
  });
});

describe('pathFromOldHash', () => {
  it('turns old hash links into real paths', () => {
    expect(pathFromOldHash('#/results')).toBe('/results');
    expect(pathFromOldHash('#/panel')).toBe(pathFor('privacy'));
    expect(pathFromOldHash('#/join/xyz')).toBe('/join/xyz');
  });

  it('leaves in-page anchors alone', () => {
    expect(pathFromOldHash('#main')).toBeNull();
    expect(pathFromOldHash('#route')).toBeNull();
    expect(pathFromOldHash('')).toBeNull();
  });
});
