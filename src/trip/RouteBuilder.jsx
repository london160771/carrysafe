import { countryName, ROUTE_COUNTRIES } from '../data/countries.js';
import { COVERED_COUNTRIES } from '../data/sourcesRegistry.js';

const ROLE_LABELS = { home: 'Home', layover: 'Layover', destination: 'Destination' };

function withRoles(countries) {
  return countries.map((country, index) => ({ country, role: index === 0 ? 'home' : index === countries.length - 1 ? 'destination' : 'layover' }));
}

export default function RouteBuilder({ route, onChange }) {
  const countries = route.map((stop) => stop.country);
  const update = (next) => onChange(withRoles(next));

  return (
    <section className="card mb-4" aria-labelledby="route-heading">
      <div className="card-body">
        <h2 className="h5" id="route-heading">Your route</h2>
        <ol className="list-unstyled mb-3">
          {route.map((stop, index) => (
            <li key={`${index}-${stop.role}`} className="d-flex flex-wrap align-items-end gap-2 mb-2">
              <div className="flex-grow-1">
                <label className="form-label mb-1" htmlFor={`stop-${index}`}>{ROLE_LABELS[stop.role]}</label>
                <select id={`stop-${index}`} className="form-select" value={stop.country} onChange={(event) => update(countries.map((code, position) => (position === index ? event.target.value : code)))}>
                  {ROUTE_COUNTRIES.map((code) => (
                    <option key={code} value={code}>
                      {countryName(code)}{COVERED_COUNTRIES.includes(code) || stop.role === 'home' ? '' : ' (not covered yet)'}
                    </option>
                  ))}
                </select>
              </div>
              {stop.role === 'layover' && (
                <button type="button" className="btn btn-outline-danger" onClick={() => update(countries.filter((_, position) => position !== index))}>
                  Remove layover
                </button>
              )}
            </li>
          ))}
        </ol>
        <button type="button" className="btn btn-outline-primary" onClick={() => update([...countries.slice(0, -1), 'AE', countries.at(-1)])}>
          Add a layover
        </button>
        <p className="small text-body-secondary mt-2 mb-0">Layovers are checked too. Covered: {COVERED_COUNTRIES.map(countryName).join(', ')}.</p>
      </div>
    </section>
  );
}
