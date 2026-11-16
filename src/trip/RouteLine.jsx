import { countryName } from '../data/countries.js';
import VerdictBadge from '../results/VerdictBadge.jsx';

const ROLE_WORDS = { home: 'Leaving from', layover: 'Stopping in', destination: 'Going to' };

export default function RouteLine({ route, statusByCountry }) {
  return (
    <ol className="cs-route" aria-label="Your route">
      {route.map((stop, index) => (
        <li key={`${index}-${stop.country}`}>
          <span className="cs-route-dot" aria-hidden="true" />
          <span className="cs-route-role">{ROLE_WORDS[stop.role]}</span>
          <span className="cs-route-place">{countryName(stop.country)}</span>
          {statusByCountry && stop.role !== 'home' && (
            <span className="cs-route-status d-block">
              {statusByCountry[stop.country] ? <VerdictBadge verdict={statusByCountry[stop.country]} /> : <span className="cs-small cs-muted">Not checked yet</span>}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
