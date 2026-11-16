import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import BrandMark from './BrandMark.jsx';
import Link from './Link.jsx';
import { SCREENS } from './routes.js';

export default function SiteHeader({ current }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="cs-header">
      <div className="container cs-header-row position-relative">
        <Link to="/" className="cs-brand" onClick={() => setOpen(false)}>
          <BrandMark />
          Carry Safe
        </Link>
        <button type="button" className="btn btn-secondary-soft btn-sm cs-menu-button" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          {open ? <X size={16} strokeWidth={1.5} aria-hidden="true" /> : <Menu size={16} strokeWidth={1.5} aria-hidden="true" />}
          Menu
        </button>
        <nav aria-label="Pages">
          <ul id="site-nav" className={`cs-nav ${open ? 'is-open' : ''}`}>
            {SCREENS.map((item) => (
              <li key={item.id}>
                <Link to={item.path} aria-current={current === item.id ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
