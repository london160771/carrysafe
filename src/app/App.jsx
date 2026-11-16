import { useEffect } from 'react';
import BorderCardScreen from '../card/BorderCardScreen.jsx';
import JudgeScreen from '../judge/JudgeScreen.jsx';
import AddMedicine from '../meds/AddMedicine.jsx';
import { useMedStore } from '../meds/useMedStore.js';
import PanelScreen from '../panel/PanelScreen.jsx';
import ResultsScreen from '../results/ResultsScreen.jsx';
import SettingsBar from '../settings/SettingsBar.jsx';
import TripScreen from '../trip/TripScreen.jsx';
import { useTrip } from '../trip/useTrip.js';
import { usePathname } from './navigation.js';
import { parseRoute, SCREENS } from './routes.js';
import SiteFooter from './SiteFooter.jsx';
import SiteHeader from './SiteHeader.jsx';

const APP_NAME = 'Carry Safe';

function focusMain(event) {
  event.preventDefault();
  document.getElementById('main').focus();
}

export default function App() {
  const { screen, joinTripId } = parseRoute(usePathname());
  const medStore = useMedStore();
  const trip = useTrip();

  useEffect(() => {
    const label = SCREENS.find((item) => item.id === screen).label;
    document.title = screen === 'trip' ? APP_NAME : `${label} · ${APP_NAME}`;
  }, [screen]);

  return (
    <>
      <a className="visually-hidden-focusable" href="#main" onClick={focusMain}>
        Skip to content
      </a>
      <SettingsBar />
      <SiteHeader current={screen} />
      <main id="main" tabIndex={-1}>
        {screen === 'trip' && <TripScreen trip={trip} meds={medStore.meds} joinTripId={joinTripId} />}
        {screen === 'add' && <AddMedicine {...medStore} />}
        {screen === 'results' && <ResultsScreen route={trip.route} meds={medStore.meds} results={trip.results} progress={trip.progress} onRun={trip.runChecks} />}
        {screen === 'privacy' && <PanelScreen />}
        {screen === 'card' && <BorderCardScreen meds={medStore.meds} />}
        {screen === 'judge' && <JudgeScreen medStore={medStore} trip={trip} />}
      </main>
      <SiteFooter />
    </>
  );
}
