import { ScanLine, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { extractLabel, framingCoach, hasOnDeviceModel } from '../ai/onDevice.js';
import ErrorNotice from '../app/ErrorNotice.jsx';
import RanOnBadge from '../app/RanOnBadge.jsx';
import { createDraft } from '../meds/medicine.js';
import { describeDeviceStatus } from './deviceStatus.js';
import { loadSample, SAMPLES } from './samples.js';
import { speakText } from './speak.js';

export default function ScanPanel({ onDraft }) {
  const [availability, setAvailability] = useState('checking');
  const [photo, setPhoto] = useState(null);
  const [framing, setFraming] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    hasOnDeviceModel().then((value) => active && setAvailability(value));
    return () => {
      active = false;
    };
  }, []);

  const status = availability === 'checking' ? { usable: false, reason: 'Checking this browser…' } : describeDeviceStatus(availability);

  function choosePhoto(blob, label, isSample) {
    if (photo) URL.revokeObjectURL(photo.previewUrl);
    setPhoto({ blob, label, isSample, previewUrl: URL.createObjectURL(blob) });
    setFraming(null);
    setError(null);
  }

  async function run(step, task) {
    setBusy(step);
    setError(null);
    try {
      await task();
    } catch (caught) {
      setError(caught);
    } finally {
      setBusy('');
    }
  }

  const checkFraming = () =>
    run('framing', async () => {
      const result = await framingCoach(photo.blob);
      setFraming(result);
      speakText(result.hint);
    });

  const readLabel = () =>
    run('reading', async () => {
      const result = await extractLabel(photo.blob);
      onDraft(createDraft({ source: 'device', ...result }), photo.isSample);
    });

  return (
    <section aria-labelledby="scan-heading">
      <h2 className="cs-panel-title" id="scan-heading">Scan the box</h2>
      <p className="cs-panel-lead">Your laptop reads the label. The photo stays here.</p>
      {!status.usable && (
        <p className="cs-notice is-info mt-0 mb-3" role="status">
          <TriangleAlert size={16} strokeWidth={1.5} aria-hidden="true" />
          <span>Scanning is not available here. {status.reason}</span>
        </p>
      )}
      {status.usable && status.reason && <p className="cs-small cs-muted">{status.reason}</p>}
      <fieldset disabled={!status.usable || busy !== ''} className="mb-0">
        <label className="form-label" htmlFor="photo-input">Photo of the label</label>
        <input
          id="photo-input"
          className="form-control mb-3"
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          onChange={(event) => event.target.files[0] && choosePhoto(event.target.files[0], 'Your photo', false)}
        />
        <label className="form-label" htmlFor="sample-select">Or try a sample photo</label>
        <select
          id="sample-select"
          className="form-select mb-3"
          defaultValue=""
          onChange={async (event) => {
            const sample = SAMPLES.find((item) => item.id === event.target.value);
            if (sample) choosePhoto(await loadSample(sample), `Sample photo: ${sample.id}`, true);
          }}
        >
          <option value="">Choose a sample</option>
          {SAMPLES.map((sample) => (
            <option key={sample.id} value={sample.id}>{sample.id}</option>
          ))}
        </select>
        {photo && (
          <figure className="mb-3">
            <img src={photo.previewUrl} alt="The medicine label to read" className="img-fluid rounded-3 border" style={{ maxHeight: 220 }} />
            <figcaption className="cs-small cs-muted mt-2">{photo.label} · stays on this device</figcaption>
          </figure>
        )}
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary-soft" disabled={!photo} onClick={checkFraming}>
            {busy === 'framing' ? 'Checking the photo…' : '1. Check the photo'}
          </button>
          <button type="button" className="btn btn-primary" disabled={!photo} onClick={readLabel}>
            <ScanLine size={16} strokeWidth={1.5} aria-hidden="true" />
            {busy === 'reading' ? 'Reading on this device…' : '2. Read the label'}
          </button>
        </div>
      </fieldset>
      <div aria-live="polite" className="mt-3">
        {framing && (
          <p>
            <strong>{framing.readable ? 'Good photo' : 'Not clear yet'}:</strong> {framing.hint}{' '}
            <RanOnBadge inferenceSource={framing.inferenceSource} />
          </p>
        )}
      </div>
      <ErrorNotice error={error} />
    </section>
  );
}
