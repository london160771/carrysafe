import Disclaimer from './Disclaimer.jsx';

const PHOTO_LICENCE_URL = 'https://www.pexels.com/license/';

export default function SiteFooter() {
  return (
    <footer className="cs-footer">
      <div className="container cs-footer-row">
        <Disclaimer />
        <p className="mb-0">
          Photos from <a href={PHOTO_LICENCE_URL} target="_blank" rel="noreferrer">Pexels</a>, used as illustrations
        </p>
      </div>
    </footer>
  );
}
