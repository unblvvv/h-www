import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Textarea } from '../../components/Textarea/Textarea';
import { useSeo } from '../../shared/utils/useSeo';
import './AdoptionFormPage.scss';

export default function AdoptionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const animal = mockAnimals.find((pet) => pet.id === id);

  useSeo({
    title: animal ? `Усиновити ${animal.name} | Заявка з притулку` : 'Заявка на усиновлення | Притулок для тварин',
    description: 'Подайте заявку на усиновлення онлайн та за бажанням створіть акаунт, щоб зберегти контакти.',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user.name,
      email: user.email,
      phone: user.phone ?? '',
    }));
  }, [isAuthenticated, user]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Потрібно вказати ім'я";
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Потрібно вказати електронну пошту';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Вкажіть коректну електронну пошту';
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Потрібно вказати телефон';
    }
    if (!formData.message.trim()) {
      nextErrors.message = 'Будь ласка, напишіть коротке повідомлення';
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

  if (!animal) {
    return (
      <main className="page adoption-page">
        <div className="app-container adoption-page__not-found">
          <h1 className="section-title">Улюбленця не знайдено</h1>
          <p className="section-subtitle">Запит на усиновлення відсутній у каталозі.</p>
          <Link to="/find-pet">
            <Button>Назад до улюбленців</Button>
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
            <h1>Заявку надіслано для {animal.name}</h1>
            <p>
              Дякуємо. Наша команда скоро зв'яжеться з вами, щоб узгодити наступний крок усиновлення.
            </p>

            {!isAuthenticated ? (
              <div className="adoption-page__register-prompt">
                <h2>Збережіть ваші дані на майбутнє</h2>
                <p>Створіть акаунт, щоб автоматично заповнювати наступні заявки.</p>
                <div>
                  <Button variant="secondary" onClick={() => navigate('/find-pet')}>
                    Пропустити
                  </Button>
                  <Button onClick={() => navigate('/register')}>Створити акаунт</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => navigate('/find-pet')}>Назад до каталогу</Button>
            )}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page adoption-page">
      <div className="app-container">
        <header className="adoption-page__head">
          <h1 className="section-title">Усиновити {animal.name}</h1>
          <p className="section-subtitle">
            Заповніть форму, щоб ми могли розглянути заявку та зв'язатися з вами найближчим часом.
          </p>
        </header>

        <form className="adoption-page__form" onSubmit={handleSubmit}>
          <label>
            <span>Ім'я</span>
            <Input
              value={formData.name}
              onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
              error={errors.name}
            />
          </label>

          <label>
            <span>Електронна пошта</span>
            <Input
              type="email"
              value={formData.email}
              onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
              error={errors.email}
            />
          </label>

          <label>
            <span>Телефон</span>
            <Input
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              error={errors.phone}
            />
          </label>

          <label>
            <span>Повідомлення</span>
            <Textarea
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
              error={errors.message}
              placeholder="Розкажіть, чому хочете усиновити цього улюбленця і які умови можете забезпечити."
            />
          </label>

          <Button type="submit" size="lg">
            Надіслати заявку на усиновлення
          </Button>
        </form>
      </div>
    </main>
  );
}
