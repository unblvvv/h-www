import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useSeo } from '../../shared/utils/useSeo';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import './AnimalDetailsPage.scss';

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const animal = mockAnimals.find((pet) => pet.id === id);

  useSeo({
    title: animal ? `${animal.name} | Rescue Pet Details` : 'Pet details | Animal Shelter',
    description: animal
      ? `${animal.name} is a ${animal.age} ${animal.type} currently ${animal.status}. Learn more and apply to adopt.`
      : 'View pet details and start your adoption request.',
  });

  if (!animal) {
    return (
      <main className="page animal-details-page">
        <div className="app-container animal-details-page__not-found">
          <h1 className="section-title">Pet not found</h1>
          <p className="section-subtitle">This pet profile does not exist or has been removed.</p>
          <Link to="/find-pet">
            <Button>Back to pets catalog</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page animal-details-page">
      <div className="app-container">
        <Link to="/find-pet" className="animal-details-page__back-link">
          <ArrowLeft size={18} />
          Back to pets catalog
        </Link>

        <article className="animal-details-page__card">
          <section className="animal-details-page__gallery" aria-label={`Photos of ${animal.name}`}>
            <ImageWithFallback
              src={animal.image}
              alt={`${animal.name}, ${animal.age} ${animal.type}, rescue shelter profile photo`}
              className="animal-details-page__main-image"
            />
            <div className="animal-details-page__thumbs">
              {[1, 2].map((thumb) => (
                <ImageWithFallback
                  key={thumb}
                  src={animal.image}
                  alt={`${animal.name} photo ${thumb + 1}`}
                  className="animal-details-page__thumb-image"
                />
              ))}
            </div>
          </section>

          <section className="animal-details-page__info">
            <header>
              <h1>{animal.name}</h1>
              <p>
                {animal.age === 'young' ? 'Young' : 'Adult'} {animal.type} / {animal.gender}
              </p>
            </header>

            <Badge variant={animal.status} />

            <section>
              <h2>About this pet</h2>
              <p>{animal.description}</p>
            </section>

            <section className="animal-details-page__actions" aria-label="Pet actions">
              <Button size="lg" onClick={() => navigate(`/adopt/${animal.id}`)} disabled={animal.status !== 'available'}>
                Adopt this pet
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/donate')}>
                Donate
              </Button>
            </section>
          </section>
        </article>
      </div>
    </main>
  );
}
