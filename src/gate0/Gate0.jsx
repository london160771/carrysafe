import { useState } from 'react';
import { extractLabel, framingCoach, hasOnDeviceModel } from '../ai/onDevice.js';
import { checkSources, checkSpeech, timed } from './checks.js';
import { cloudJsonPing } from './cloudPing.js';
import { loadSample, SAMPLES } from './samples.js';

async function runDeviceSteps() {
  const availability = await hasOnDeviceModel();
  const framing = await timed(async () => framingCoach(await loadSample(SAMPLES[0])));
  const extraction = [];
  for (const sample of SAMPLES) {
    extraction.push({ sample: sample.id, truth: sample.truth, ...(await timed(async () => extractLabel(await loadSample(sample)))) });
  }
  return { availability, step2_framingCoach_broncholyteFront: framing, step1_extraction: extraction };
}

const STEPS = [
  { id: 'device', label: 'Steps 1–2: on-device read + Framing Coach (desktop Chrome only)', run: runDeviceSteps },
  { id: 'sources', label: 'Step 3: fetch official pages for all 6 countries', run: () => checkSources() },
  { id: 'cloud', label: 'Step 5: cloud model JSON under App Check', run: () => timed(cloudJsonPing) },
  { id: 'speech', label: 'Step 6: Japanese voice + speech recognition', run: checkSpeech },
];

export default function Gate0() {
  const [results, setResults] = useState({});
  const [running, setRunning] = useState(null);

  async function runStep(step) {
    setRunning(step.id);
    const value = await step.run();
    setResults((previous) => ({ ...previous, [step.id]: { ranAt: new Date().toISOString(), userAgent: navigator.userAgent, value } }));
    setRunning(null);
  }

  const report = JSON.stringify(results, null, 2);

  return (
    <main className="container py-4">
      <h1 className="h3">Carry Safe · Gate 0 checks</h1>
      <p>Runs the PRD §16 checks with the real code. Click each button, then copy the results and send them back.</p>
      <div className="d-grid gap-2 mb-3">
        {STEPS.map((step) => (
          <button key={step.id} type="button" className="btn btn-primary text-start" disabled={running !== null} onClick={() => runStep(step)}>
            {running === step.id ? 'Running… ' : ''}
            {step.label}
          </button>
        ))}
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(report)}>
          Copy results
        </button>
      </div>
      <pre className="bg-light border p-3 small" aria-live="polite" style={{ whiteSpace: 'pre-wrap' }}>
        {report}
      </pre>
    </main>
  );
}
