import { Languages, Maximize2, Printer, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { translateCard } from '../ai/translateCard.js';
import ErrorNotice from '../app/ErrorNotice.jsx';
import Link from '../app/Link.jsx';
import PageHeader from '../app/PageHeader.jsx';
import { formatDate } from '../results/verdictLabels.js';
import { appKv } from '../store/kv.js';
import { createMedStore } from '../store/medStore.js';
import CardDocument from './CardDocument.jsx';
import { CARD_ENGLISH, cardItems } from './cardText.js';
import OfficerMode from './OfficerMode.jsx';
import SendToPhone from './SendToPhone.jsx';
import { useReceivedCard } from './useReceivedCard.js';

const CARD_KEY = 'borderCard.ja';
const PHOTO = { src: '/photos/passport-and-tickets.webp', alt: 'A passport and two boarding passes on a laptop' };
const ICON = { size: 18, strokeWidth: 1.5, 'aria-hidden': true };

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
  const received = useReceivedCard();
  const ownCard = saved?.itemsKey === itemsKey ? saved.card : null;
  const ownEnglish = { heading: CARD_ENGLISH.heading, purpose: CARD_ENGLISH.purpose, items: items.map((item) => `${item.genericName}: ${item.quantity}`) };
  const showing = items.length > 0 ? { travellerName, english: ownEnglish, card: ownCard } : received.received;

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
      <PageHeader id="card-heading" title="Border card" lead="A card for the officer in English and Japanese. Make it here, then carry it on your phone or on paper." photo={PHOTO} />
      <div className="cs-grid-2">
        <section aria-label="Your card">
          {items.length > 0 && (
            <>
              <label className="form-label cs-no-print" htmlFor="traveller-name">Your name (stays on this device)</label>
              <input
                id="traveller-name"
                className="form-control mb-4 cs-no-print"
                value={travellerName}
                onChange={(event) => {
                  setTravellerName(event.target.value);
                  medStore.setTravellerName(event.target.value);
                }}
              />
            </>
          )}
          {items.length === 0 && received.received && <p className="cs-tag mb-3">Received from your laptop · made {formatDate(received.received.madeAt)}</p>}
          {!showing && (
            <p className="cs-muted mb-0">
              First, <Link to="/add">add a medicine</Link>. Or scan the code from your laptop with this phone.
            </p>
          )}
          {showing && (
            <CardDocument travellerName={showing.travellerName} english={showing.english} card={showing.card}>
              {items.length > 0 && !ownCard && (
                <div className="cs-doc-part cs-no-print">
                  <button type="button" className="btn btn-secondary-soft" disabled={busy} onClick={makeCard}>
                    <Languages {...ICON} />
                    {busy ? 'Translating…' : 'Make the Japanese card'}
                  </button>
                </div>
              )}
            </CardDocument>
          )}
          <ErrorNotice error={error ?? received.error} />
        </section>
        <div className="d-grid gap-4 cs-no-print">
          <section className="cs-panel" aria-labelledby="officer-help">
            <h2 className="cs-panel-title" id="officer-help">At the border</h2>
            <p className="cs-panel-lead">Open the card full screen and show it. It can read the card aloud in Japanese.</p>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-ink btn-lg" disabled={!showing?.card} onClick={() => setOfficer(true)}>
                <Maximize2 {...ICON} />
                Show the Officer
              </button>
              <button type="button" className="btn btn-secondary-soft btn-lg" disabled={!showing} onClick={() => window.print()}>
                <Printer {...ICON} />
                Print or save as PDF
              </button>
            </div>
            {showing && !showing.card && <p className="cs-small cs-muted mt-2 mb-0">Make the Japanese card first.</p>}
            {items.length === 0 && received.received && (
              <button type="button" className="btn btn-sm btn-quiet-danger mt-3" onClick={received.remove}>
                <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
                Remove the card from this phone
              </button>
            )}
          </section>
          {items.length > 0 && ownCard && <SendToPhone payload={{ travellerName, english: ownEnglish, card: ownCard, madeAt: saved.madeAt }} />}
        </div>
      </div>
      {officer && showing?.card && <OfficerMode card={showing.card} travellerName={showing.travellerName} english={showing.english} onClose={closeOfficer} />}
    </div>
  );
}
