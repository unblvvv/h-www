import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Modal } from '../../../../components/Modal';
import './LoginModal.scss';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

const schema = z.object({
  email: z.string().email('Невірний email'),
  password: z.string().min(1, 'Пароль обовʼязковий'),
});

type FormData = z.infer<typeof schema>;

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [loginError, setLoginError] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setLoginError('');
    reset({ email: '', password: '' });
  }, [isOpen, reset]);

  const onSubmit = async (data: FormData) => {
    setLoginError('');
    try {
      await onLogin(data.email, data.password);
      onClose();
    } catch {
      setLoginError('Wrong email or password. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log in to your account">
      <form className="login-modal" onSubmit={handleSubmit(onSubmit)}>
        {loginError ? <p className="login-modal__alert">{loginError}</p> : null}

        <label className="login-modal__field">
          <span>Email</span>
          <Input
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </label>

        <label className="login-modal__field">
          <span>Password</span>
          <Input
            type="password"
            placeholder="Enter password"
            {...register('password')}
            error={errors.password?.message}
          />
        </label>

        <div className="login-modal__actions">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
