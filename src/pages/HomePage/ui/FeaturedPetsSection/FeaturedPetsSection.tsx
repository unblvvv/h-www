import { Link } from 'react-router';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import { Animal } from '../../../../shared/types/animal';
import './FeaturedPetsSection.scss';

interface FeaturedPetsSectionProps {
  pets: Animal[];
}

export function FeaturedPetsSection({ pets }: FeaturedPetsSectionProps) {
  const carouselPets = pets.slice(0, 8);

  return (
    <section className="featured-pets" aria-labelledby="featured-pets-title">
      <div className="app-container">
        <div className="featured-pets__head">
          <h2 id="featured-pets-title" className="featured-pets__title">
            Find your new friend
          </h2>
          <Link to="/find-pet" className="featured-pets__view-all">
            View all
          </Link>
        </div>

        <div className="pets-carousel" aria-label="Available pets">
          <div className="pets-carousel__track">
            <div className="pets-carousel__group">
              {carouselPets.map((pet) => (
                <article className="pet-card" key={pet.id}>
                  <ImageWithFallback src={pet.image} alt={pet.name} className="pet-card__image" />
                  <div className="pet-card__meta">
                    <h3>{pet.name}</h3>
                    <p>{pet.type}</p>
                  </div>
                  <Link to={`/adopt/${pet.id}`} className="pet-card__button">
                    Adopt
                  </Link>
                </article>
              ))}
            </div>

            <div className="pets-carousel__group" aria-hidden="true">
              {carouselPets.map((pet) => (
                <article className="pet-card" key={`${pet.id}-clone`}>
                  <ImageWithFallback src={pet.image} alt="" className="pet-card__image" />
                  <div className="pet-card__meta">
                    <h3>{pet.name}</h3>
                    <p>{pet.type}</p>
                  </div>
                  <Link to={`/adopt/${pet.id}`} className="pet-card__button" tabIndex={-1}>
                    Adopt
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
