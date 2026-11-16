import { Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import { cardLink, encodeCard } from './cardTransfer.js';
import QrCode from './QrCode.jsx';

export default function SendToPhone({ payload }) {
  const [link, setLink] = useState(null);
  const [error, setError] = useState(null);
  const payloadKey = JSON.stringify(payload);

  useEffect(() => {
    let active = true;
    encodeCard(JSON.parse(payloadKey))
      .then((encoded) => active && setLink(cardLink(window.location.origin, encoded)))
      .catch((caught) => active && setError(caught));
    return () => {
      active = false;
    };
  }, [payloadKey]);

  return (
    <section className="cs-panel" aria-labelledby="send-heading">
      <h2 className="cs-panel-title d-flex align-items-center gap-2" id="send-heading">
        <Smartphone size={20} strokeWidth={1.5} aria-hidden="true" />
        Put it on your phone
      </h2>
      <p className="cs-panel-lead">Point your phone’s camera at this code. The card is inside the link itself, so nothing is uploaded.</p>
      {link && <QrCode text={link} label="QR code that opens your border card on a phone" />}
      <ErrorNotice error={error} />
      <p className="cs-small cs-muted mt-3 mb-0">Your name is in the code too. Only show it to your own phone.</p>
    </section>
  );
}
