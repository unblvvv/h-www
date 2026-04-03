import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../../../../components/Button/Button';
import { Input } from '../../../../components/Input/Input';
import { Modal } from '../../../../components/Modal/Modal';
import './RegisterModal.scss';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string, email: string, password: string) => Promise<void> | void;
  defaultValues?: {
    name: string;
    email: string;
  };
}

export function RegisterModal({ isOpen, onClose, onRegister, defaultValues }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: defaultValues?.name || '',
    email: defaultValues?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: defaultValues?.name || prev.name,
      email: defaultValues?.email || prev.email,
      password: '',
      confirmPassword: '',
    }));
  }, [isOpen, defaultValues?.name, defaultValues?.email]);

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

    if (!formData.password) {
      nextErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    await onRegister(formData.name, formData.email, formData.password);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create account"
      panelClassName="auth-modal__panel"
      bodyClassName="auth-modal__body"
    >
      <form className="auth-form register-modal" onSubmit={handleSubmit}>
        <label className="auth-form__field register-modal__field">
          <span>Full name</span>
          <Input
            className="auth-input"
            type="text"
            value={formData.name}
            placeholder="Your name"
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            error={errors.name}
          />
        </label>

        <label className="auth-form__field register-modal__field">
          <span>Email</span>
          <Input
            className="auth-input"
            type="email"
            value={formData.email}
            placeholder="you@example.com"
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            error={errors.email}
          />
        </label>

        <label className="auth-form__field register-modal__field">
          <span>Password</span>
          <Input
            className="auth-input"
            type="password"
            value={formData.password}
            autoComplete="new-password" 
            placeholder="At least 6 characters"
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
            error={errors.password}
          />
        </label>

        <label className="auth-form__field register-modal__field">
          <span>Confirm password</span>
          <Input
            className="auth-input"
            type="password"
            value={formData.confirmPassword}
            autoComplete="new-password" 
            placeholder="Repeat password"
            onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            error={errors.confirmPassword}
          />
        </label>

        <div className="auth-form__actions register-modal__actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button className="auth-form__submit" type="submit">Create account</Button>
        </div>

        <p className="auth-form__switch">
          Already have an account?{' '}
          <Link to="/login" onClick={onClose}>
            Log in
          </Link>
        </p>
      </form>
    </Modal>
  );
}
