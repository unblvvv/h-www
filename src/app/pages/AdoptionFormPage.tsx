import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockAnimals } from '../data/mockAnimals';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { RegisterModal } from '../components/RegisterModal';
import { useSeo } from '../utils/useSeo';
import './AdoptionFormPage.scss';

export default function AdoptionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, register } = useAuth();
  const animal = mockAnimals.find((pet) => pet.id === id);

  useSeo({
    title: animal ? `Adopt ${animal.name} | Shelter Application` : 'Adoption request | Animal Shelter',
    description: 'Submit your adoption request online and optionally create an account to save your contact data.',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));
  }, [isAuthenticated, user]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone is required';
    }
    if (!formData.message.trim()) {
      nextErrors.message = 'Please write a short message';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitted(true);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    await register({ name, email, phone: formData.phone }, password);
    setShowRegisterModal(false);
    navigate('/profile');
  };

  if (!animal) {
    return (
      <main className="page adoption-page">
        <div className="app-container adoption-page__not-found">
          <h1 className="section-title">Pet not found</h1>
          <p className="section-subtitle">The adoption target is missing from the catalog.</p>
          <Link to="/find-pet">
            <Button>Back to pets</Button>
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="page adoption-page">
        <div className="app-container adoption-page__success-wrap">
          <section className="adoption-page__success-card">
            <CheckCircle2 size={56} />
            <h1>Request sent for {animal.name}</h1>
            <p>
              Thank you. Our team will contact you soon to arrange the next step of the adoption process.
            </p>

            {!isAuthenticated ? (
              <div className="adoption-page__register-prompt">
                <h2>Save your details for next time</h2>
                <p>Create an account to auto-fill your future adoption requests.</p>
                <div>
                  <Button variant="secondary" onClick={() => navigate('/find-pet')}>
                    Skip for now
                  </Button>
                  <Button onClick={() => setShowRegisterModal(true)}>Create account</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => navigate('/find-pet')}>Back to pets catalog</Button>
            )}
          </section>

          <RegisterModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onRegister={handleRegister}
            defaultValues={{ name: formData.name, email: formData.email }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="page adoption-page">
      <div className="app-container">
        <header className="adoption-page__head">
          <h1 className="section-title">Adopt {animal.name}</h1>
          <p className="section-subtitle">
            Complete this form so we can review your request and contact you shortly.
          </p>
        </header>

        <form className="adoption-page__form" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <Input
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              error={errors.name}
            />
          </label>

          <label>
            <span>Email</span>
            <Input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              error={errors.email}
            />
          </label>

          <label>
            <span>Phone</span>
            <Input
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              error={errors.phone}
            />
          </label>

          <label>
            <span>Message</span>
            <Textarea
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              error={errors.message}
              placeholder="Tell us why you want to adopt this pet and what home you can provide."
            />
          </label>

          <Button type="submit" size="lg">
            Submit adoption request
          </Button>
        </form>
      </div>
    </main>
  );
}
