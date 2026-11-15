import { useCallback, useEffect, useMemo, useState } from 'react';
import { translateCard } from '../ai/translateCard.js';
import ErrorNotice from '../app/ErrorNotice.jsx';
import RanOnBadge from '../app/RanOnBadge.jsx';
import { appKv } from '../store/kv.js';
import { createMedStore } from '../store/medStore.js';
import { CARD_ENGLISH, cardItems } from './cardText.js';
import OfficerMode from './OfficerMode.jsx';

const CARD_KEY = 'borderCard.ja';

export default function BorderCardScreen({ meds }) {
  const medStore = useMemo(() => createMedStore(appKv), []);
  const items = useMemo(() => cardItems(meds), [meds]);
  const itemsKey = JSON.stringify(items);
  const [travellerName, setTravellerName] = useState('');
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [officer, setOfficer] = useState(false);
  const closeOfficer = useCallback(() => setOfficer(false), []);
  const card = saved?.itemsKey === itemsKey ? saved.card : null;
  const english = { heading: CARD_ENGLISH.heading, purpose: CARD_ENGLISH.purpose, items: items.map((item) => `${item.genericName}: ${item.quantity}`) };

  useEffect(() => {
    let active = true;
    Promise.all([medStore.getTravellerName(), appKv.get(CARD_KEY)]).then(([name, savedCard]) => {
      if (!active) return;
      setTravellerName(name);
      setSaved(savedCard ?? null);
    });
    return () => {
      active = false;
    };
  }, [medStore]);

  async function makeCard() {
    setBusy(true);
    setError(null);
    try {
      const next = { itemsKey, card: await translateCard(items, 'ja'), madeAt: new Date().toISOString() };
      await appKv.set(CARD_KEY, next);
      setSaved(next);
    } catch (caught) {
      setError(caught);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="card-heading">
      <h2 className="h4" id="card-heading">Border Card</h2>
      <p>Generic names and quantities only. Your name is added on this device and is never sent.</p>
      <label className="form-label" htmlFor="traveller-name">Your name on the card (stays on this device)</label>
      <input
        id="traveller-name"
        className="form-control mb-3"
        value={travellerName}
        onChange={(event) => {
          setTravellerName(event.target.value);
          medStore.setTravellerName(event.target.value);
        }}
      />
      {items.length === 0 && <p className="text-body-secondary">Add and confirm a medicine first.</p>}
      {items.length > 0 && (
        <div className="card mb-3">
          <div className="card-body">
            <h3 className="h5">{CARD_ENGLISH.heading}</h3>
            {travellerName && <p className="mb-1">{travellerName}</p>}
            <ul>
              {english.items.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mb-3">{CARD_ENGLISH.purpose}</p>
            {card ? (
              <div lang="ja" className="border-top pt-3">
                <h3 className="h5">{card.heading}</h3>
                <ul>
                  {card.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p>{card.purpose}</p>
                <p className="small mb-0" lang="en">
                  Machine translation{card.inferenceSource && ' · '}
                  <RanOnBadge inferenceSource={card.inferenceSource} />
                </p>
              </div>
            ) : (
              <button type="button" className="btn btn-outline-primary" disabled={busy} onClick={makeCard}>
                {busy ? 'Translating…' : 'Make the Japanese card'}
              </button>
            )}
          </div>
        </div>
      )}
      {card && (
        <button type="button" className="btn btn-dark btn-lg" onClick={() => setOfficer(true)}>
          Show the Officer
        </button>
      )}
      <ErrorNotice error={error} />
      {officer && card && <OfficerMode card={card} travellerName={travellerName} english={english} onClose={closeOfficer} />}
    </section>
  );
}
