import { Download } from 'lucide-react';
import { useInstallPrompt } from './useInstallPrompt.js';

export default function InstallButton() {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;
  return (
    <button type="button" className="btn btn-sm btn-secondary-soft ms-auto" onClick={install}>
      <Download size={14} strokeWidth={1.5} aria-hidden="true" />
      Install app
    </button>
  );
}
