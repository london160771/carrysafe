import { useState } from 'react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import StatusGrid from './StatusGrid.jsx';
import { useGroup } from './useGroup.js';

export default function GroupPanel({ route, results, joinTripId, onRouteFromGroup }) {
  const { group, view, error, create, join, share, leave } = useGroup();
  const [label, setLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const inviteUrl = group ? `${window.location.origin}/#/join/${group.tripId}` : '';

  async function joinFromInvite() {
    const trip = await join(joinTripId, label.trim());
    if (trip?.route) onRouteFromGroup(trip.route);
    window.location.hash = '#/trip';
  }

  return (
    <section className="card mb-4" aria-labelledby="group-heading">
      <div className="card-body">
        <h2 className="h5" id="group-heading">Group trip</h2>
        {!group && (
          <>
            <p>Share only a status per country (for example “Mum ⛔ Japan”). Medicine lists stay on each device.</p>
            <label className="form-label" htmlFor="group-label">Your label in the group</label>
            <input id="group-label" className="form-control mb-2" maxLength={30} placeholder="e.g. Mum" value={label} onChange={(event) => setLabel(event.target.value)} />
            {joinTripId ? (
              <button type="button" className="btn btn-primary" disabled={!label.trim()} onClick={joinFromInvite}>Join this group trip</button>
            ) : (
              <button type="button" className="btn btn-outline-primary" disabled={!label.trim()} onClick={() => create(route, label.trim())}>Create group trip</button>
            )}
          </>
        )}
        {group && (
          <>
            <p className="mb-2">You are “{group.displayLabel}”.</p>
            <label className="form-label" htmlFor="invite-link">Invite link</label>
            <div className="input-group mb-3">
              <input id="invite-link" className="form-control" readOnly value={inviteUrl} />
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(inviteUrl).then(() => setCopied(true))}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <StatusGrid members={view.members} status={view.status} />
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary" disabled={results.length === 0} onClick={() => share(results)}>Share my status</button>
              <button type="button" className="btn btn-outline-danger" onClick={leave}>Leave group</button>
            </div>
          </>
        )}
        <ErrorNotice error={error} />
      </div>
    </section>
  );
}
