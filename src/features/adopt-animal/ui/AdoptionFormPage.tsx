import { useParams, useNavigate, Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button/Button';
import { Input } from '../../../components/Input/Input';
import { Textarea } from '../../../components/Textarea/Textarea';
import { RegisterModal } from '../../../components/RegisterModal/RegisterModal';
import { mockAnimals } from '../../../shared/data/mockAnimals';
import { useAuth } from '../../auth/AuthContext';

export default function AdoptionFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, register } = useAuth();
  const animal = mockAnimals.find((a) => a.id === id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));
    }
  }, [isAuthenticated, user]);

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

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    register({ name, email, phone: formData.phone }, password);
    navigate('/');
  };

  const handleSkipRegister = () => {
    navigate('/');
  };

  if (!animal) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">Animal not found</p>
          <Link to="/">
            <Button variant="primary">Back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-6 border-2 border-[#E5E7EB]">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="w-16 h-16 text-[#10B981]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[#111827]">Request Sent!</h2>
              <p className="text-[#6B7280]">
                Thank you for your interest in adopting {animal.name}. We'll
                contact you soon to discuss the next steps.
              </p>
            </div>

            {!isAuthenticated && (
              <div className="bg-[#F9FAFB] rounded-xl p-6 space-y-4 border border-[#E5E7EB]">
                <div className="space-y-1">
                  <h3 className="text-[#111827] font-semibold">Save your details for next time</h3>
                  <p className="text-[#6B7280] text-sm">
                    Create an account to pre-fill forms and track your adoption requests
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleSkipRegister}
                    className="flex-1"
                  >
                    Skip
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setShowRegisterModal(true)}
                    className="flex-1"
                  >
                    Create account
                  </Button>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to home
              </Button>
            )}
          </div>
        </div>

        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onRegister={handleRegister}
          defaultValues={{
            name: formData.name,
            email: formData.email,
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to={`/animal/${id}`} className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#22C55E] transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to {animal.name}
        </Link>

        <div className="bg-white rounded-2xl p-8 border-2 border-[#E5E7EB]">
          <div className="mb-8">
            <h1 className="text-[#111827] mb-2">Adoption Form</h1>
            <p className="text-[#6B7280]">
              Fill out this form to start the adoption process for {animal.name}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#111827] mb-2">Your Name</label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-[#111827] mb-2">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                error={errors.email}
              />
            </div>

            <div>
              <label className="block text-[#111827] mb-2">Phone</label>
              <Input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                error={errors.phone}
              />
            </div>

            <div>
              <label className="block text-[#111827] mb-2">
                Tell us about yourself
              </label>
              <Textarea
                placeholder="Why do you want to adopt this pet? Tell us about your home and lifestyle..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                error={errors.message}
              />
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Submit application
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
