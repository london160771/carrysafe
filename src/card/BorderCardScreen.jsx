import { useCallback, useEffect, useMemo, useState } from 'react';
import { translateCard } from '../ai/translateCard.js';
import { Languages, Maximize2 } from 'lucide-react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import Link from '../app/Link.jsx';
import PageHeader from '../app/PageHeader.jsx';
import RanOnBadge from '../app/RanOnBadge.jsx';
import { appKv } from '../store/kv.js';
import { createMedStore } from '../store/medStore.js';
import { CARD_ENGLISH, cardItems } from './cardText.js';
import OfficerMode from './OfficerMode.jsx';

const CARD_KEY = 'borderCard.ja';
const PHOTO = { src: '/photos/passport-and-tickets.webp', alt: 'A passport and two boarding passes on a laptop' };

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
    <div className="container cs-page">
      <PageHeader id="card-heading" title="Border card" lead="A card for the officer in English and Japanese. It shows only each medicine and how much you carry." photo={PHOTO} />
      <div className="cs-grid-2">
        <section aria-label="Your card">
          <label className="form-label" htmlFor="traveller-name">
            Your name (stays on this device)
          </label>
          <input
            id="traveller-name"
            className="form-control mb-4"
            value={travellerName}
            onChange={(event) => {
              setTravellerName(event.target.value);
              medStore.setTravellerName(event.target.value);
            }}
          />
          {items.length === 0 && (
            <p className="cs-muted mb-0">
              First, <Link to="/add">add a medicine</Link>.
            </p>
          )}
          {items.length > 0 && (
            <div className="cs-doc">
              <div className="cs-doc-part">
                <h2>{CARD_ENGLISH.heading}</h2>
                {travellerName && <p className="mb-1">{travellerName}</p>}
                <ul>
                  {english.items.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="mb-0">{CARD_ENGLISH.purpose}</p>
              </div>
              {card ? (
                <div lang="ja" className="cs-doc-part">
                  <h2>{card.heading}</h2>
                  <ul>
                    {card.items.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p>{card.purpose}</p>
                  <p className="cs-small cs-muted d-flex flex-wrap align-items-center gap-2 mb-0" lang="en">
                    Machine translation
                    <RanOnBadge inferenceSource={card.inferenceSource} />
                  </p>
                </div>
              ) : (
                <div className="cs-doc-part">
                  <button type="button" className="btn btn-secondary-soft" disabled={busy} onClick={makeCard}>
                    <Languages size={16} strokeWidth={1.5} aria-hidden="true" />
                    {busy ? 'Translating…' : 'Make the Japanese card'}
                  </button>
                </div>
              )}
            </div>
          )}
          <ErrorNotice error={error} />
        </section>
        <section className="cs-panel" aria-labelledby="officer-help">
          <h2 className="cs-panel-title" id="officer-help">
            At the border
          </h2>
          <p className="cs-panel-lead">Open the card full screen and hand over your laptop. It can read the card aloud in Japanese.</p>
          <button type="button" className="btn btn-ink btn-lg" disabled={!card} onClick={() => setOfficer(true)}>
            <Maximize2 size={18} strokeWidth={1.5} aria-hidden="true" />
            Show the Officer
          </button>
          {!card && <p className="cs-small cs-muted mt-2 mb-0">Make the Japanese card first.</p>}
        </section>
      </div>
      {officer && card && <OfficerMode card={card} travellerName={travellerName} english={english} onClose={closeOfficer} />}
    </div>
  );
}
