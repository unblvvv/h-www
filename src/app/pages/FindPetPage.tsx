import { useEffect, useMemo, useState } from 'react';
import { mockAnimals } from '../data/mockAnimals';
import { AnimalAge, AnimalStatus, AnimalType } from '../types/animal';
import { FilterBar } from '../components/FilterBar';
import { PetGrid } from '../components/PetGrid';
import { useSeo } from '../utils/useSeo';
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

  return (
    <main className="page find-pet-page">
      <div className="app-container">
        <header className="find-pet-page__head">
          <h1 className="section-title">Find a pet</h1>
          <p className="section-subtitle">
            Browse rescue cats and dogs using flexible filters. Each profile includes age, status, and adoption details.
          </p>
        </header>

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

        <PetGrid pets={filteredPets} loading={loading} />
      </div>
    </main>
  );
}
