import RanOnBadge from '../app/RanOnBadge.jsx';

export default function CardDocument({ travellerName, english, card, children }) {
  return (
    <div className="cs-doc">
      <div className="cs-doc-part">
        <h2>{english.heading}</h2>
        {travellerName && <p className="mb-1 fw-medium">{travellerName}</p>}
        <ul>
          {english.items.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mb-0">{english.purpose}</p>
      </div>
      {card && (
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
      )}
      {children}
    </div>
  );
}
