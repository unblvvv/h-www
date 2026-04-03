import { ImageWithFallback } from '../../../../components/figma/ImageWithFallback';
import { mockAnimals } from '../../../../shared/data/mockAnimals';
import './AboutSection.scss';

export function AboutSection() {
  const aboutPet = mockAnimals[0];

  return (
    <section className="about" aria-labelledby="about-title">
      <div className="app-container">
        <div className="about__panel">
          <div className="about__content">
            <p className="about__badge">Про нас</p>
            <h2 id="about-title" className="about__title">
              Рятуємо тварин
              <br />
              та поєднуємо їх з родинами
            </h2>
            <p className="about__text">
              Dnipro Animals забезпечує медичну допомогу, реабілітацію та прозорий шлях усиновлення, щоб кожен
              улюбленець знайшов безпечний, люблячий дім.
            </p>
            <p className="about__text about__text--secondary">
              Ми фокусуємося на відповідальному усиновленні, підтримці після нього та прозорій комунікації, щоб кожна
              пара була безпечною та сталою для родини й тварини.
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
