import { Animal } from '../../shared/types/animal';
import { AnimalCard } from '../AnimalCard/AnimalCard';
import './PetGrid.scss';

interface PetGridProps {
  pets: Animal[];
  loading: boolean;
}

export function PetGrid({ pets, loading }: PetGridProps) {
  if (loading) {
    return (
      <section className="pet-grid" aria-label="Loading pets">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="pet-grid__skeleton" key={index} />
        ))}
      </section>
    );
  }

  if (!pets.length) {
    return (
      <section className="pet-grid__empty" aria-live="polite">
        <h2>No pets match your filters right now</h2>
        <p>Try changing one of the filters or search with a different name.</p>
      </section>
    );
  }

  return (
    <section className="pet-grid" aria-label="Available pets list">
      {pets.map((pet) => (
        <AnimalCard key={pet.id} animal={pet} />
      ))}
    </section>
  );
}
