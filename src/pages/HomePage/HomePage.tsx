import { useEffect, useState } from 'react';
import { useSeo } from '../../shared/utils/useSeo';
import { HeroSection } from './ui/HeroSection/HeroSection';
import { AboutSection } from './ui/AboutSection/AboutSection';
import { FeaturedPetsSection } from './ui/FeaturedPetsSection/FeaturedPetsSection';
import { apiRequest } from '../../shared/lib/api';
import { Animal, AnimalAge, AnimalStatus } from '../../shared/types/animal';
import './HomePage.scss';

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

const FEATURED_LIMIT = 8;

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

export default function HomePage() {
  useSeo({
    title: 'Притулок для тварин у Дніпрі | Усиновіть врятованого улюбленця',
    description:
      'Знайдіть врятованих котів і собак у Дніпрі, дізнайтеся, як працює усиновлення, і підтримайте притулок донатами.',
  });

  const [featuredPets, setFeaturedPets] = useState<Animal[]>([]);

  useEffect(() => {
    let isMounted = true;

    apiRequest<ApiAnimalListResponse>('/animal')
      .then((data) => {
        if (!isMounted) return;
        const items = data.items ?? [];
        const mapped = items.map((item, index) => ({
          id: item.ID ?? `${index}`,
          name: item.Name ?? 'Без імені',
          age: normalizeAge(item.Age),
          sex: normalizeSex(item.Sex),
          description: item.Description ?? '',
          image: item.PhotoURLs ?? [],
          status: normalizeStatus(item.Status),
        }));
        const nextFeatured = mapped.filter((pet) => pet.status !== 'adopted').slice(0, FEATURED_LIMIT);
        setFeaturedPets(nextFeatured);
      })
      .catch(() => {
        if (!isMounted) return;
        setFeaturedPets([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page home-page">
      <HeroSection />
      <AboutSection />
      <FeaturedPetsSection pets={featuredPets} />
    </main>
  );
}
