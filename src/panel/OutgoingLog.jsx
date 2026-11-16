import { displayPayload } from './displayPayload.js';
import { useOutgoingLog } from './useOutgoingLog.js';

const CHANNEL_LABELS = { 'cloud-ai': 'Cloud AI', 'official-page': 'Official page', firestore: 'Database', lab: 'Lab test' };

export default function OutgoingLog() {
  const entries = useOutgoingLog();
  if (entries.length === 0) return <p className="cs-muted mb-0">Nothing has been sent yet.</p>;
  return (
    <ol className="list-unstyled mb-0" aria-live="polite">
      {[...entries].reverse().map((entry) => (
        <li key={entry.id} className={`cs-log-entry ${entry.status === 'sent' ? '' : 'is-blocked'}`}>
          <div className="cs-small d-flex flex-wrap gap-2 align-items-baseline">
            <strong className={entry.status === 'sent' ? '' : 'cs-text-bad'}>{entry.status === 'sent' ? 'Sent' : 'Blocked, nothing sent'}</strong>
            <span className="cs-muted">{CHANNEL_LABELS[entry.channel] ?? entry.channel}</span>
            <span className="cs-mono cs-muted">{new Date(entry.at).toLocaleTimeString('en-GB')}</span>
          </div>
          {entry.detail && <div className="cs-small cs-muted">{entry.detail}</div>}
          <pre>{displayPayload(entry.payload)}</pre>
        </li>
      ))}
    </ol>
  );
}
