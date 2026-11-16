import { CircleCheck, CircleX, ExternalLink } from 'lucide-react';
import RanOnBadge from '../app/RanOnBadge.jsx';
import { countryName } from '../data/countries.js';
import VerdictBadge from './VerdictBadge.jsx';
import { formatDate, REASON_TEXT, VERDICT_LABELS } from './verdictLabels.js';

function OriginNote({ result }) {
  if (result.origin === 'saved') return <span className="cs-tag is-demo">Saved copy from {formatDate(result.savedOn)}</span>;
  if (result.origin === 'cache') return <span className="cs-tag">Shared rule cache · page fetched {formatDate(result.fetchedAt)}</span>;
  return null;
}

function Quote({ result }) {
  return (
    <figure className={`cs-quote ${result.quoteVerified ? 'is-verified' : 'is-unverified'}`}>
      <blockquote>“{result.quote}”</blockquote>
      {result.quoteVerified ? (
        <figcaption className="cs-text-ok">
          <CircleCheck size={14} strokeWidth={1.5} aria-hidden="true" />
          Quote found on official page ✓
        </figcaption>
      ) : (
        <figcaption className="cs-text-bad">
          <CircleX size={14} strokeWidth={1.5} aria-hidden="true" />
          AI quote not found on the official page
        </figcaption>
      )}
    </figure>
  );
}

export default function VerdictCard({ result }) {
  const label = VERDICT_LABELS[result.verdict];
  return (
    <article className="cs-verdict-card" aria-label={`${result.ingredient} in ${countryName(result.country)}: ${label.word}`}>
      <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
        <h3 className="text-capitalize">{result.ingredient}</h3>
        <VerdictBadge verdict={result.verdict} />
      </div>
      {result.conditions && result.quoteVerified && <p className="mb-0">{result.conditions}</p>}
      {result.reason && REASON_TEXT[result.reason] && <p className="mb-0 cs-muted">{REASON_TEXT[result.reason]}</p>}
      {result.quote && <Quote result={result} />}
      <p className="mb-0 cs-small">
        <a href={result.sourceUrl} target="_blank" rel="noreferrer">
          {result.authority} <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" className="align-baseline" />
        </a>
        <span className="cs-muted"> · checked on {formatDate(result.checkedAt)}</span>
      </p>
      <div className="cs-meta">
        <RanOnBadge inferenceSource={result.inferenceSource} />
        <OriginNote result={result} />
      </div>
    </article>
  );
}
