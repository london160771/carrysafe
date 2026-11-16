import { Keyboard, Mic, ScanLine } from 'lucide-react';
import { useState } from 'react';
import PageHeader from '../app/PageHeader.jsx';
import ScanPanel from '../scan/ScanPanel.jsx';
import TypePanel from '../scan/TypePanel.jsx';
import VoicePanel from '../scan/VoicePanel.jsx';
import ConfirmPanel from './ConfirmPanel.jsx';
import MedList from './MedList.jsx';

const MODES = [
  { id: 'scan', label: 'Scan', Icon: ScanLine },
  { id: 'type', label: 'Type', Icon: Keyboard },
  { id: 'voice', label: 'Say it', Icon: Mic },
];

const PHOTO = { src: '/photos/travel-medicine-kit.webp', alt: 'An open travel pouch with a pill bottle and blister packs' };

export default function AddMedicine({ meds, saveMed, removeMed }) {
  const [mode, setMode] = useState(() => ('LanguageModel' in globalThis ? 'scan' : 'type'));
  const [pending, setPending] = useState(null);

  async function confirm(med) {
    await saveMed(med);
    setPending(null);
  }

  return (
    <div className="container cs-page">
      <PageHeader id="add-heading" title="Your medicines" lead="Scan the box, type the name, or say it. Your photo and your list stay on this device." photo={PHOTO} />
      <div className="cs-grid-2">
        <div>
          <div className="cs-segmented" role="group" aria-label="How to add a medicine">
            {MODES.map(({ id, label, Icon }) => (
              <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <div className="cs-panel">
            {mode === 'scan' && <ScanPanel onDraft={(draft, isSample) => setPending({ draft, isSample })} />}
            {mode === 'type' && <TypePanel onDraft={(draft) => setPending({ draft, isSample: false })} />}
            {mode === 'voice' && <VoicePanel onDraft={(draft) => setPending({ draft, isSample: false })} />}
          </div>
          {pending && (
            <div className="mt-4">
              <ConfirmPanel key={pending.draft.ingredients.join()} draft={pending.draft} isSample={pending.isSample} onConfirm={confirm} onCancel={() => setPending(null)} />
            </div>
          )}
        </div>
        <section className="cs-panel" aria-labelledby="list-heading">
          <h2 className="cs-panel-title" id="list-heading">Saved on this device</h2>
          <MedList meds={meds} onRemove={removeMed} />
        </section>
      </div>
    </div>
  );
}
