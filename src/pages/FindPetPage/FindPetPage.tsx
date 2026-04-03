import { useEffect, useMemo, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { AnimalAge, AnimalStatus, AnimalType } from '../../shared/types/animal';
import { FilterBar } from '../../features/animal-filter/FilterBar/FilterBar';
import { PetGrid } from './ui/PetGrid/PetGrid';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useSeo } from '../../shared/utils/useSeo';
import './FindPetPage.scss';

export default function FindPetPage() {
  useSeo({
    title: 'Знайти улюбленця | Притулок для тварин у Дніпрі',
    description:
      'Шукайте та фільтруйте врятованих тварин за типом, віком і статусом. Переглядайте доступних улюбленців та розпочинайте усиновлення.',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AnimalType | 'all'>('all');
  const [ageFilter, setAgeFilter] = useState<AnimalAge | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setLoading(false);
    }, 260);

    return () => window.clearTimeout(timer);
  }, [searchQuery, typeFilter, ageFilter, statusFilter]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 680);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <h1 id="find-pet-title">Знайдіть нового друга</h1>
            <p>Відкрийте врятованих котів і собак та усиновіть улюбленця, який пасує вашому стилю життя.</p>
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

        <section className="find-pet-catalog" aria-label="Підсумок каталогу">
          <div className="find-pet-catalog__head">
            <h2>Каталог улюбленців</h2>
            <p>{filteredPets.length} результатів - {availableCount} доступні зараз</p>
          </div>

          <div className="find-pet-catalog__legend" aria-label="Легенда статусів">
            <span className="find-pet-catalog__chip find-pet-catalog__chip--available">
              Доступні: {availableCount}
            </span>
            <span className="find-pet-catalog__chip find-pet-catalog__chip--in-process">
              В процесі: {inProcessCount}
            </span>
            <span className="find-pet-catalog__chip find-pet-catalog__chip--adopted">
              Усиновлено: {adoptedCount}
            </span>
          </div>
        </section>

        <PetGrid pets={filteredPets} loading={loading} />
      </div>

      <button
        type="button"
        className={`find-pet-page__scroll-top${showScrollTop ? ' is-visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Повернутися вгору"
      >
        <ArrowUp size={20} />
      </button>
    </main>
  );
}
