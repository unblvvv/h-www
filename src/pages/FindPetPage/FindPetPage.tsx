import { useEffect, useMemo, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Animal, AnimalAge, AnimalStatus } from '../../shared/types/animal';
import { FilterBar } from '../../features/animal-filter/FilterBar/FilterBar';
import { PetGrid } from './ui/PetGrid/PetGrid';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { useSeo } from '../../shared/utils/useSeo';
import { apiRequest } from '../../shared/lib/api';
import './FindPetPage.scss';

interface ApiAnimal {
  ID?: string;
  OrganizationID?: string;
  Name?: string;
  Age?: string;
  Sex?: string;
  Description?: string;
  PhotoURLs?: string[];
  Status?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

interface ApiAnimalListResponse {
  items?: ApiAnimal[];
}

const normalizeAge = (value?: string): AnimalAge => {
  const trimmed = value?.trim();
  if (!trimmed) return 'unknown';
  const normalized = trimmed.toLowerCase();
  if (normalized === 'young' || normalized === 'adult') return normalized;
  return trimmed;
};

const normalizeStatus = (value?: string): AnimalStatus => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'in-process') return 'in-process';
  if (normalized === 'adopted') return 'adopted';
  return 'available';
};

const normalizeSex = (value?: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) return 'unknown';
  const normalized = trimmed.toLowerCase();
  if (normalized === 'female' || normalized === 'male') return normalized;
  return trimmed;
};

export default function FindPetPage() {
  useSeo({
    title: 'Знайти улюбленця | Притулок для тварин у Дніпрі',
    description:
      'Шукайте та фільтруйте врятованих тварин за віком і статусом. Переглядайте доступних улюбленців та розпочинайте усиновлення.',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [ageFilter, setAgeFilter] = useState<AnimalAge | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [pets, setPets] = useState<Animal[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiRequest<ApiAnimalListResponse>('/animal')
      .then((data) => {
        if (!isMounted) return;
        const items = data.items ?? [];
        const nextPets = items.map((animal, index) => ({
          id: animal.ID ?? `${index}`,
          name: animal.Name ?? 'Без імені',
          age: normalizeAge(animal.Age),
          sex: normalizeSex(animal.Sex),
          description: animal.Description ?? '',
          image: animal.PhotoURLs ?? [],
          status: normalizeStatus(animal.Status),
        }));
        setPets(nextPets);
      })
      .catch(() => {
        if (!isMounted) return;
        setPets([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

    return pets.filter((pet) => {
      const matchesSearch = !normalizedQuery || pet.name.toLowerCase().includes(normalizedQuery);
      const matchesAge = ageFilter === 'all' || pet.age === ageFilter;
      const matchesStatus = statusFilter === 'all' || pet.status === statusFilter;
      return matchesSearch && matchesAge && matchesStatus;
    });
  }, [pets, searchQuery, ageFilter, statusFilter]);

  const heroPet = useMemo(() => {
    return filteredPets.find((pet) => pet.status === 'available') ?? filteredPets[0];
  }, [filteredPets]);

  const availableCount = filteredPets.filter((pet) => pet.status === 'available').length;
  const inProcessCount = filteredPets.filter((pet) => pet.status === 'in-process').length;
  const adoptedCount = filteredPets.filter((pet) => pet.status === 'adopted').length;

  return (
    <main className="page find-pet-page">
      <section className="find-pet-hero" aria-labelledby="find-pet-title" data-header-anchor>
        <div className="app-container find-pet-hero__layout">
          <div className="find-pet-hero__content">
            <h1 id="find-pet-title">Знайдіть нового друга</h1>
            <p>Відкрийте врятованих улюбленців та усиновіть тварину, яка пасує вашому стилю життя.</p>
          </div>

          <div className="find-pet-hero__visual" aria-hidden="true">
            <div className="find-pet-hero__shape" />
            <ImageWithFallback src={heroPet?.image ?? ''} alt="" className="find-pet-hero__image" />
          </div>
        </div>
      </section>

      <div className="app-container find-pet-page__content">
        <FilterBar
          searchQuery={searchQuery}
          ageFilter={ageFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
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
