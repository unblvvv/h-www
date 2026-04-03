import { useState } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSeo } from '../../shared/utils/useSeo';
import { DonationForm } from '../../features/donate/DonationForm/DonationForm';
import { Button } from '../../components/Button/Button';
import './DonatePage.scss';
const monoPayUrl = '/mono_pay.png';

export default function DonatePage() {
  useSeo({
    title: 'Підтримати притулок | Допомога врятованим тваринам',
    description:
      'Підтримайте врятованих котів і собак разовим донатом. Ваш внесок допомагає з кормом, лікуванням і доглядом.',
  });

  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'redirect' | 'confirm'>('idle');

  const handleDonate = (amount: number) => {
    if (amount <= 0) {
      return;
    }

    setProcessing(true);
    setPaymentStep('redirect');
    window.setTimeout(() => {
      setPaymentStep('confirm');
    }, 700);
    window.setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setPaymentStep('idle');
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
      <div
        className="app-container donate-page__layout"
        // style={{ backgroundImage: `url(${monoPayUrl})` }}
      >
        <header className="donate-page__intro">
          <img src={monoPayUrl} alt="Monobank Pay" style={{height:"30px",width:"30px"}}/>
          <h1 className="section-title">Підтримайте врятованих тварин</h1>
          <p className="section-subtitle">
            Кожен донат іде на необхідну допомогу: візити до ветеринара, ліки, корм і пошук безпечних домівок.
          </p>
        </header>

        <section className="donate-page__form-wrap" aria-label="Форма донату">
          <DonationForm onDonate={handleDonate} disabled={processing} />
          {processing ? (
            <div className="donate-page__gateway">
              <div className="donate-page__gateway-badge" aria-hidden="true">
                <img src={monoPayUrl} alt="Monobank Pay" />
              </div>
              <div>
                <p>Monobank Pay</p>
                <span>
                  {paymentStep === 'confirm'
                    ? 'Підтверджуємо оплату у банку...'
                    : 'Переадресовуємо на сторінку оплати...'}
                </span>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
