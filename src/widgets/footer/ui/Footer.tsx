import { Link } from 'react-router';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer__inner">
        <div className="site-footer__columns">
          <section className="site-footer__column site-footer__column--left" aria-label="Brand information">
            <div className="site-footer__brand">
              <img src="/logo.png" alt="Dnipro Animals logo" className="site-footer__logo" />
              <strong>Dnipro Animals</strong>
            </div>
            <p className="site-footer__description">Helping pets find safe homes</p>
            <address className="site-footer__contacts">
              <a href="mailto:hello@dniproanimals.org">hello@dniproanimals.org</a>
              <span>Dnipro, Ukraine</span>
            </address>
          </section>

          <section className="site-footer__column site-footer__column--center" aria-label="Footer navigation">
            <div className="site-footer__links-group">
              <p className="site-footer__title">Navigation</p>
              <nav className="site-footer__links">
                <Link to="/">Home</Link>
                <Link to="/find-pet">Find a pet</Link>
                <Link to="/donate">Donate</Link>
              </nav>
            </div>
            <div className="site-footer__links-group">
              <p className="site-footer__title">Support</p>
              <nav className="site-footer__links">
                <a href="mailto:hello@dniproanimals.org">Contact</a>
              </nav>
            </div>
          </section>

          <section className="site-footer__column site-footer__column--right" aria-label="Social and donate">
            <button type="button" className="site-footer__donate" aria-label="Donate placeholder">
              Donate
            </button>
            <div className="site-footer__socials" aria-label="Social links">
              <button type="button" aria-label="Facebook">
                <img src="/social/facebook.svg" alt="" />
              </button>
              <button type="button" aria-label="Instagram">
                <img src="/social/instagram.svg" alt="" />
              </button>
              <button type="button" aria-label="YouTube">
                <img src="/social/youtube.svg" alt="" />
              </button>
            </div>
          </section>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; 2026 Dnipro Animals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
