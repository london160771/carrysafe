import { useEffect } from 'react';
import { SPEECH_RATE_RANGE, updateSettings } from './settingsStore.js';
import { useSettings } from './useSettings.js';

export default function SettingsBar() {
  const settings = useSettings();

  useEffect(() => {
    document.documentElement.classList.toggle('cs-big-text', settings.bigText);
    document.documentElement.classList.toggle('cs-high-contrast', settings.highContrast);
  }, [settings.bigText, settings.highContrast]);

  return (
    <div className="cs-settings" role="region" aria-label="Display and reading settings">
      <div className="container cs-settings-row">
        <div className="form-check form-switch mb-0">
          <input className="form-check-input" type="checkbox" role="switch" id="big-text" checked={settings.bigText} onChange={(event) => updateSettings({ bigText: event.target.checked })} />
          <label className="form-check-label" htmlFor="big-text">Big text</label>
        </div>
        <div className="form-check form-switch mb-0">
          <input className="form-check-input" type="checkbox" role="switch" id="high-contrast" checked={settings.highContrast} onChange={(event) => updateSettings({ highContrast: event.target.checked })} />
          <label className="form-check-label" htmlFor="high-contrast">High contrast</label>
        </div>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="speech-rate">Reading speed</label>
          <input
            id="speech-rate"
            type="range"
            className="form-range"
            style={{ width: 96 }}
            min={SPEECH_RATE_RANGE.min}
            max={SPEECH_RATE_RANGE.max}
            step={SPEECH_RATE_RANGE.step}
            value={settings.speechRate}
            onChange={(event) => updateSettings({ speechRate: Number(event.target.value) })}
          />
          <output htmlFor="speech-rate" className="cs-mono">{settings.speechRate.toFixed(1)}×</output>
        </div>
      </div>
    </div>
  );
}
