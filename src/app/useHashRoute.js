import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

const readRoute = () => window.location.hash.replace(/^#\/?/, '') || 'trip';

export function useHashRoute() {
  return useSyncExternalStore(subscribe, readRoute, () => 'trip');
}
