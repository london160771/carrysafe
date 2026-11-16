import { useState } from 'react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import Link from '../app/Link.jsx';
import PageHeader from '../app/PageHeader.jsx';
import { countryName } from '../data/countries.js';
import { stopsToCheck } from '../core/route.js';
import { summariseStatus } from '../core/statusSummary.js';
import RouteLine from '../trip/RouteLine.jsx';
import VerdictCard from './VerdictCard.jsx';

const ROLE_WORDS = { layover: 'Stopover', destination: 'Destination' };

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
    <div className="container cs-page">
      <PageHeader id="results-heading" title="Is it allowed at each stop?" lead="We send only the ingredient name and the country. Each answer quotes the government’s own page.">
        {confirmedMeds.some((med) => med.demo) && <p className="cs-tag is-demo mt-3">Demo trip · sample data, real checks</p>}
      </PageHeader>
      <section className="cs-panel mb-5" aria-label="Your route">
        <RouteLine route={route} statusByCountry={summariseStatus(results)} />
        <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
          <button type="button" className="btn btn-primary btn-lg" disabled={confirmedMeds.length === 0 || stops.length === 0 || progress !== null} onClick={run}>
            {progress ? `Checking ${progress.done + 1} of ${progress.total}…` : 'Check every stop'}
          </button>
          {confirmedMeds.length === 0 && (
            <span className="cs-muted">
              First, <Link to="/add">add a medicine</Link>.
            </span>
          )}
        </div>
        <ErrorNotice error={error} />
      </section>
      <div aria-live="polite">
        {stops.map((stop) => {
          const forStop = results.filter((result) => result.country === stop.country);
          if (forStop.length === 0) return null;
          return (
            <section key={stop.country} className="cs-results-stop" aria-labelledby={`stop-${stop.country}`}>
              <div className="cs-stop-head">
                <h2 id={`stop-${stop.country}`}>{countryName(stop.country)}</h2>
                <span className="cs-muted">{ROLE_WORDS[stop.role]}</span>
              </div>
              <div className="cs-cards">
                {forStop.map((result) => (
                  <VerdictCard key={`${result.ingredient}-${result.country}`} result={result} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
