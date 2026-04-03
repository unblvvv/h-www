import { useSeo } from '../utils/useSeo';
import { mockAnimals } from '../data/mockAnimals';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { FeaturedPetsSection } from '../components/FeaturedPetsSection';
import './HomePage.scss';

export default function HomePage() {
  useSeo({
    title: 'Animal Shelter in Dnipro | Adopt a Rescue Pet',
    description:
      'Discover rescued cats and dogs in Dnipro, learn how adoption works, and support the shelter by donating.',
  });

  const featuredPets = mockAnimals.filter((pet) => pet.status === 'available').slice(0, 3);

  return (
    <main className="page home-page">
      <HeroSection pets={featuredPets} />
      <AboutSection />
      <HowItWorksSection />
      <FeaturedPetsSection pets={featuredPets} />
    </main>
  );
}
