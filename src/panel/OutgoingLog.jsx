import { displayPayload } from './displayPayload.js';
import { useOutgoingLog } from './useOutgoingLog.js';

const CHANNEL_LABELS = { 'cloud-ai': 'Cloud AI (Firebase AI Logic)', 'official-page': 'Official page fetch (/api/source)', firestore: 'Firestore', lab: 'Lab attempt' };

export default function OutgoingLog() {
  const entries = useOutgoingLog();
  if (entries.length === 0) return <p className="text-body-secondary">Nothing has left this device in this session.</p>;
  return (
    <ol className="list-unstyled" aria-live="polite">
      {[...entries].reverse().map((entry) => (
        <li key={entry.id} className={`border-start border-4 ps-2 mb-3 border-${entry.status === 'sent' ? 'primary' : 'danger'}`}>
          <div className="small">
            <span aria-hidden="true">{entry.status === 'sent' ? '↗' : '⛔'}</span> <strong>{entry.status === 'sent' ? 'Sent' : 'Blocked, nothing sent'}</strong> · {CHANNEL_LABELS[entry.channel] ?? entry.channel} · {new Date(entry.at).toLocaleTimeString('en-GB')}
          </div>
          {entry.detail && <div className="small text-body-secondary">{entry.detail}</div>}
          <pre className="small bg-light border rounded p-2 mb-0" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{displayPayload(entry.payload)}</pre>
        </li>
      ))}
    </ol>
  );
}
