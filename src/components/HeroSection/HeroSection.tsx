import { Link } from 'react-router';
import './HeroSection.scss';

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-header-anchor>
      <div className="hero__layout">
        <div className="hero__content">
          <h1 id="hero-title" className="hero__title">
            Help pets
            <br />
            find a home
          </h1>
          <p className="hero__lead">
            Find your companion and give them a safe home.
          </p>
          <div className="hero__actions">
            <Link to="/find-pet" className="hero__button hero__button--primary">
              Adopt
            </Link>
            <Link to="/donate" className="hero__button hero__button--secondary">
              Donate
            </Link>
          </div>
        </div>

        <div className="hero__visual" aria-label="Cat ready for adoption">
          <div className="hero__cat-wrap">
            <img src="/file.svg" alt="Cat ready for adoption" className="hero__cat" />
          </div>
        </div>
      </div>
    </section>
  );
}
