import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}

const readRoute = () => window.location.hash.replace(/^#\/?/, '') || (window.location.pathname.replace(/\/+$/, '') === '/judge' ? 'judge' : 'trip');

export function useHashRoute() {
  return useSyncExternalStore(subscribe, readRoute, () => 'trip');
}
