import SetupStatus from '../app/SetupStatus.jsx';
import GroupPanel from './GroupPanel.jsx';
import Hero from './Hero.jsx';
import HowItWorks from './HowItWorks.jsx';
import RouteBuilder from './RouteBuilder.jsx';

export default function TripScreen({ trip, meds, joinTripId }) {
  return (
    <>
      <Hero route={trip.route} results={trip.results} meds={meds} />
      <div className="container cs-page">
        <HowItWorks />
        <div className="cs-grid-2 mt-5" id="plan">
          <RouteBuilder route={trip.route} onChange={trip.setRoute} />
          <GroupPanel route={trip.route} results={trip.results} joinTripId={joinTripId} onRouteFromGroup={trip.setRoute} />
        </div>
        <div className="mt-5">
          <SetupStatus />
        </div>
      </div>
    </>
  );
}
