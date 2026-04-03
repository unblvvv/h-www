import { useSeo } from '../../shared/utils/useSeo';
import { HeroSection } from './ui/HeroSection/HeroSection';
import { AboutSection } from './ui/AboutSection/AboutSection';
import { FeaturedPetsSection } from './ui/FeaturedPetsSection/FeaturedPetsSection';
import { mockAnimals } from '../../shared/data/mockAnimals';
import './HomePage.scss';

export default function HomePage() {
  useSeo({
    title: 'Притулок для тварин у Дніпрі | Усиновіть врятованого улюбленця',
    description:
      'Знайдіть врятованих котів і собак у Дніпрі, дізнайтеся, як працює усиновлення, і підтримайте притулок донатами.',
  });

  const featuredPets = mockAnimals.filter((pet) => pet.status !== 'adopted').slice(0, 8);

  return (
    <main className="page home-page">
      <HeroSection />
      <AboutSection />
      <FeaturedPetsSection pets={featuredPets} />
    </main>
  );
}
