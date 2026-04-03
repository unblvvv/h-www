import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { useAuth } from '@/features/auth/AuthContext';

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Потрібно вказати ім'я та прізвище";
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Потрібно вказати електронну пошту';
    } else if (!isEmailValid(formData.email)) {
      nextErrors.email = 'Вкажіть коректну електронну пошту';
    }

    if (!formData.password) {
      nextErrors.password = 'Потрібно вказати пароль';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Пароль має містити щонайменше 6 символів';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Підтвердьте пароль';
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Паролі не збігаються';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register(
        {
          name: formData.fullName,
          email: formData.email,
          phone: '',
        },
        formData.password,
      );
      navigate('/profile');
    } catch {
      setFormError('Не вдалося створити акаунт. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page" aria-labelledby="register-title">
      <div className="app-container">
        <div className="auth-page__card">
          <div className="auth-page__layout auth-page__layout--register">
            <div className="auth-page__form-pane">
              <button
                type="button"
                className="auth-page__back"
                onClick={() => {
                  if (window.history.length > 1) {
                    navigate(-1);
                    return;
                  }
                  navigate('/');
                }}
              >
                <ArrowLeft size={16} />
                Назад
              </button>

              <form className="auth-form" onSubmit={handleSubmit}>
                {formError ? <p className="auth-form__alert">{formError}</p> : null}

                <label className="auth-form__field">
                  <span>Ім'я та прізвище</span>
                  <Input
                    className="auth-input"
                    type="text"
                    placeholder="Ваші ім'я та прізвище"
                    value={formData.fullName}
                    onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
                    error={errors.fullName}
                  />
                </label>

                <label className="auth-form__field">
                  <span>Електронна пошта</span>
                  <Input
                    className="auth-input"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                    error={errors.email}
                  />
                </label>

                <label className="auth-form__field">
                  <span>Пароль</span>
                  <Input
                    className="auth-input"
                    type="password"
                    placeholder="Щонайменше 6 символів"
                    value={formData.password}
                    onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                    error={errors.password}
                  />
                </label>

                <label className="auth-form__field">
                  <span>Підтвердьте пароль</span>
                  <Input
                    className="auth-input"
                    type="password"
                    placeholder="Повторіть пароль"
                    value={formData.confirmPassword}
                    onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                    error={errors.confirmPassword}
                  />
                </label>

                <Button className="auth-form__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Створення акаунта...' : 'Створити акаунт'}
                </Button>
              </form>

              <p className="auth-page__switch">
                Вже маєте акаунт? <Link to="/login">Увійти</Link>
              </p>
            </div>

            <aside className="auth-page__content-pane">
              <p className="auth-page__badge">Створити акаунт</p>
              <h1 id="register-title" className="auth-page__title">
                Приєднуйтесь до Dnipro Animals
              </h1>
              <p className="auth-page__subtitle">Створіть профіль і розпочніть шлях усиновлення.</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}