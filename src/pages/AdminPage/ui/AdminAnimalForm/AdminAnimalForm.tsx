import { Animal, AnimalAge, AnimalStatus, AnimalType } from '../../../../shared/types/animal';
import { Input } from '../../../../components/Input/Input';
import { Textarea } from '../../../../components/Textarea/Textarea';
import { Button } from '../../../../components/Button/Button';
import { AppSelect } from '../../../../components/AppSelect/AppSelect';
import './AdminAnimalForm.scss';

interface AdminAnimalFormProps {
  values: Partial<Animal>;
  submitLabel: string;
  onChange: (patch: Partial<Animal>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function AdminAnimalForm({ values, submitLabel, onChange, onSubmit }: AdminAnimalFormProps) {
  const typeOptions = [
    { value: 'dog', label: 'Собака' },
    { value: 'cat', label: 'Кіт' },
  ];

  const ageOptions = [
    { value: 'young', label: 'Молодий' },
    { value: 'adult', label: 'Дорослий' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Самець' },
    { value: 'female', label: 'Самка' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Доступний' },
    { value: 'in-process', label: 'В процесі' },
    { value: 'adopted', label: 'Усиновлено' },
  ];

  return (
    <form className="admin-animal-form" onSubmit={onSubmit}>
      <label>
        <span>Ім'я</span>
        <Input value={values.name || ''} onChange={(event) => onChange({ name: event.target.value })} required />
      </label>

      <div className="admin-animal-form__row">
        <label>
          <span>Тип</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.type || 'dog'}
            options={typeOptions}
            ariaLabel="Тип тварини"
            onValueChange={(value) => onChange({ type: value as AnimalType })}
          />
        </label>

        <label>
          <span>Вік</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.age || 'young'}
            options={ageOptions}
            ariaLabel="Вік тварини"
            onValueChange={(value) => onChange({ age: value as AnimalAge })}
          />
        </label>
      </div>

      <div className="admin-animal-form__row">
        <label>
          <span>Стать</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.gender || 'male'}
            options={genderOptions}
            ariaLabel="Стать тварини"
            onValueChange={(value) => onChange({ gender: value as 'male' | 'female' })}
          />
        </label>

        <label>
          <span>Статус</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.status || 'available'}
            options={statusOptions}
            ariaLabel="Статус тварини"
            onValueChange={(value) => onChange({ status: value as AnimalStatus })}
          />
        </label>
      </div>

      <label>
        <span>Фото</span>
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => onChange({ image: event.target.files?.[0] })}
          required
        />
      </label>

      <label>
        <span>Опис</span>
        <Textarea
          value={values.description || ''}
          onChange={(event) => onChange({ description: event.target.value })}
          required
        />
      </label>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}
