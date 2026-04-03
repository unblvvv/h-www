import { Link } from 'react-router';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer__inner">
        <div className="site-footer__brand">
          <img src="/logo.png" alt="Dnipro Animals logo" className="site-footer__logo" />
          <div>
            <strong>Dnipro Animals</strong>
            <p>Helping pets find safe and loving homes.</p>
          </div>
        </div>

        <nav className="site-footer__links" aria-label="Footer links">
          <Link to="/">Home</Link>
          <Link to="/find-pet">Find a pet</Link>
          <Link to="/donate">Donate</Link>
        </nav>

        <a href="mailto:hello@dniproanimals.org" className="site-footer__contact">
          Contact
        </a>
      </div>
    </footer>
  );
}
