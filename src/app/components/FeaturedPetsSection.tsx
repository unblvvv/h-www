import { Link } from 'react-router';
import { Button } from './Button';
import { AnimalCard } from './AnimalCard';
import { Animal } from '../types/animal';
import './FeaturedPetsSection.scss';

interface FeaturedPetsSectionProps {
  pets: Animal[];
}

export function FeaturedPetsSection({ pets }: FeaturedPetsSectionProps) {
  return (
    <section className="featured-pets" aria-labelledby="featured-pets-title">
      <div className="app-container">
        <div className="featured-pets__head">
          <div>
            <h2 id="featured-pets-title" className="section-title">
              Featured pets
            </h2>
            <p className="section-subtitle">Meet a few companions who are currently looking for home.</p>
          </div>
          <Link to="/find-pet">
            <Button variant="secondary">Open full pets catalog</Button>
          </Link>
        </div>

        <div className="featured-pets__grid">
          {pets.slice(0, 3).map((pet) => (
            <AnimalCard key={pet.id} animal={pet} />
          ))}
        </div>
      </div>
    </section>
  );
}
