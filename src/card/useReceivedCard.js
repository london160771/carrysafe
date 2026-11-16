import { useCallback, useEffect, useState } from 'react';
import { appKv } from '../store/kv.js';
import { decodeCard, readCardFragment } from './cardTransfer.js';

const RECEIVED_KEY = 'borderCard.received';

export function useReceivedCard() {
  const [received, setReceived] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const encoded = readCardFragment(window.location.hash);
    if (encoded) window.history.replaceState(null, '', window.location.pathname);
    const load = encoded
      ? decodeCard(encoded).then(async (card) => {
          await appKv.set(RECEIVED_KEY, card);
          return card;
        })
      : appKv.get(RECEIVED_KEY);
    load
      .then((card) => active && setReceived(card ?? null))
      .catch((caught) => active && setError(caught));
    return () => {
      active = false;
    };
  }, []);

  const remove = useCallback(async () => {
    await appKv.delete(RECEIVED_KEY);
    setReceived(null);
  }, []);

  return { received, error, remove };
}
