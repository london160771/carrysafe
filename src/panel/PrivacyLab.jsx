import { ShieldCheck, ShieldX } from 'lucide-react';
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
    <section className="cs-panel" aria-labelledby="lab-heading">
      <div>
        <h2 className="cs-panel-title" id="lab-heading">Try to break it</h2>
        <p className="cs-panel-lead">Each test tries to leak something through the real code. All of them should be blocked.</p>
        <button type="button" className="btn btn-ink mb-3" disabled={running} onClick={runAll}>
          {running ? 'Running the tests…' : 'Try to break it'}
        </button>
        <ol className="cs-list mb-2" aria-live="polite">
          {ATTEMPTS.map((attempt) => {
            const actual = outcomes[attempt.id];
            const passed = actual === attempt.expected;
            return (
              <li key={attempt.id}>
                <div>
                  <div>{attempt.title}</div>
                  <div className="cs-mono cs-muted">expects {attempt.expected}{actual && actual !== attempt.expected ? ` · got ${actual}` : ''}</div>
                </div>
                {actual && (
                  <span className={`cs-verdict ${passed ? 'is-ok' : 'is-bad'}`}>
                    {passed ? <ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true" /> : <ShieldX size={16} strokeWidth={1.5} aria-hidden="true" />}
                    {passed ? 'Blocked' : 'Not blocked'}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        {Object.keys(outcomes).length === ATTEMPTS.length && <p className="fw-medium mb-0 mt-3">{blocked} of {ATTEMPTS.length} blocked</p>}
      </div>
    </section>
  );
}
