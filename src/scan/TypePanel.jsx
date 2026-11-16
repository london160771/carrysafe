import { useState } from 'react';
import { brandSuggest } from '../ai/brandSuggest.js';
import ErrorNotice from '../app/ErrorNotice.jsx';
import { createDraft } from '../meds/medicine.js';

export default function TypePanel({ onDraft }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const value = text.trim();

  async function suggest() {
    setBusy(true);
    setError(null);
    try {
      const result = await brandSuggest(value);
      onDraft(createDraft({ source: 'suggestion', brand: value, ingredients: result.ingredients, inferenceSource: result.inferenceSource }));
    } catch (caught) {
      setError(caught);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="type-heading">
      <h2 className="cs-panel-title" id="type-heading">Type the name</h2>
      <p className="cs-panel-lead">The ingredient, or the brand on the box.</p>
      <label className="form-label" htmlFor="medicine-text">Medicine name</label>
      <input id="medicine-text" className="form-control mb-3" value={text} onChange={(event) => setText(event.target.value)} autoComplete="off" />
      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" disabled={!value} onClick={() => onDraft(createDraft({ source: 'typed', ingredients: [value] }))}>
          Add it
        </button>
        <button type="button" className="btn btn-secondary-soft" disabled={!value || busy} onClick={suggest}>
          {busy ? 'Looking it up…' : 'It’s a brand: find the ingredients'}
        </button>
      </div>
      <p className="cs-small cs-muted mt-3 mb-0">For a brand, only the brand name is sent.</p>
      <ErrorNotice error={error} />
    </section>
  );
}
