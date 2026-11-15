import { useState } from 'react';
import { fetchSources } from '../check/sourceClient.js';
import { readTripStatusAsOutsider } from '../firebase/groupTrip.js';
import { createLabAttempts } from '../lab/attempts.js';
import { loadSample, SAMPLES } from '../scan/samples.js';

async function loadPhotoAsDataUrl() {
  const blob = await loadSample(SAMPLES[0]);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

const ATTEMPTS = createLabAttempts({ loadPhoto: loadPhotoAsDataUrl, fetchSources, fetchImpl: (url) => fetch(url), readOtherTrip: readTripStatusAsOutsider });

export default function PrivacyLab() {
  const [outcomes, setOutcomes] = useState({});
  const [running, setRunning] = useState(false);

  async function runAll() {
    setRunning(true);
    for (const attempt of ATTEMPTS) {
      const actual = await attempt.run().catch((error) => error.code ?? error.message);
      setOutcomes((previous) => ({ ...previous, [attempt.id]: actual }));
    }
    setRunning(false);
  }

  const blocked = ATTEMPTS.filter((attempt) => outcomes[attempt.id] === attempt.expected).length;

  return (
    <section className="card mb-4" aria-labelledby="lab-heading">
      <div className="card-body">
        <h3 className="h5" id="lab-heading">Try to break it</h3>
        <p>Each attempt goes through the real code. Every one should be blocked.</p>
        <button type="button" className="btn btn-danger mb-3" disabled={running} onClick={runAll}>
          {running ? 'Running attempts…' : 'Try to break it'}
        </button>
        <ol className="mb-2" aria-live="polite">
          {ATTEMPTS.map((attempt) => {
            const actual = outcomes[attempt.id];
            const passed = actual === attempt.expected;
            return (
              <li key={attempt.id} className="mb-1">
                {attempt.title}: expected <code>{attempt.expected}</code>
                {actual && (
                  <span className={passed ? 'text-success' : 'text-danger'}>
                    {' '}
                    <span aria-hidden="true">{passed ? '✅' : '❌'}</span> {passed ? 'Blocked' : 'Not blocked'} (<code>{actual}</code>)
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        {Object.keys(outcomes).length === ATTEMPTS.length && <p className="fw-semibold mb-0">{blocked}/{ATTEMPTS.length} blocked</p>}
      </div>
    </section>
  );
}
