import { Trash2 } from 'lucide-react';
import Link from '../app/Link.jsx';

export default function MedList({ meds, onRemove }) {
  if (meds.length === 0) return <p className="cs-muted mb-0 mt-2">No medicines yet. Add one to start.</p>;
  return (
    <>
      <ul className="cs-list">
        {meds.map((med) => (
          <li key={med.id}>
            <div>
              <div className="fw-medium text-capitalize">{med.ingredients.join(' + ')}</div>
              <div className="cs-small cs-muted">{[med.traveller, med.brand, med.strength, med.quantity].filter(Boolean).join(' · ')}</div>
            </div>
            <button type="button" className="btn btn-sm btn-quiet-danger" onClick={() => onRemove(med.id)} aria-label={`Delete ${med.ingredients.join(' and ')}`}>
              <Trash2 size={16} strokeWidth={1.5} aria-hidden="true" />
              Delete
            </button>
          </li>
        ))}
      </ul>
      <Link to="/results" className="btn btn-primary mt-3">Check every stop</Link>
    </>
  );
}
