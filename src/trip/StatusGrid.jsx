import { countryName } from '../data/countries.js';
import VerdictBadge from '../results/VerdictBadge.jsx';

export default function StatusGrid({ members, status }) {
  const memberIds = Object.keys(members);
  const countries = [...new Set(Object.values(status).flatMap((entry) => Object.keys(entry.perCountry ?? {})))];
  if (memberIds.length === 0) return null;
  return (
    <div className="table-responsive">
      <table className="table cs-table align-middle">
        <caption className="cs-small cs-muted">Only the status is shared. Nobody sees anyone’s medicine.</caption>
        <thead>
          <tr>
            <th scope="col">Who</th>
            {countries.map((country) => (
              <th scope="col" key={country}>{countryName(country)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memberIds.map((uid) => (
            <tr key={uid}>
              <th scope="row" className="fw-medium">{members[uid].displayLabel}</th>
              {countries.map((country) => {
                const verdict = status[uid]?.perCountry?.[country];
                return <td key={country}>{verdict ? <VerdictBadge verdict={verdict} /> : <span className="cs-small cs-muted">Not shared yet</span>}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
