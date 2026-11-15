import { useCallback, useEffect, useMemo, useState } from 'react';
import { cloudVerdict } from '../ai/verdict.js';
import { runRouteCheck } from '../check/runRouteCheck.js';
import { fetchSources } from '../check/sourceClient.js';
import { createRuleCache } from '../firebase/ruleCache.js';
import { appKv } from '../store/kv.js';
import { createTripStore, DEFAULT_ROUTE } from '../store/tripStore.js';

export function useTrip() {
  const store = useMemo(() => createTripStore(appKv), []);
  const [route, setRouteState] = useState([...DEFAULT_ROUTE]);
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([store.getRoute(), store.getResults()]).then(([savedRoute, savedResults]) => {
      if (!active) return;
      setRouteState(savedRoute);
      setResults(savedResults);
    });
    return () => {
      active = false;
    };
  }, [store]);

  const setRoute = useCallback((next) => {
    setRouteState(next);
    store.setRoute(next);
  }, [store]);

  const runChecks = useCallback(async (meds) => {
    const deps = { fetchSources, cloudVerdict, cache: createRuleCache() };
    const next = await runRouteCheck(route, meds, deps, setProgress);
    setResults(next);
    await store.setResults(next);
    setProgress(null);
  }, [route, store]);

  return { route, setRoute, results, progress, runChecks };
}
