import { Link, useNavigate } from 'react-router';
import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import { Animal } from '../../../../shared/types/animal';
import './FeaturedPetsSection.scss';

interface FeaturedPetsSectionProps {
  pets: Animal[];
}

export function FeaturedPetsSection({ pets }: FeaturedPetsSectionProps) {
  const navigate = useNavigate();
  const carouselPets = pets.slice(0, 8);
  const handleViewInfo = (petId: string) => {
    navigate(`/animal/${petId}`);
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  };

  return (
    <section className="featured-pets" aria-labelledby="featured-pets-title">
      <div className="app-container">
        <div className="featured-pets__head">
          <h2 id="featured-pets-title" className="featured-pets__title">
            Знайдіть нового друга
          </h2>
          <Link to="/find-pet" className="featured-pets__view-all">
            Переглянути всі
          </Link>
        </div>

        <div className="pets-carousel" aria-label="Доступні тварини">
          <div className="pets-carousel__track">
            <div className="pets-carousel__group">
              {carouselPets.map((pet) => (
                <article className="pet-card" key={pet.id}>
                  <ImageWithFallback src={pet.image} alt={pet.name} className="pet-card__image" />
                  <div className="pet-card__meta">
                    <h3>{pet.name}</h3>
                    <p>{pet.sex === 'male' ? 'Самець' : pet.sex === 'female' ? 'Самка' : pet.sex || 'Невідомо'}</p>
                  </div>
                  <button type="button" className="pet-card__button" onClick={() => handleViewInfo(pet.id)}>
                    Детальніше
                  </button>
                </article>
              ))}
            </div>

            <div className="pets-carousel__group" aria-hidden="true">
              {carouselPets.map((pet) => (
                <article className="pet-card" key={`${pet.id}-clone`}>
                  <ImageWithFallback src={pet.image} alt="" className="pet-card__image" />
                  <div className="pet-card__meta">
                    <h3>{pet.name}</h3>
                    <p>{pet.sex === 'male' ? 'Самець' : pet.sex === 'female' ? 'Самка' : pet.sex || 'Невідомо'}</p>
                  </div>
                  <button
                    type="button"
                    className="pet-card__button"
                    tabIndex={-1}
                    onClick={() => handleViewInfo(pet.id)}
                  >
                    Детальніше
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
