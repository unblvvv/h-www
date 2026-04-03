import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';

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

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (validate()) {
      try {
        await onLogin(formData.email, formData.password);
        onClose();
      } catch (error) {
        setLoginError('Invalid email or password');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full relative border-2 border-[#E5E7EB]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-[#111827] mb-2">Welcome back</h2>
          <p className="text-[#6B7280]">Log in to your account</p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 bg-red-50 border border-[#EF4444] rounded-xl">
            <p className="text-[#EF4444] text-sm">{loginError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#111827] mb-2">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
          </div>

          <div>
            <label className="block text-[#111827] mb-2">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Log in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
