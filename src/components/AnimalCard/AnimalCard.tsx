"use client";

import { Link } from 'react-router';
import { Button } from '../Button/Button';
import { Animal } from '../../shared/types/animal';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import './AnimalCard.scss';

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const petTypeLabel = animal.type === 'dog' ? 'Dog' : 'Cat';
  const petAgeLabel = animal.age === 'young' ? 'Young' : 'Adult';
  const isAvailable = animal.status === 'available';
  const actionLabel = isAvailable ? 'Adopt' : 'View details';
  const availability =
    animal.status === 'available'
      ? 'available for adoption'
      : animal.status === 'in-process'
        ? 'currently in adoption process'
        : 'already adopted';
  const stateLabel =
    animal.status === 'available'
      ? 'Available now'
      : animal.status === 'in-process'
        ? 'In adoption process'
        : 'Already adopted';

  return (
    <article className={`animal-card animal-card--${animal.status}`}>
      <div className="animal-card__image-wrap">
        <ImageWithFallback
          src={animal.image}
          alt={`${animal.name}, ${petAgeLabel.toLowerCase()} ${petTypeLabel.toLowerCase()}, ${availability}`}
          className="animal-card__image"
        />
        <p className={`animal-card__availability animal-card__availability--${animal.status}`}>{stateLabel}</p>
      </div>

      <div className="animal-card__content">
        <header className="animal-card__header">
          <div>
            <h3 className="animal-card__name">{animal.name}</h3>
            <p className="animal-card__meta">{petTypeLabel} - {petAgeLabel}</p>
          </div>
        </header>

        <p className="animal-card__description">{animal.description}</p>

        <Link to={`/animal/${animal.id}`} className="animal-card__link">
          <Button
            variant={isAvailable ? 'primary' : 'secondary'}
            className={`animal-card__button${!isAvailable ? ' animal-card__button--occupied' : ''}`}
          >
            {actionLabel}
          </Button>
        </Link>
      </div>
    </article>
  );
}
