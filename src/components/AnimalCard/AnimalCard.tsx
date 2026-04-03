"use client";

import { Link } from 'react-router';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Animal } from '../../shared/types/animal';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import './AnimalCard.scss';

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  const petTypeLabel = animal.type === 'dog' ? 'dog' : 'cat';
  const availability =
    animal.status === 'available'
      ? 'available for adoption'
      : animal.status === 'in-process'
        ? 'currently in adoption process'
        : 'already adopted';

  return (
    <article className="animal-card">
      <div className="animal-card__image-wrap">
        <ImageWithFallback
          src={animal.image}
          alt={`${animal.name}, ${animal.age} ${petTypeLabel}, ${availability}`}
          className="animal-card__image"
        />
      </div>

      <div className="animal-card__content">
        <header className="animal-card__header">
          <div>
            <h3 className="animal-card__name">{animal.name}</h3>
            <p className="animal-card__meta">
              {animal.age === 'young' ? 'Young' : 'Adult'} {petTypeLabel}
            </p>
          </div>
          <Badge variant={animal.status} />
        </header>

        <p className="animal-card__description">{animal.description}</p>

        <Link to={`/animal/${animal.id}`} className="animal-card__link">
          <Button variant="primary" className="animal-card__button">
            View pet details
          </Button>
        </Link>
      </div>
    </article>
  );
}
