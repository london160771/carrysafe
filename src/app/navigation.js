import { useSyncExternalStore } from 'react';

const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener('popstate', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('popstate', listener);
  };
}

export function navigate(path) {
  if (path !== window.location.pathname) window.history.pushState(null, '', path);
  listeners.forEach((listener) => listener());
  window.scrollTo(0, 0);
  document.getElementById('main')?.focus({ preventScroll: true });
}

export function usePathname() {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/');
}
