import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../../components/Button/Button';
import { Input } from '../../../../components/Input/Input';
import { Modal } from '../../../../components/Modal/Modal';
import { useRegister } from '../../model/useRegister';
import './RegisterModal.scss';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: {
    name: string;
    email: string;
  };
}

const schema = z
  .object({
    username: z.string().min(2, 'Мінімум 2 символи'),
    email: z.string().email('Невірний email'),
    password: z.string().min(6, 'Мінімум 6 символів'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    path: ['confirmPassword'],
    message: 'Паролі не співпадають',
  });

type FormData = z.infer<typeof schema>;

export function RegisterModal({ isOpen, onClose, defaultValues }: RegisterModalProps) {
  const { register: submitRegister, isLoading, error } = useRegister();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: defaultValues?.name || '',
      email: defaultValues?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    reset({
      username: defaultValues?.name || '',
      email: defaultValues?.email || '',
      password: '',
      confirmPassword: '',
    });
  }, [isOpen, defaultValues?.name, defaultValues?.email, reset]);

  const onSubmit = async (data: FormData) => {
    await submitRegister({
      username: data.username,
      email: data.email,
      password: data.password,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create account">
      <form className="register-modal" onSubmit={handleSubmit(onSubmit)}>
        <label className="register-modal__field">
          <span>Name</span>
          <Input
            type="text"
            {...register('username')}
            placeholder="Your name"
            error={errors.username?.message}
          />
        </label>

        <label className="register-modal__field">
          <span>Email</span>
          <Input
            type="email"
            {...register('email')}
            placeholder="you@example.com"
            error={errors.email?.message}
          />
        </label>

        <label className="register-modal__field">
          <span>Password</span>
          <Input
            type="password"
            {...register('password')}
            placeholder="At least 6 characters"
            error={errors.password?.message}
          />
        </label>

        <label className="register-modal__field">
          <span>Confirm password</span>
          <Input
            type="password"
            {...register('confirmPassword')}
            placeholder="Repeat password"
            error={errors.confirmPassword?.message}
          />
        </label>

        {error ? <p className="register-modal__error">{error}</p> : null}

        <div className="register-modal__actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Завантаження...' : 'Create account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
