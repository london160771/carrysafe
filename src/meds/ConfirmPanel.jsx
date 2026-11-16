import { useState } from 'react';
import RanOnBadge from '../app/RanOnBadge.jsx';
import { confirmMedicine } from './medicine.js';

const SOURCE_NOTES = {
  device: 'Read on this device. Compare it with your box.',
  typed: 'You typed this.',
  voice: 'We heard this. Check the spelling.',
  suggestion: 'A guess from the brand name. Compare it with your box.',
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
    <form className="cs-panel cs-panel-accent" onSubmit={confirm} aria-labelledby="confirm-heading">
      <div>
        <h2 className="cs-panel-title" id="confirm-heading">Is this right?</h2>
        <p className="cs-muted d-flex flex-wrap align-items-center gap-2">
          {SOURCE_NOTES[draft.source]} <RanOnBadge inferenceSource={draft.inferenceSource} />
        </p>
        {isSample && <p className="cs-tag is-demo">Sample photo</p>}
        {draft.brand && <p className="mb-2">Brand on the box: {draft.brand}</p>}
        <label className="form-label" htmlFor="confirm-ingredients">Ingredients (put a comma between each)</label>
        <input id="confirm-ingredients" className="form-control mb-3" value={ingredients} onChange={(event) => setIngredients(event.target.value)} required />
        <div className="row g-2 mb-3">
          <div className="col-sm-6">
            <label className="form-label" htmlFor="confirm-strength">Strength</label>
            <input id="confirm-strength" className="form-control" value={strength} onChange={(event) => setStrength(event.target.value)} />
          </div>
          <div className="col-sm-6">
            <label className="form-label" htmlFor="confirm-quantity">How many</label>
            <input id="confirm-quantity" className="form-control" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </div>
        </div>
        <p className="cs-small cs-muted">Nothing is checked until you save.</p>
        {problem && <p className="cs-text-bad" role="alert">{problem}</p>}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">Yes, save it</button>
          <button type="button" className="btn btn-secondary-soft" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </form>
  );
}
