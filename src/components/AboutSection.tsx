import './AboutSection.scss';

export function AboutSection() {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="app-container about__grid">
        <article className="about__card">
          <h2 id="about-title">About our shelter</h2>
          <p>
            We are a volunteer-driven shelter that rescues stray and abandoned animals, provides medical care, and
            carefully matches pets with families.
          </p>
          <p>
            Every adoption includes guidance for first days at home, behavior tips, and transparent follow-up support.
          </p>
        </article>

        <article className="about__card">
          <h3>Why adopters trust us</h3>
          <ul>
            <li>Health-checked pets with clear behavior notes</li>
            <li>Transparent adoption process and friendly support</li>
            <li>Continued post-adoption communication</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
