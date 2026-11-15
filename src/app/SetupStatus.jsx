import { describeSetup } from './setupStatus.js';

const SETUP = describeSetup(import.meta.env, 'LanguageModel' in globalThis);

export default function SetupStatus() {
  return (
    <section className="card mb-4" aria-labelledby="setup-heading">
      <div className="card-body">
        <h2 className="h5" id="setup-heading">Setup status</h2>
        <ul className="list-unstyled mb-0">
          {SETUP.map((item) => (
            <li key={item.label}>
              <span aria-hidden="true">{item.ok ? '✅' : '⚠'}</span> {item.ok ? 'Ready:' : 'Not ready:'} {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
