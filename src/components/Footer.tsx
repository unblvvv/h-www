import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer__inner">
        <div className="site-footer__brand">
          <Heart size={18} />
          <strong>Animal Shelter</strong>
        </div>
        <p className="site-footer__text">Helping animals find safe and loving homes in Dnipro.</p>
        <nav className="site-footer__links" aria-label="Footer links">
          <Link to="/">Home</Link>
          <Link to="/find-pet">Find a pet</Link>
          <Link to="/donate">Donate</Link>
        </nav>
      </div>
    </footer>
  );
}
