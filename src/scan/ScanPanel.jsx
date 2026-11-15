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
      <h3 className="h5" id="scan-heading">Scan the box</h3>
      {!status.usable && (
        <p className="alert alert-secondary" role="status">
          <span aria-hidden="true">⚠</span> Scan unavailable: {status.reason}
        </p>
      )}
      {status.usable && status.reason && <p className="small">{status.reason}</p>}
      <fieldset disabled={!status.usable || busy !== ''}>
        <label className="form-label" htmlFor="photo-input">Take or choose a photo of the label</label>
        <input
          id="photo-input"
          className="form-control mb-2"
          type="file"
          accept="image/jpeg,image/png"
          capture="environment"
          onChange={(event) => event.target.files[0] && choosePhoto(event.target.files[0], 'Your photo', false)}
        />
        <label className="form-label" htmlFor="sample-select">Or use a sample photo</label>
        <select
          id="sample-select"
          className="form-select mb-3"
          defaultValue=""
          onChange={async (event) => {
            const sample = SAMPLES.find((item) => item.id === event.target.value);
            if (sample) choosePhoto(await loadSample(sample), `Sample photo: ${sample.id}`, true);
          }}
        >
          <option value="">Choose a sample…</option>
          {SAMPLES.map((sample) => (
            <option key={sample.id} value={sample.id}>{sample.id}</option>
          ))}
        </select>
        {photo && (
          <figure className="mb-3">
            <img src={photo.previewUrl} alt="The medicine label to read" className="img-fluid border rounded" style={{ maxHeight: 220 }} />
            <figcaption className="small text-body-secondary">{photo.label} · stays on this device</figcaption>
          </figure>
        )}
        <div className="d-flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline-primary" disabled={!photo} onClick={checkFraming}>
            {busy === 'framing' ? 'Checking framing…' : '1. Check framing'}
          </button>
          <button type="button" className="btn btn-primary" disabled={!photo} onClick={readLabel}>
            {busy === 'reading' ? 'Reading label on this device…' : '2. Read label'}
          </button>
        </div>
      </fieldset>
      <div aria-live="polite" className="mt-3">
        {framing && (
          <p>
            <span aria-hidden="true">{framing.readable ? '✅' : '⚠'}</span> {framing.readable ? 'Readable' : 'Not readable yet'}: {framing.hint}{' '}
            <RanOnBadge inferenceSource={framing.inferenceSource} />
          </p>
        )}
      </div>
      <ErrorNotice error={error} />
    </section>
  );
}
