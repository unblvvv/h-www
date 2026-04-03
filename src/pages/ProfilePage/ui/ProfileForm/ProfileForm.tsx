import { Input } from '../../../../components/Input/Input';
import { Button } from '../../../../components/Button/Button';
import './ProfileForm.scss';

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
}

interface ProfileFormProps {
  values: ProfileFormValues;
  errors: Record<string, string>;
  isEditing: boolean;
  onChange: (name: keyof ProfileFormValues, value: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onLogout: () => void;
}

export function ProfileForm({
  values,
  errors,
  isEditing,
  onChange,
  onEdit,
  onCancel,
  onSave,
  onLogout,
}: ProfileFormProps) {
  return (
    <section className="profile-form" aria-label="Форма даних профілю">
      <label>
        <span>Ім'я</span>
        {isEditing ? (
          <Input value={values.name} onChange={(event) => onChange('name', event.target.value)} error={errors.name} />
        ) : (
          <p>{values.name || '-'}</p>
        )}
      </label>

      <label>
        <span>Електронна пошта</span>
        {isEditing ? (
          <Input value={values.email} onChange={(event) => onChange('email', event.target.value)} error={errors.email} />
        ) : (
          <p>{values.email || '-'}</p>
        )}
      </label>

      <label>
        <span>Телефон</span>
        {isEditing ? (
          <Input value={values.phone} onChange={(event) => onChange('phone', event.target.value)} error={errors.phone} />
        ) : (
          <p>{values.phone || '-'}</p>
        )}
      </label>

      <div className="profile-form__actions">
        {isEditing ? (
          <>
            <Button variant="secondary" onClick={onCancel}>
              Скасувати
            </Button>
            <Button onClick={onSave}>Зберегти профіль</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onLogout}>
              Вийти
            </Button>
            <Button onClick={onEdit}>Редагувати профіль</Button>
          </>
        )}
      </div>
    </section>
  );
}
