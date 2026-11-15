import { useCallback, useEffect, useMemo, useState } from 'react';
import { createIdbKv } from '../store/idbKv.js';
import { createMedStore } from '../store/medStore.js';

export function useMedStore() {
  const store = useMemo(() => createMedStore(createIdbKv()), []);
  const [meds, setMeds] = useState([]);

  useEffect(() => {
    let active = true;
    store.listMeds().then((items) => active && setMeds(items));
    return () => {
      active = false;
    };
  }, [store]);

  const saveMed = useCallback(async (med) => {
    await store.saveMed(med);
    setMeds(await store.listMeds());
  }, [store]);

  const removeMed = useCallback(async (id) => {
    await store.removeMed(id);
    setMeds(await store.listMeds());
  }, [store]);

  return { meds, saveMed, removeMed };
}
