import { ArrowRight } from 'lucide-react';
import Link from '../app/Link.jsx';
import TripPass from './TripPass.jsx';

function goToPlan(event) {
  event.preventDefault();
  const plan = document.getElementById('plan');
  plan.scrollIntoView({ behavior: 'smooth', block: 'start' });
  plan.querySelector('select')?.focus({ preventScroll: true });
}

export default function Hero({ route, results, meds }) {
  return (
    <section className="cs-hero" aria-labelledby="hero-heading">
      <img className="cs-hero-photo" src="/photos/terminal-window.webp" alt="" width="2400" height="1597" fetchPriority="high" />
      <div className="container cs-hero-inner">
        <div>
          <p className="cs-tagline">Your medicine. Your secret. Your trip, safe.</p>
          <h1 className="cs-display" id="hero-heading">Can I take my medicine on this trip?</h1>
          <p className="cs-lead">Add your stops and your medicines. We check each country’s official rules, word for word. Your medicine list stays on your device.</p>
          <div className="cs-actions">
            <a className="btn btn-primary btn-lg" href="#plan" onClick={goToPlan}>
              Plan my trip
              <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <Link className="btn btn-secondary-soft btn-lg" to="/judge">
              Try the demo trip
            </Link>
          </div>
        </div>
        <TripPass route={route} results={results} meds={meds} />
      </div>
    </section>
  );
}
