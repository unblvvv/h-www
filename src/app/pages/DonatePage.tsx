import { useState } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useSeo } from '../utils/useSeo';
import { DonationForm } from '../components/DonationForm';
import { Button } from '../components/Button';
import './DonatePage.scss';

export default function DonatePage() {
  useSeo({
    title: 'Donate to Animal Shelter | Help Rescue Pets',
    description:
      'Support rescued cats and dogs with one-time donations. Your contribution helps with food, treatment, and care.',
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
            <h1>Thank you for your donation</h1>
            <p>Your support helps provide treatment, food, and temporary housing for rescue animals.</p>
            <Button onClick={() => navigate('/find-pet')}>Continue to pets catalog</Button>
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
          <h1 className="section-title">Support rescue pets</h1>
          <p className="section-subtitle">
            Every donation goes to essential care: veterinary visits, medicine, food, and finding safe homes.
          </p>
        </header>

        <section className="donate-page__form-wrap" aria-label="Donation form">
          <DonationForm onDonate={handleDonate} disabled={processing} />
          {processing ? <p className="donate-page__processing">Processing donation...</p> : null}
        </section>
      </div>
    </main>
  );
}
