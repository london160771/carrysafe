export default function MedList({ meds, onRemove }) {
  if (meds.length === 0) return <p className="text-body-secondary">No medicines yet.</p>;
  return (
    <ul className="list-group">
      {meds.map((med) => (
        <li key={med.id} className="list-group-item d-flex justify-content-between align-items-start gap-2">
          <div>
            <div className="fw-semibold">{med.ingredients.join(' + ')}</div>
            <div className="small text-body-secondary">{[med.brand, med.strength, med.quantity].filter(Boolean).join(' · ')}</div>
          </div>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRemove(med.id)} aria-label={`Delete ${med.ingredients.join(' and ')}`}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
