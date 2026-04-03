import { Link } from 'react-router';
import { PawPrint } from 'lucide-react';
import { Button } from './Button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Animal } from '../shared/types/animal';
import './HeroSection.scss';

interface HeroSectionProps {
  pets: Animal[];
}

export function HeroSection({ pets }: HeroSectionProps) {
  const cards = pets.slice(0, 3);

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="app-container hero__layout">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <PawPrint size={16} />
            Trusted local shelter
          </p>
          <h1 id="hero-title" className="hero__title">
            Help a rescue pet find a home that feels safe and full of love
          </h1>
          <p className="hero__lead">
            We care for abandoned cats and dogs, support adopters, and guide every step from the first search to
            successful adoption.
          </p>
          <div className="hero__actions">
            <Link to="/find-pet">
              <Button size="lg">Find a pet</Button>
            </Link>
            <Link to="/donate">
              <Button size="lg" variant="secondary">
                Donate
              </Button>
            </Link>
          </div>
        </div>

        <div className="hero__visual" aria-label="Featured pets preview">
          {cards.map((pet, index) => (
            <article key={pet.id} className={`hero-card hero-card--${index + 1}`}>
              <ImageWithFallback
                src={pet.image}
                alt={`${pet.name}, a ${pet.type} currently living in shelter care`}
                className="hero-card__image"
              />
              <div className="hero-card__body">
                <strong>{pet.name}</strong>
                <span>{pet.type === 'dog' ? 'Dog' : 'Cat'}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
