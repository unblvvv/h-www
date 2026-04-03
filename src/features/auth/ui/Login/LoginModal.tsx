import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { useAuth } from '@/features/auth/AuthContext';

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!isEmailValid(formData.email)) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
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
      await login(formData.email, formData.password);
      navigate('/profile');
    } catch {
      setFormError('Wrong email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page" aria-labelledby="login-title">
      <div className="app-container">
        <div className="auth-page__card">
          <div className="auth-page__layout auth-page__layout--login">
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
                Back
              </button>

              <form className="auth-form" onSubmit={handleSubmit}>
                {formError ? <p className="auth-form__alert">{formError}</p> : null}

                <label className="auth-form__field">
                  <span>Email</span>
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
                  <span>Password</span>
                  <Input
                    className="auth-input"
                    type="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                    error={errors.password}
                  />
                </label>

                <Button className="auth-form__submit" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </Button>
              </form>

              <p className="auth-page__switch">
                Don't have an account? <Link to="/register">Sign up</Link>
              </p>
            </div>

            <aside className="auth-page__content-pane">
              <p className="auth-page__badge">Log in</p>
              <h1 id="login-title" className="auth-page__title">
                Welcome back
              </h1>
              <p className="auth-page__subtitle">Sign in to continue helping pets find a loving home.</p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}