import { Plus, X } from 'lucide-react';
import { countryName, ROUTE_COUNTRIES } from '../data/countries.js';
import { COVERED_COUNTRIES } from '../data/sourcesRegistry.js';

const ROLE_LABELS = { home: 'Leaving from', layover: 'Stopping in', destination: 'Going to' };

function withRoles(countries) {
  return countries.map((country, index) => ({ country, role: index === 0 ? 'home' : index === countries.length - 1 ? 'destination' : 'layover' }));
}

export default function RouteBuilder({ route, onChange }) {
  const countries = route.map((stop) => stop.country);
  const update = (next) => onChange(withRoles(next));

  return (
    <section className="cs-panel" aria-labelledby="route-heading">
      <h2 className="cs-panel-title" id="route-heading">Where are you going?</h2>
      <p className="cs-panel-lead">Add every stop. Layovers count too.</p>
      <ol className="list-unstyled mb-3">
        {route.map((stop, index) => (
          <li key={`${index}-${stop.role}`} className="d-flex align-items-end gap-2 mb-3">
            <div className="flex-grow-1">
              <label className="form-label" htmlFor={`stop-${index}`}>{ROLE_LABELS[stop.role]}</label>
              <select id={`stop-${index}`} className="form-select" value={stop.country} onChange={(event) => update(countries.map((code, position) => (position === index ? event.target.value : code)))}>
                {ROUTE_COUNTRIES.map((code) => (
                  <option key={code} value={code}>
                    {countryName(code)}{COVERED_COUNTRIES.includes(code) || stop.role === 'home' ? '' : ' (not covered yet)'}
                  </option>
                ))}
              </select>
            </div>
            {stop.role === 'layover' && (
              <button type="button" className="btn btn-quiet-danger" style={{ minHeight: 44 }} onClick={() => update(countries.filter((_, position) => position !== index))}>
                <X size={16} strokeWidth={1.5} aria-hidden="true" />
                Remove
              </button>
            )}
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-secondary-soft" onClick={() => update([...countries.slice(0, -1), 'AE', countries.at(-1)])}>
        <Plus size={16} strokeWidth={1.5} aria-hidden="true" />
        Add a stop
      </button>
      <p className="cs-small cs-muted mt-3 mb-0">We can check {COVERED_COUNTRIES.map(countryName).join(', ')}.</p>
    </section>
  );
}
