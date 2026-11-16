export const SCREENS = Object.freeze([
  { id: 'trip', path: '/', label: 'Trip' },
  { id: 'add', path: '/add', label: 'Medicines' },
  { id: 'results', path: '/results', label: 'Results' },
  { id: 'privacy', path: '/privacy', label: 'What left your laptop' },
  { id: 'card', path: '/card', label: 'Border card' },
  { id: 'judge', path: '/judge', label: 'Demo' },
]);

const OLD_SCREEN_IDS = Object.freeze({ panel: 'privacy' });

export function pathFor(screenId) {
  return SCREENS.find((screen) => screen.id === screenId).path;
}

export function joinPath(tripId) {
  return `/join/${tripId}`;
}

export function parseRoute(pathname) {
  const [first = '', second] = pathname.split('/').filter(Boolean);
  if (first === 'join' && second) return { screen: 'trip', joinTripId: second };
  const match = SCREENS.find((screen) => screen.path === `/${first}`);
  return { screen: match?.id ?? 'trip', joinTripId: null };
}

export function pathFromOldHash(hash) {
  const [name, param] = hash.replace(/^#\/?/, '').split('/');
  if (name === 'join' && param) return joinPath(param);
  const match = SCREENS.find((screen) => screen.id === (OLD_SCREEN_IDS[name] ?? name));
  return match && hash.startsWith('#/') ? match.path : null;
}
