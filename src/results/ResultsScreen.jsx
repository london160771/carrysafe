import { useState } from 'react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import { countryName } from '../data/countries.js';
import { stopsToCheck } from '../core/route.js';
import VerdictCard from './VerdictCard.jsx';

export default function ResultsScreen({ route, meds, results, progress, onRun }) {
  const [error, setError] = useState(null);
  const confirmedMeds = meds.filter((med) => med.confirmed);
  const stops = stopsToCheck(route);

  async function run() {
    setError(null);
    try {
      await onRun(confirmedMeds);
    } catch (caught) {
      setError(caught);
    }
  }

  return (
    <section aria-labelledby="results-heading">
      <h2 className="h4" id="results-heading">Check every stop</h2>
      <p>
        Only each ingredient name and the country code leave this device. Stops: {stops.map((stop) => `${countryName(stop.country)} (${stop.role})`).join(' → ') || 'add a destination'}.
      </p>
      <button type="button" className="btn btn-primary mb-3" disabled={confirmedMeds.length === 0 || stops.length === 0 || progress !== null} onClick={run}>
        {progress ? `Checking ${progress.done + 1} of ${progress.total}…` : 'Check every stop'}
      </button>
      {confirmedMeds.length === 0 && <p className="text-body-secondary">Add and confirm a medicine first.</p>}
      <ErrorNotice error={error} />
      <div aria-live="polite">
        {stops.map((stop) => {
          const forStop = results.filter((result) => result.country === stop.country);
          if (forStop.length === 0) return null;
          return (
            <section key={stop.country} className="mb-4" aria-labelledby={`stop-${stop.country}`}>
              <h3 className="h5" id={`stop-${stop.country}`}>{countryName(stop.country)} · {stop.role}</h3>
              {forStop.map((result) => (
                <VerdictCard key={`${result.ingredient}-${result.country}`} result={result} />
              ))}
            </section>
          );
        })}
      </div>
    </section>
  );
}
