export default function PageHeader({ id, title, lead, photo, children }) {
  return (
    <header className={`cs-page-head ${photo ? 'has-photo' : ''}`}>
      <div>
        <h1 className="cs-title" id={id}>{title}</h1>
        {lead && <p className="cs-lead">{lead}</p>}
        {children}
      </div>
      {photo && <img className="cs-page-photo" src={photo.src} alt={photo.alt} width="1200" height="800" />}
    </header>
  );
}
