import OutgoingLog from './OutgoingLog.jsx';
import PrivacyLab from './PrivacyLab.jsx';

export default function PanelScreen() {
  return (
    <section aria-labelledby="panel-heading">
      <h2 className="h4" id="panel-heading">What left your laptop</h2>
      <p>Every request this session, with its exact payload. Names, photos and your medicine list never appear here, because they never leave.</p>
      <PrivacyLab />
      <h3 className="h5">Outgoing requests</h3>
      <OutgoingLog />
    </section>
  );
}
