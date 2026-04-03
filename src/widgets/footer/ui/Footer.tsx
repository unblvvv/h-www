import { Link } from 'react-router';
import './Footer.scss';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="app-container site-footer__inner">
        <div className="site-footer__columns">
          <section className="site-footer__column site-footer__column--left" aria-label="Інформація про бренд">
            <div className="site-footer__brand">
              <img src="/logo.png" alt="Логотип Dnipro Animals" className="site-footer__logo" />
              <strong>Dnipro Animals</strong>
            </div>
            <p className="site-footer__description">Допомагаємо тваринам знаходити безпечні домівки</p>
            <address className="site-footer__contacts">
              <a href="mailto:hello@dniproanimals.org">hello@dniproanimals.org</a>
              <span>Дніпро, Україна</span>
            </address>
          </section>

          <section className="site-footer__column site-footer__column--center" aria-label="Навігація футера">
            <div className="site-footer__links-group">
              <p className="site-footer__title">Навігація</p>
              <nav className="site-footer__links">
                <Link to="/">Головна</Link>
                <Link to="/find-pet">Знайти улюбленця</Link>
                <Link to="/donate">Підтримати</Link>
              </nav>
            </div>
          </section>

          <section className="site-footer__column site-footer__column--right" aria-label="Соцмережі та донати">
            <Link to="/donate" className="site-footer__donate" aria-label="Підтримати притулок">
              Підтримати
            </Link>
            <div className="site-footer__socials" aria-label="Соціальні посилання">
              <button type="button" aria-label="Фейсбук">
                <a href="https://www.facebook.com/dniproanimalsua/" target="_blank" rel="noopener noreferrer">
                  <img src="/social/facebook.svg" alt="Фейсбук" />
                </a>
              </button>
              <button type="button" aria-label="Інстаграм">
                <a href="https://instagram.com/dniproanimals" target="_blank" rel="noopener noreferrer">
                  <img src="/social/instagram.svg" alt="Інстаграм" />
                </a>
              </button>
            </div>
          </section>
        </div>
        <div className="site-footer__bottom">
          <p>&copy; 2026 Dnipro Animals. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}
