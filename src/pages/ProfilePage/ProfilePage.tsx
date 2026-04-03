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
        <h1 className="section-title">Профіль недоступний</h1>
        <p className="section-subtitle">Будь ласка, увійдіть, щоб переглядати та редагувати збережені контактні дані.</p>
        <Button onClick={() => navigate('/')}>Назад на головну</Button>
      </main>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!values.name.trim()) {
      nextErrors.name = "Потрібно вказати ім'я";
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Потрібно вказати електронну пошту';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Вкажіть коректну електронну пошту';
    }

    if (!values.phone.trim()) {
      nextErrors.phone = 'Потрібно вказати телефон';
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
            <h1 className="section-title">Ваш профіль</h1>
            <p className="section-subtitle">Тримайте контактні дані для усиновлення актуальними.</p>
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
