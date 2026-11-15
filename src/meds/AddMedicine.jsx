import { useState } from 'react';
import ScanPanel from '../scan/ScanPanel.jsx';
import TypePanel from '../scan/TypePanel.jsx';
import ConfirmPanel from './ConfirmPanel.jsx';
import MedList from './MedList.jsx';

const MODES = [
  { id: 'scan', label: 'Scan' },
  { id: 'type', label: 'Type' },
];

export default function AddMedicine({ meds, saveMed, removeMed }) {
  const [mode, setMode] = useState('scan');
  const [pending, setPending] = useState(null);

  async function confirm(med) {
    await saveMed(med);
    setPending(null);
  }

  return (
    <section aria-labelledby="add-heading">
      <h2 className="h4" id="add-heading">Add medicine</h2>
      <p>Your photo and medicine list stay on this device.</p>
      <div className="btn-group mb-3" role="group" aria-label="How to add">
        {MODES.map((item) => (
          <button key={item.id} type="button" className={`btn ${mode === item.id ? 'btn-dark' : 'btn-outline-dark'}`} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="card mb-3">
        <div className="card-body">
          {mode === 'scan' ? (
            <ScanPanel onDraft={(draft, isSample) => setPending({ draft, isSample })} />
          ) : (
            <TypePanel onDraft={(draft) => setPending({ draft, isSample: false })} />
          )}
        </div>
      </div>
      {pending && (
        <div className="mb-3">
          <ConfirmPanel key={pending.draft.ingredients.join()} draft={pending.draft} isSample={pending.isSample} onConfirm={confirm} onCancel={() => setPending(null)} />
        </div>
      )}
      <h3 className="h5">Your medicines</h3>
      <MedList meds={meds} onRemove={removeMed} />
    </section>
  );
}
