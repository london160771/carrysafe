import { countryName } from '../data/countries.js';
import { VERDICT_LABELS } from '../results/verdictLabels.js';

export default function StatusGrid({ members, status }) {
  const memberIds = Object.keys(members);
  const countries = [...new Set(Object.values(status).flatMap((entry) => Object.keys(entry.perCountry ?? {})))];
  if (memberIds.length === 0) return null;
  return (
    <div className="table-responsive">
      <table className="table table-sm align-middle">
        <caption className="small">Group status only. Nobody sees anyone else’s medicine.</caption>
        <thead>
          <tr>
            <th scope="col">Traveller</th>
            {countries.map((country) => (
              <th scope="col" key={country}>{countryName(country)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memberIds.map((uid) => (
            <tr key={uid}>
              <th scope="row">{members[uid].displayLabel}</th>
              {countries.map((country) => {
                const verdict = status[uid]?.perCountry?.[country];
                const label = VERDICT_LABELS[verdict];
                return (
                  <td key={country}>
                    {label ? (
                      <>
                        <span aria-hidden="true">{label.icon}</span> {label.word}
                      </>
                    ) : (
                      <span className="text-body-secondary">Not shared yet</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
