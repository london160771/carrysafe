import RanOnBadge from '../app/RanOnBadge.jsx';
import { countryName } from '../data/countries.js';
import { formatDate, REASON_TEXT, VERDICT_LABELS } from './verdictLabels.js';

function OriginNote({ result }) {
  if (result.origin === 'saved') return <span className="badge text-bg-warning">Saved copy from {formatDate(result.savedOn)}</span>;
  if (result.origin === 'cache') return <span className="badge text-bg-light border">Shared rule cache · page fetched {formatDate(result.fetchedAt)}</span>;
  return null;
}

export default function VerdictCard({ result }) {
  const label = VERDICT_LABELS[result.verdict];
  return (
    <article className={`card border-${label.tone} mb-3`} aria-label={`${result.ingredient} in ${countryName(result.country)}: ${label.word}`}>
      <div className="card-body">
        <h4 className="h6 mb-2">
          <span aria-hidden="true">{label.icon}</span> <span className={`text-${label.tone === 'secondary' ? 'body' : label.tone}`}>{label.word}</span>
          <span className="text-body-secondary"> · {result.ingredient}</span>
        </h4>
        {result.conditions && <p className="mb-2">{result.conditions}</p>}
        {result.reason && REASON_TEXT[result.reason] && <p className="mb-2">{REASON_TEXT[result.reason]}</p>}
        {result.quote && (
          <figure className="mb-2">
            <blockquote className="blockquote fs-6 border-start border-3 ps-2 mb-1">“{result.quote}”</blockquote>
            {result.quoteVerified && <figcaption className="small text-success fw-semibold">Quote found on official page ✓</figcaption>}
          </figure>
        )}
        <p className="small mb-2">
          <a href={result.sourceUrl} target="_blank" rel="noreferrer">{result.authority}</a> · checked on {formatDate(result.checkedAt)}
        </p>
        <div className="d-flex flex-wrap gap-2">
          <RanOnBadge inferenceSource={result.inferenceSource} />
          <OriginNote result={result} />
        </div>
      </div>
    </article>
  );
}
