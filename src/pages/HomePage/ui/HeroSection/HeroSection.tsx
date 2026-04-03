import { Link } from 'react-router';
import './HeroSection.scss';

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-header-anchor>
      <div className="hero__layout">
        <div className="hero__content">
          <h1 id="hero-title" className="hero__title">
            Допоможіть тваринам
            <br />
            знайти дім
          </h1>
          <p className="hero__lead">
            Знайдіть свого друга та подаруйте йому безпечний дім.
          </p>
          <div className="hero__actions">
            <Link to="/find-pet" className="hero__button hero__button--primary">
              Усиновити
            </Link>
            <Link to="/donate" className="hero__button hero__button--secondary">
              Підтримати
            </Link>
          </div>
        </div>

        <div className="hero__visual" aria-label="Кіт, готовий до усиновлення">
          <div className="hero__cat-wrap">
            <img src="/file.svg" alt="Кіт, готовий до усиновлення" className="hero__cat" />
          </div>
        </div>
      </div>
    </section>
  );
}
