import { useSeo } from '../../shared/utils/useSeo';
import { HeroSection } from './ui/HeroSection/HeroSection';
import { AboutSection } from './ui/AboutSection/AboutSection';
import { FeaturedPetsSection } from './ui/FeaturedPetsSection/FeaturedPetsSection';
import { mockAnimals } from '../../shared/data/mockAnimals';
import './HomePage.scss';

export default function HomePage() {
  useSeo({
    title: 'Animal Shelter in Dnipro | Adopt a Rescue Pet',
    description:
      'Discover rescued cats and dogs in Dnipro, learn how adoption works, and support the shelter by donating.',
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
