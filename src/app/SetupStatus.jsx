import { CircleCheck, CircleDashed } from 'lucide-react';
import { describeSetup } from './setupStatus.js';

const SETUP = describeSetup(import.meta.env, 'LanguageModel' in globalThis);

export default function SetupStatus() {
  return (
    <section aria-labelledby="setup-heading" className="cs-small">
      <h2 className="h6 mb-2" id="setup-heading">System check</h2>
      <ul className="list-unstyled mb-0 d-flex flex-wrap gap-2">
        {SETUP.map((item) => {
          const Icon = item.ok ? CircleCheck : CircleDashed;
          return (
            <li key={item.label} className="cs-tag">
              <Icon size={14} strokeWidth={1.5} aria-hidden="true" />
              <span className="visually-hidden">{item.ok ? 'Ready:' : 'Not ready:'}</span> {item.label}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
