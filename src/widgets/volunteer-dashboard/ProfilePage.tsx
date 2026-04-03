import { useState } from 'react';
import { useNavigate } from 'react-router';
import { User, ArrowLeft } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { useAuth } from '../../features/volunteer-auth/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">Please log in to view your profile</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Back to home
          </Button>
        </div>
      </div>
    );
  }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      updateProfile(formData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#22C55E] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to home
        </button>

        <div className="bg-white rounded-2xl p-8 border-2 border-[#E5E7EB]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#22C55E]" />
            </div>
            <div>
              <h1 className="text-[#111827]">Your Profile</h1>
              <p className="text-[#6B7280]">Manage your account details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-[#111827] mb-2">Name</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                />
              ) : (
                <p className="text-[#6B7280] bg-[#F9FAFB] px-4 py-3 rounded-xl border border-[#E5E7EB]">
                  {user.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#111827] mb-2">Email</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                />
              ) : (
                <p className="text-[#6B7280] bg-[#F9FAFB] px-4 py-3 rounded-xl border border-[#E5E7EB]">
                  {user.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[#111827] mb-2">Phone</label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={errors.phone}
                />
              ) : (
                <p className="text-[#6B7280] bg-[#F9FAFB] px-4 py-3 rounded-xl border border-[#E5E7EB]">
                  {user.phone}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-[#E5E7EB]">
              {isEditing ? (
                <>
                  <Button variant="secondary" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} className="flex-1">
                    Save changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" onClick={handleLogout} className="flex-1">
                    Log out
                  </Button>
                  <Button variant="primary" onClick={() => setIsEditing(true)} className="flex-1">
                    Edit profile
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
