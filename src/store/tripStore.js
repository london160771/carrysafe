const ROUTE_KEY = 'route';
const RESULTS_KEY = 'results';

export const DEFAULT_ROUTE = Object.freeze([
  { country: 'NG', role: 'home' },
  { country: 'JP', role: 'destination' },
]);

export function createTripStore(kv) {
  return {
    getRoute: async () => (await kv.get(ROUTE_KEY)) ?? [...DEFAULT_ROUTE],
    setRoute: (route) => kv.set(ROUTE_KEY, route),
    getResults: async () => (await kv.get(RESULTS_KEY)) ?? [],
    setResults: (results) => kv.set(RESULTS_KEY, results),
  };
}
