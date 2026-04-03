import { useEffect, useMemo, useState } from 'react';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { AnimalAge, AnimalStatus, AnimalType } from '../../shared/types/animal';
import { FilterBar } from '../../components/FilterBar/FilterBar';
import { PetGrid } from '../../components/PetGrid/PetGrid';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useSeo } from '../../shared/utils/useSeo';
import './FindPetPage.scss';

export default function FindPetPage() {
  useSeo({
    title: 'Find a Pet | Animal Shelter in Dnipro',
    description:
      'Search and filter rescue pets by type, age, and status. Explore available animals and start adoption.',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AnimalType | 'all'>('all');
  const [ageFilter, setAgeFilter] = useState<AnimalAge | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 260);

    return () => window.clearTimeout(timer);
  }, [searchQuery, typeFilter, ageFilter, statusFilter]);

  const filteredPets = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase().trim();

    return mockAnimals.filter((pet) => {
      const matchesSearch = !normalizedQuery || pet.name.toLowerCase().includes(normalizedQuery);
      const matchesType = typeFilter === 'all' || pet.type === typeFilter;
      const matchesAge = ageFilter === 'all' || pet.age === ageFilter;
      const matchesStatus = statusFilter === 'all' || pet.status === statusFilter;
      return matchesSearch && matchesType && matchesAge && matchesStatus;
    });
  }, [searchQuery, typeFilter, ageFilter, statusFilter]);

  const heroPet = useMemo(() => {
    return mockAnimals.find((pet) => pet.status === 'available') ?? mockAnimals[0];
  }, []);

  const availableCount = filteredPets.filter((pet) => pet.status === 'available').length;
  const inProcessCount = filteredPets.filter((pet) => pet.status === 'in-process').length;
  const adoptedCount = filteredPets.filter((pet) => pet.status === 'adopted').length;

  return (
    <main className="page find-pet-page">
      <section className="find-pet-hero" aria-labelledby="find-pet-title" data-header-anchor>
        <div className="app-container find-pet-hero__layout">
          <div className="find-pet-hero__content">
            <h1 id="find-pet-title">Find your new friend</h1>
            <p>Discover rescue cats and dogs and adopt a companion that matches your life.</p>
          </div>

          <div className="find-pet-hero__visual" aria-hidden="true">
            <div className="find-pet-hero__shape" />
            <ImageWithFallback src={heroPet.image} alt="" className="find-pet-hero__image" />
          </div>
        </div>
      </section>

      <div className="app-container find-pet-page__content">
        <FilterBar
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          ageFilter={ageFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onTypeChange={setTypeFilter}
          onAgeChange={setAgeFilter}
          onStatusChange={setStatusFilter}
        />

        <section className="find-pet-catalog" aria-label="Catalog summary">
          <div className="find-pet-catalog__head">
            <h2>Pets catalog</h2>
            <p>{filteredPets.length} results - {availableCount} available now</p>
          </div>

          <div className="find-pet-catalog__legend" aria-label="Pet status legend">
            <span className="find-pet-catalog__chip find-pet-catalog__chip--available">
              Available: {availableCount}
            </span>
            <span className="find-pet-catalog__chip find-pet-catalog__chip--in-process">
              In process: {inProcessCount}
            </span>
            <span className="find-pet-catalog__chip find-pet-catalog__chip--adopted">
              Adopted: {adoptedCount}
            </span>
          </div>
        </section>

        <PetGrid pets={filteredPets} loading={loading} />
      </div>
    </main>
  );
}
