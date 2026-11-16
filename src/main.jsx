import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/instrument-sans/400.css';
import '@fontsource/instrument-sans/500.css';
import '@fontsource/instrument-sans/600.css';
import '@fontsource/instrument-serif/400.css';
import './app/theme.css';
import './app/hero.css';
import './app/route.css';
import './app/layout.css';
import './app/parts.css';
import './app/screens.css';
import './app/access.css';
import './app/print.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import { pathFromOldHash } from './app/routes.js';
import { registerServiceWorker } from './pwa/registerServiceWorker.js';

const oldHashPath = pathFromOldHash(window.location.hash);
if (oldHashPath) window.history.replaceState(null, '', oldHashPath);

registerServiceWorker();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
