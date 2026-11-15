import AddMedicine from '../meds/AddMedicine.jsx';
import { useMedStore } from '../meds/useMedStore.js';
import ResultsScreen from '../results/ResultsScreen.jsx';
import RouteBuilder from '../trip/RouteBuilder.jsx';
import { useTrip } from '../trip/useTrip.js';
import Disclaimer from './Disclaimer.jsx';
import SetupStatus from './SetupStatus.jsx';
import { useHashRoute } from './useHashRoute.js';

const FLOW = ['SCAN', 'HIDE', 'CHECK EVERY STOP', 'SHARE STATUS', 'SHOW THE OFFICER'];
const SCREENS = [
  { id: 'trip', label: 'Trip' },
  { id: 'add', label: 'Add medicine' },
  { id: 'results', label: 'Results' },
];

export default function App() {
  const hashRoute = useHashRoute();
  const screen = SCREENS.some((item) => item.id === hashRoute) ? hashRoute : 'trip';
  const medStore = useMedStore();
  const trip = useTrip();

  return (
    <>
      <a
        className="visually-hidden-focusable"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main').focus();
        }}
      >
        Skip to content
      </a>
      <header className="bg-white border-bottom">
        <div className="container py-3">
          <h1 className="h3 mb-1">Carry Safe</h1>
          <p className="mb-2">Your medicine. Your secret. Your trip, safe.</p>
          <nav aria-label="Screens">
            <ul className="nav nav-pills">
              {SCREENS.map((item) => (
                <li className="nav-item" key={item.id}>
                  <a className={`nav-link ${screen === item.id ? 'active' : ''}`} aria-current={screen === item.id ? 'page' : undefined} href={`#/${item.id}`}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <main className="container py-4" id="main" tabIndex={-1}>
        {screen === 'trip' && (
          <>
            <p className="cs-flow fw-semibold" aria-label={FLOW.join(', then ')}>{FLOW.join(' → ')}</p>
            <RouteBuilder route={trip.route} onChange={trip.setRoute} />
            <SetupStatus />
          </>
        )}
        {screen === 'add' && <AddMedicine {...medStore} />}
        {screen === 'results' && <ResultsScreen route={trip.route} meds={medStore.meds} results={trip.results} progress={trip.progress} onRun={trip.runChecks} />}
      </main>
      <footer className="container pb-4">
        <Disclaimer />
      </footer>
    </>
  );
}
