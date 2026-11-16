import { Plane } from 'lucide-react';
import Link from '../app/Link.jsx';
import { summariseStatus } from '../core/statusSummary.js';
import RouteLine from './RouteLine.jsx';

export default function TripPass({ route, results, meds }) {
  const confirmed = meds.filter((med) => med.confirmed).length;
  const hasResults = results.length > 0;

  return (
    <aside className="cs-pass" aria-label="Your trip at a glance">
      <div className="cs-pass-head">
        <span className="d-inline-flex align-items-center gap-2">
          <Plane size={16} strokeWidth={1.5} aria-hidden="true" />
          Your trip
        </span>
        <span className="cs-mono">{route.length} stops</span>
      </div>
      <RouteLine route={route} statusByCountry={summariseStatus(results)} />
      <div className="cs-pass-foot">
        <span>
          {confirmed === 0 ? 'No medicines yet' : `${confirmed} ${confirmed === 1 ? 'medicine' : 'medicines'}`}
        </span>
        <Link to={confirmed === 0 ? '/add' : '/results'} className="fw-medium">
          {confirmed === 0 ? 'Add a medicine' : hasResults ? 'See results' : 'Check every stop'}
        </Link>
      </div>
    </aside>
  );
}
