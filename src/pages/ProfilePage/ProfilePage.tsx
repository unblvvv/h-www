import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/Button/Button';
import { ProfileForm } from './ui/ProfileForm/ProfileForm';
import { useAuth } from '../../features/auth/AuthContext';
import './ProfilePage.scss';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isAuthenticated } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthenticated || !user) {
    return (
      <main className="page profile-page profile-page--empty">
        <h1 className="section-title">Profile is unavailable</h1>
        <p className="section-subtitle">Please log in to view and edit saved contact details.</p>
        <Button onClick={() => navigate('/')}>Back to home</Button>
      </main>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!values.name.trim()) {
      nextErrors.name = 'Name is required';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!values.phone.trim()) {
      nextErrors.phone = 'Phone is required';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    updateProfile(values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValues({ name: user.name, email: user.email, phone: user.phone || '' });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="page profile-page">
      <div className="app-container profile-page__layout">
        <header className="profile-page__head">
          <UserCircle2 size={32} />
          <div>
            <h1 className="section-title">Your profile</h1>
            <p className="section-subtitle">Keep your adoption contact details up to date.</p>
          </div>
        </header>

        <ProfileForm
          values={values}
          errors={errors}
          isEditing={isEditing}
          onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
          onEdit={() => setIsEditing(true)}
          onCancel={handleCancel}
          onSave={handleSave}
          onLogout={handleLogout}
        />
      </div>
    </main>
  );
}
