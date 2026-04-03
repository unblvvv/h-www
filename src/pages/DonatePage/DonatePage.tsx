import { useState } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSeo } from '../../shared/utils/useSeo';
import { DonationForm } from '../../features/donate/DonationForm/DonationForm';
import { Button } from '../../components/Button/Button';
import './DonatePage.scss';

export default function DonatePage() {
  useSeo({
    title: 'Підтримати притулок | Допомога врятованим тваринам',
    description:
      'Підтримайте врятованих котів і собак разовим донатом. Ваш внесок допомагає з кормом, лікуванням і доглядом.',
  });

  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDonate = (amount: number) => {
    if (amount <= 0) {
      return;
    }

    setProcessing(true);
    window.setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 1400);
  };

  if (success) {
    return (
      <main className="page donate-page">
        <div className="app-container donate-page__success-wrap">
          <section className="donate-page__success-card">
            <CheckCircle2 size={56} />
            <h1>Дякуємо за вашу підтримку</h1>
            <p>Ваша допомога забезпечує лікування, корм і тимчасове житло для врятованих тварин.</p>
            <Button onClick={() => navigate('/find-pet')}>Перейти до каталогу</Button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page donate-page">
      <div className="app-container donate-page__layout">
        <header className="donate-page__intro">
          <Heart size={30} />
          <h1 className="section-title">Підтримайте врятованих тварин</h1>
          <p className="section-subtitle">
            Кожен донат іде на необхідну допомогу: візити до ветеринара, ліки, корм і пошук безпечних домівок.
          </p>
        </header>

        <section className="donate-page__form-wrap" aria-label="Форма донату">
          <DonationForm onDonate={handleDonate} disabled={processing} />
          {processing ? <p className="donate-page__processing">Обробка донату...</p> : null}
        </section>
      </div>
    </main>
  );
}
