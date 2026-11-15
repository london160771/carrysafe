import { useState } from 'react';
import ErrorNotice from '../app/ErrorNotice.jsx';
import { DEMO_MEDS, DEMO_ROUTE } from './seed.js';

const PATH = [
  { href: '#/results', text: 'Results: Japan, with “Quote found on official page ✓”' },
  { href: '#/panel', text: 'What left your laptop → Try to break it' },
  { href: '#/card', text: 'Border Card → Show the Officer → Read aloud in Japanese' },
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
      window.location.hash = '#/results';
    } catch (caught) {
      setError(caught);
      setState('idle');
    }
  }

  return (
    <section aria-labelledby="judge-heading">
      <p className="badge text-bg-warning fs-6">DEMO TRIP · sample data, real checks</p>
      <h2 className="h4" id="judge-heading">Judge Mode: Amaka-Tokyo</h2>
      <p>
        Amaka flies Lagos → Dubai → Tokyo with her mum. Amaka carries methylphenidate. Mum carries pseudoephedrine cold tablets and paracetamol. Carry Safe checks every stop, including the Dubai layover, against
        official government pages.
      </p>
      <p className="small">No sign-up. This replaces the medicines on this device with the demo trip. Only ingredient names and country codes leave the device.</p>
      <button type="button" className="btn btn-primary btn-lg mb-3" disabled={state === 'running'} onClick={runDemo}>
        {state === 'running' ? `Checking ${trip.progress ? `${trip.progress.done + 1} of ${trip.progress.total}` : ''}…` : 'Run the demo trip'}
      </button>
      <ErrorNotice error={error} />
      <h3 className="h5">The 60-second path</h3>
      <ol>
        <li>Run the demo trip (above).</li>
        {PATH.map((step) => (
          <li key={step.href}>
            <a href={step.href}>{step.text}</a>
          </li>
        ))}
      </ol>
    </section>
  );
}
