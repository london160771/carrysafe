import Disclaimer from './Disclaimer.jsx';
import { describeSetup } from './setupStatus.js';

const FLOW = ['SCAN', 'HIDE', 'CHECK EVERY STOP', 'SHARE STATUS', 'SHOW THE OFFICER'];
const SETUP = describeSetup(import.meta.env, 'LanguageModel' in globalThis);

export default function App() {
  return (
    <>
      <header className="bg-white border-bottom">
        <div className="container py-3">
          <h1 className="h3 mb-1">Carry Safe</h1>
          <p className="mb-0">Your medicine. Your secret. Your trip, safe.</p>
        </div>
      </header>
      <main className="container py-4" id="main">
        <p className="cs-flow fw-semibold" aria-label={FLOW.join(', then ')}>
          {FLOW.join(' → ')}
        </p>
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
      </main>
      <footer className="container pb-4">
        <Disclaimer />
      </footer>
    </>
  );
}
