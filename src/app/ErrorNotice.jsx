import { TriangleAlert } from 'lucide-react';

export default function ErrorNotice({ error }) {
  if (!error) return null;
  return (
    <div className="cs-notice" role="alert">
      <TriangleAlert size={16} strokeWidth={1.5} aria-hidden="true" />
      <div>
        {error.nextAction ?? error.message} <span className="cs-mono cs-muted">({error.code ?? 'error'})</span>
      </div>
    </div>
  );
}
