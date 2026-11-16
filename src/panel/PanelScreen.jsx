import PageHeader from '../app/PageHeader.jsx';
import OutgoingLog from './OutgoingLog.jsx';
import PrivacyLab from './PrivacyLab.jsx';

export default function PanelScreen() {
  return (
    <div className="container cs-page">
      <PageHeader
        id="panel-heading"
        title="What left your laptop"
        lead="Every message this app sent, exactly as it was sent. Your name, photos and medicine list are never here, because they never leave."
      />
      <div className="cs-grid-2">
        <section className="cs-panel" aria-labelledby="log-heading">
          <h2 className="cs-panel-title mb-3" id="log-heading">Sent this session</h2>
          <OutgoingLog />
        </section>
        <PrivacyLab />
      </div>
    </div>
  );
}
