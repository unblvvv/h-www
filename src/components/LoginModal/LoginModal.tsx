import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Modal } from '../Modal/Modal';
import './LoginModal.scss';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onLogin(formData.email, formData.password);
      onClose();
      setFormData({ email: '', password: '' });
      setErrors({});
    } catch {
      setLoginError('Wrong email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log in to your account"
      panelClassName="auth-modal__panel"
      bodyClassName="auth-modal__body"
    >
      <form className="auth-form login-modal" onSubmit={handleSubmit}>
        {loginError ? <p className="auth-form__alert">{loginError}</p> : null}

        <label className="auth-form__field login-modal__field">
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

        <label className="auth-form__field login-modal__field">
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

        <div className="auth-form__actions login-modal__actions">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button className="auth-form__submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>
        </div>

        <p className="auth-form__switch">
          Don’t have an account?{' '}
          <Link to="/register" onClick={onClose}>
            Sign up
          </Link>
        </p>
      </form>
    </Modal>
  );
}
