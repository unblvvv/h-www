import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useSeo } from '../../shared/utils/useSeo';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import './AnimalDetailsPage.scss';

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const animal = mockAnimals.find((pet) => pet.id === id);
  const petTypeLabel = animal?.type === 'dog' ? 'Dog' : 'Cat';
  const petAgeLabel = animal?.age === 'young' ? 'Young' : 'Adult';
  const petGenderLabel = animal?.gender === 'female' ? 'Female' : 'Male';
  const statusHint =
    animal?.status === 'available'
      ? 'Ready to go home today'
      : animal?.status === 'in-process'
        ? 'A family is currently applying'
        : 'Already happily adopted';

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
              {[1, 2, 3].map((thumb) => (
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
            <header className="animal-details-page__title-wrap">
              <h1>{animal.name}</h1>
              <p>{petTypeLabel} - {petAgeLabel} - {petGenderLabel}</p>
            </header>

            <section className="animal-details-page__status-box" aria-label="Adoption status">
              <Badge variant={animal.status} />
              <p>{statusHint}</p>
            </section>

            <section className="animal-details-page__about">
              <h2>About this pet</h2>
              <p>{animal.description}</p>
            </section>

            <section className="animal-details-page__facts" aria-label="Pet facts">
              <div>
                <span>Type</span>
                <strong>{petTypeLabel}</strong>
              </div>
              <div>
                <span>Age</span>
                <strong>{petAgeLabel}</strong>
              </div>
              <div>
                <span>Gender</span>
                <strong>{petGenderLabel}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{animal.status === 'available' ? 'Available' : animal.status === 'in-process' ? 'In process' : 'Adopted'}</strong>
              </div>
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
