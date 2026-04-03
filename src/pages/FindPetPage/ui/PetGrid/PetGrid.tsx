import { Animal } from '../../../../shared/types/animal';
import { AnimalCard } from '../../../../components/AnimalCard/AnimalCard';
import './PetGrid.scss';

interface PetGridProps {
  pets: Animal[];
  loading: boolean;
}

export function PetGrid({ pets, loading }: PetGridProps) {
  if (loading) {
    return (
      <section className="pet-grid" aria-label="Завантаження тварин">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="pet-grid__skeleton" key={index} />
        ))}
      </section>
    );
  }

  if (!pets.length) {
    return (
      <section className="pet-grid__empty" aria-live="polite">
        <h2>Наразі жоден улюбленець не відповідає фільтрам</h2>
        <p>Спробуйте змінити один із фільтрів або пошукайте інше ім'я.</p>
      </section>
    );
  }

  return (
    <section className="pet-grid" aria-label="Список доступних тварин">
      {pets.map((pet) => (
        <AnimalCard key={pet.id} animal={pet} />
      ))}
    </section>
  );
}
