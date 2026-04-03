import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string, email: string, phone: string, password: string) => void;
  defaultValues?: {
    name: string;
    email: string;
    phone: string;
  };
}

export function RegisterModal({ isOpen, onClose, onRegister, defaultValues }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: defaultValues?.name || '',
    email: defaultValues?.email || '',
    phone: defaultValues?.phone || '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onRegister(formData.name, formData.email, formData.phone, formData.password);
      onClose();
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
          <h2 className="text-[#111827] mb-2">Create your account</h2>
          <p className="text-[#6B7280]">Save your details for faster adoptions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#111827] mb-2">Name</label>
            <Input
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
            />
          </div>

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
            <label className="block text-[#111827] mb-2">Phone</label>
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              error={errors.phone}
            />
          </div>

          <div>
            <label className="block text-[#111827] mb-2">Password</label>
            <Input
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />
          </div>

          <div>
            <label className="block text-[#111827] mb-2">Confirm Password</label>
            <Input
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Skip
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
