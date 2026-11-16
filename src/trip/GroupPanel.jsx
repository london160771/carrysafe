import { Check, Copy, LogOut, Users } from 'lucide-react';
import { useState } from 'react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import { navigate } from '../app/navigation.js';
import { joinPath } from '../app/routes.js';
import StatusGrid from './StatusGrid.jsx';
import { useGroup } from './useGroup.js';

const ICON = { size: 16, strokeWidth: 1.5, 'aria-hidden': true };

export default function GroupPanel({ route, results, joinTripId, onRouteFromGroup }) {
  const { group, view, error, create, join, share, leave } = useGroup();
  const [label, setLabel] = useState('');
  const [copied, setCopied] = useState(false);
  const inviteUrl = group ? `${window.location.origin}${joinPath(group.tripId)}` : '';

  async function joinFromInvite() {
    const trip = await join(joinTripId, label.trim());
    if (trip?.route) onRouteFromGroup(trip.route);
    navigate('/');
  }

  return (
    <section className="cs-panel" aria-labelledby="group-heading">
      <h2 className="cs-panel-title d-flex align-items-center gap-2" id="group-heading">
        <Users size={20} strokeWidth={1.5} aria-hidden="true" />
        Travelling with family?
      </h2>
      {!group && (
        <>
          <p className="cs-panel-lead">Share a simple status for each country. Nobody sees your medicine.</p>
          {joinTripId && <p className="cs-notice is-info mt-0 mb-3">You were invited to a group trip. Add your name to join.</p>}
          <label className="form-label" htmlFor="group-label">Your name in the group</label>
          <input id="group-label" className="form-control mb-3" maxLength={30} placeholder="For example, Mum" value={label} onChange={(event) => setLabel(event.target.value)} />
          {joinTripId ? (
            <button type="button" className="btn btn-primary" disabled={!label.trim()} onClick={joinFromInvite}>Join this group</button>
          ) : (
            <button type="button" className="btn btn-secondary-soft" disabled={!label.trim()} onClick={() => create(route, label.trim())}>Start a group</button>
          )}
        </>
      )}
      {group && (
        <>
          <p className="cs-panel-lead">You are “{group.displayLabel}”. Send this link to your family.</p>
          <label className="form-label" htmlFor="invite-link">Invite link</label>
          <div className="input-group mb-3">
            <input id="invite-link" className="form-control" readOnly value={inviteUrl} />
            <button type="button" className="btn btn-secondary-soft" onClick={() => navigator.clipboard.writeText(inviteUrl).then(() => setCopied(true))}>
              {copied ? <Check {...ICON} /> : <Copy {...ICON} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <StatusGrid members={view.members} status={view.status} />
          <div className="d-flex flex-wrap gap-2 mt-3">
            <button type="button" className="btn btn-primary" disabled={results.length === 0} onClick={() => share(results)}>Share my status</button>
            <button type="button" className="btn btn-quiet-danger" onClick={leave}>
              <LogOut {...ICON} />
              Leave group
            </button>
          </div>
          {results.length === 0 && <p className="cs-small cs-muted mt-2 mb-0">Check your trip first, then share.</p>}
        </>
      )}
      <ErrorNotice error={error} />
    </section>
  );
}
