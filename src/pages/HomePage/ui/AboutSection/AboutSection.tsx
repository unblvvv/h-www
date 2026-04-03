import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import { mockAnimals } from '../../../../shared/data/mockAnimals';
import './AboutSection.scss';

export function AboutSection() {
  const aboutPet = mockAnimals.find((pet) => pet.type === 'cat') ?? mockAnimals[0];

  return (
    <section className="about" aria-labelledby="about-title">
      <div className="app-container">
        <div className="about__panel">
          <div className="about__content">
            <p className="about__badge">About us</p>
            <h2 id="about-title" className="about__title">
              We rescue pets
              <br />
              and match real families
            </h2>
            <p className="about__text">
              Dnipro Animals provides medical care, rehabilitation, and a transparent adoption path to help every pet
              find a safe, loving home.
            </p>
            <p className="about__text about__text--secondary">
              We focus on responsible adoption, post-adoption support, and clear communication so each match is safe
              and sustainable for both families and pets.
            </p>
          </div>

          <div className="about__visual" aria-hidden="true">
            <div className="about__visual-shape" />
            <ImageWithFallback
              src={aboutPet.image}
              alt=""
              className="about__image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
