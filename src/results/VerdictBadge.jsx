import { CircleCheck, CircleHelp, OctagonX, TriangleAlert } from 'lucide-react';
import { VERDICT_LABELS } from './verdictLabels.js';

const ICONS = { ok: CircleCheck, warn: TriangleAlert, bad: OctagonX, quiet: CircleHelp };

export default function VerdictBadge({ verdict }) {
  const label = VERDICT_LABELS[verdict];
  if (!label) return null;
  const Icon = ICONS[label.tone];
  return (
    <span className={`cs-verdict is-${label.tone}`}>
      <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      {label.word}
    </span>
  );
}
