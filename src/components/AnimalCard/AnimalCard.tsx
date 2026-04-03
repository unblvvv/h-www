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
  const petAgeLabel =
    animal.age === 'young' ? 'Молодий' : animal.age === 'adult' ? 'Дорослий' : animal.age || 'Невідомо';
  const petGenderLabel =
    animal.sex === 'male' ? 'Самець' : animal.sex === 'female' ? 'Самка' : animal.sex || 'Невідомо';
  const isAvailable = animal.status === 'available';
  const actionLabel = isAvailable ? 'Усиновити' : 'Деталі';
  const availability =
    animal.status === 'available'
      ? 'доступний для усиновлення'
      : animal.status === 'in-process'
        ? 'зараз у процесі усиновлення'
        : 'вже усиновлено';
  const stateLabel =
    animal.status === 'available'
      ? 'Доступний зараз'
      : animal.status === 'in-process'
        ? 'В процесі усиновлення'
        : 'Вже усиновлено';

  const imageSrc = Array.isArray(animal.image) ? animal.image[0] ?? '' : animal.image;

  return (
    <article className={`animal-card animal-card--${animal.status}`}>
      <div className="animal-card__image-wrap">
        <ImageWithFallback
          src={imageSrc}
          alt={`${animal.name}, ${petAgeLabel.toLowerCase()}, ${availability}`}
          className="animal-card__image"
        />
        <p className={`animal-card__availability animal-card__availability--${animal.status}`}>{stateLabel}</p>
      </div>

      <div className="animal-card__content">
        <header className="animal-card__header">
          <div>
            <h3 className="animal-card__name">{animal.name}</h3>
            <p className="animal-card__meta">
              {petAgeLabel} - {petGenderLabel}
            </p>
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
