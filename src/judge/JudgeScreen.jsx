import { Play } from 'lucide-react';
import { useState } from 'react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import Link from '../app/Link.jsx';
import { navigate } from '../app/navigation.js';
import PageHeader from '../app/PageHeader.jsx';
import RouteLine from '../trip/RouteLine.jsx';
import { DEMO_MEDS, DEMO_ROUTE } from './seed.js';

const PHOTO = { src: '/photos/mother-and-daughter-packing.webp', alt: 'A mother and daughter packing a suitcase together' };

const TOUR = [
  { to: '/results', text: 'Results: Japan, with “Quote found on official page ✓”' },
  { to: '/privacy', text: 'What left this device, then Try to break it' },
  { to: '/card', text: 'Border card, then Show the Officer, then Read aloud in Japanese. Or scan the code with your phone' },
];

export default function JudgeScreen({ medStore, trip }) {
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);

  async function runDemo() {
    setState('running');
    setError(null);
    try {
      for (const med of medStore.meds) await medStore.removeMed(med.id);
      for (const med of DEMO_MEDS) await medStore.saveMed(med);
      trip.setRoute([...DEMO_ROUTE]);
      await trip.runChecks(DEMO_MEDS, DEMO_ROUTE);
      setState('done');
      navigate('/results');
    } catch (caught) {
      setError(caught);
      setState('idle');
    }
  }

  return (
    <div className="container cs-page">
      <PageHeader
        id="judge-heading"
        title="Demo trip: Amaka goes to Tokyo"
        lead="Amaka flies from Lagos to Tokyo through Dubai with her mum. Amaka takes methylphenidate. Mum takes pseudoephedrine cold tablets and paracetamol."
        photo={PHOTO}
      >
        <p className="cs-tag is-demo mt-3">Demo trip · sample data, real checks</p>
      </PageHeader>
      <div className="cs-grid-2">
        <section className="cs-panel" aria-labelledby="run-heading">
          <h2 className="cs-panel-title" id="run-heading">Run it</h2>
          <p className="cs-panel-lead">No sign-up. This swaps the medicines on this device for the demo ones. Only ingredient names and countries are sent.</p>
          <RouteLine route={DEMO_ROUTE} />
          <button type="button" className="btn btn-primary btn-lg mt-4" disabled={state === 'running'} onClick={runDemo}>
            <Play size={18} strokeWidth={1.5} aria-hidden="true" />
            {state === 'running' ? `Checking ${trip.progress ? `${trip.progress.done + 1} of ${trip.progress.total}` : ''}…` : 'Run the demo trip'}
          </button>
          <ErrorNotice error={error} />
        </section>
        <section className="cs-panel" aria-labelledby="tour-heading">
          <h2 className="cs-panel-title" id="tour-heading">The 60-second tour</h2>
          <ol className="cs-tour">
            <li>Run the demo trip</li>
            {TOUR.map((step) => (
              <li key={step.to}>
                <Link to={step.to}>{step.text}</Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
