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
      <h3 className="h5" id="type-heading">Type it</h3>
      <label className="form-label" htmlFor="medicine-text">Ingredient or brand name</label>
      <input id="medicine-text" className="form-control mb-2" value={text} onChange={(event) => setText(event.target.value)} autoComplete="off" />
      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" disabled={!value} onClick={() => onDraft(createDraft({ source: 'typed', ingredients: [value] }))}>
          Use as ingredient
        </button>
        <button type="button" className="btn btn-outline-primary" disabled={!value || busy} onClick={suggest}>
          {busy ? 'Asking the cloud…' : 'It’s a brand: suggest ingredients'}
        </button>
      </div>
      <p className="small text-body-secondary mt-2 mb-0">Brand suggestions send only the brand name to the cloud.</p>
      <ErrorNotice error={error} />
    </section>
  );
}
