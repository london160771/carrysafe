import { useEffect, useRef } from 'react';
import { hasVoiceFor, speakText } from '../scan/speak.js';

export default function OfficerMode({ card, travellerName, english, onClose }) {
  const closeRef = useRef(null);
  const japaneseText = [card.heading, travellerName, ...card.items, card.purpose].filter(Boolean).join('。');

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      globalThis.speechSynthesis?.cancel();
    };
  }, [onClose]);

  return (
    <div className="cs-officer" role="dialog" aria-modal="true" aria-labelledby="officer-heading" lang="ja">
      <div className="d-flex flex-wrap gap-2 mb-4" lang="en">
        <button type="button" className="btn btn-warning btn-lg" onClick={() => speakText(japaneseText, { lang: 'ja-JP' })}>
          Read aloud in Japanese
        </button>
        <button type="button" className="btn btn-outline-light btn-lg" ref={closeRef} onClick={onClose}>
          Close
        </button>
      </div>
      {!hasVoiceFor('ja-JP') && (
        <p className="text-warning" lang="en">No Japanese voice found on this device. Show the screen instead.</p>
      )}
      <h2 id="officer-heading">{card.heading}</h2>
      <p className="cs-officer-en" lang="en">{english.heading}</p>
      {travellerName && <p className="fs-2">{travellerName}</p>}
      <ul className="list-unstyled">
        {card.items.map((item, index) => (
          <li key={item} className="mb-3">
            {item}
            <div className="cs-officer-en" lang="en">{english.items[index]}</div>
          </li>
        ))}
      </ul>
      <p className="fs-3">{card.purpose}</p>
      <p className="cs-officer-en" lang="en">{english.purpose}</p>
    </div>
  );
}
