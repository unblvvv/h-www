import './HowItWorksSection.scss';

const steps = [
  {
    title: 'Browse pets',
    text: 'Use filters by type, age, and status to find pets that fit your lifestyle.',
  },
  {
    title: 'Send an adoption request',
    text: 'Fill in a short form. No account is required for your first application.',
  },
  {
    title: 'Meet and adopt',
    text: 'Our team contacts you, arranges a meeting, and supports your transition home.',
  },
];

export function HowItWorksSection() {
  return (
    <section className="how-it-works" aria-labelledby="how-it-works-title">
      <div className="app-container">
        <h2 id="how-it-works-title" className="section-title">
          How adoption works
        </h2>
        <p className="section-subtitle">A clear and simple process designed for pets and people.</p>

        <div className="how-it-works__steps">
          {steps.map((step, index) => (
            <article className="how-step" key={step.title}>
              <span className="how-step__number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
