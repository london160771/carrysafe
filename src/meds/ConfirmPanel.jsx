import { useState } from 'react';
import RanOnBadge from '../app/RanOnBadge.jsx';
import { confirmMedicine } from './medicine.js';

const SOURCE_NOTES = {
  device: 'Read on this device. Check it against your box.',
  typed: 'Typed by you.',
  voice: 'Heard from your voice. Check the spelling.',
  suggestion: 'Suggestion: check your box. The cloud guessed these from the brand name.',
};

export default function ConfirmPanel({ draft, isSample, onConfirm, onCancel }) {
  const [ingredients, setIngredients] = useState(draft.ingredients.join(', '));
  const [strength, setStrength] = useState(draft.strength ?? '');
  const [quantity, setQuantity] = useState(draft.quantity ?? '');
  const [problem, setProblem] = useState('');

  function confirm(event) {
    event.preventDefault();
    try {
      onConfirm(
        confirmMedicine(draft, {
          id: crypto.randomUUID(),
          ingredients: ingredients.split(','),
          strength: strength.trim() || null,
          quantity: quantity.trim() || null,
        }),
      );
    } catch (caught) {
      setProblem(caught.message);
    }
  }

  return (
    <form className="card border-primary" onSubmit={confirm} aria-labelledby="confirm-heading">
      <div className="card-body">
        <h3 className="h5" id="confirm-heading">Confirm the ingredients</h3>
        <p className="mb-2">
          {SOURCE_NOTES[draft.source]} <RanOnBadge inferenceSource={draft.inferenceSource} />
        </p>
        {isSample && <p className="badge text-bg-warning">Sample photo</p>}
        {draft.brand && <p className="mb-2">Brand on the box: {draft.brand}</p>}
        <label className="form-label" htmlFor="confirm-ingredients">Active ingredients (separate with commas)</label>
        <input id="confirm-ingredients" className="form-control mb-2" value={ingredients} onChange={(event) => setIngredients(event.target.value)} required />
        <div className="row g-2 mb-3">
          <div className="col-sm-6">
            <label className="form-label" htmlFor="confirm-strength">Strength</label>
            <input id="confirm-strength" className="form-control" value={strength} onChange={(event) => setStrength(event.target.value)} />
          </div>
          <div className="col-sm-6">
            <label className="form-label" htmlFor="confirm-quantity">Quantity</label>
            <input id="confirm-quantity" className="form-control" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </div>
        </div>
        <p className="small">Nothing about this medicine is checked in the cloud until you confirm.</p>
        {problem && <p className="text-danger" role="alert">{problem}</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">Confirm</button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
