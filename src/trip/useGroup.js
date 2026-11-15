import { useCallback, useEffect, useMemo, useState } from 'react';
import { summariseStatus } from '../core/statusSummary.js';
import { createGroupTrip, joinGroupTrip, leaveGroupTrip, publishStatus, readGroupTrip, subscribeGroup } from '../firebase/groupTrip.js';
import { createGroupStore } from '../store/groupStore.js';
import { appKv } from '../store/kv.js';

export function useGroup() {
  const store = useMemo(() => createGroupStore(appKv), []);
  const [group, setGroup] = useState(null);
  const [view, setView] = useState({ members: {}, status: {} });
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    store.getGroup().then((saved) => active && setGroup(saved));
    return () => {
      active = false;
    };
  }, [store]);

  useEffect(() => {
    if (!group) return undefined;
    return subscribeGroup(group.tripId, setView, setError);
  }, [group]);

  const guard = useCallback(async (task) => {
    setError(null);
    try {
      return await task();
    } catch (caught) {
      setError(caught);
      return null;
    }
  }, []);

  const remember = useCallback(async (next) => {
    await store.setGroup(next);
    setGroup(next);
  }, [store]);

  return {
    group,
    view,
    error,
    create: (route, displayLabel) => guard(async () => remember({ tripId: await createGroupTrip(route, displayLabel), displayLabel })),
    join: (tripId, displayLabel) =>
      guard(async () => {
        await joinGroupTrip(tripId, displayLabel);
        const trip = await readGroupTrip(tripId);
        await remember({ tripId, displayLabel });
        return trip;
      }),
    share: (results) => guard(() => publishStatus(group.tripId, summariseStatus(results))),
    leave: () =>
      guard(async () => {
        await leaveGroupTrip(group.tripId);
        await store.clearGroup();
        setGroup(null);
        setView({ members: {}, status: {} });
      }),
  };
}
