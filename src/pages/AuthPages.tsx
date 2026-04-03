import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/Button/Button';
import { Input } from '../components/Input/Input';
import { useAuth } from '../features/auth/AuthContext';

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
          <p className="auth-page__badge">Log in</p>
          <h1 id="login-title" className="auth-page__title">
            Welcome back
          </h1>
          <p className="auth-page__subtitle">Sign in to continue helping pets find a loving home.</p>

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
      </div>
    </section>
  );
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
      nextErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!isEmailValid(formData.email)) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm password';
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
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
      setFormError('Could not create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page" aria-labelledby="register-title">
      <div className="app-container">
        <div className="auth-page__card">
          <p className="auth-page__badge">Create account</p>
          <h1 id="register-title" className="auth-page__title">
            Join Dnipro Animals
          </h1>
          <p className="auth-page__subtitle">Create your profile and start the adoption journey.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {formError ? <p className="auth-form__alert">{formError}</p> : null}

            <label className="auth-form__field">
              <span>Full name</span>
              <Input
                className="auth-input"
                type="text"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(event) => setFormData((prev) => ({ ...prev, fullName: event.target.value }))}
                error={errors.fullName}
              />
            </label>

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
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
                error={errors.password}
              />
            </label>

            <label className="auth-form__field">
              <span>Confirm password</span>
              <Input
                className="auth-input"
                type="password"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                error={errors.confirmPassword}
              />
            </label>

            <Button className="auth-form__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="auth-page__switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
