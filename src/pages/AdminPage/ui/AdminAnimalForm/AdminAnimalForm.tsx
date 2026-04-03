import { Animal, AnimalAge, AnimalStatus } from '../../../../shared/types/animal';
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
  const selectedFiles = Array.isArray(values.image) && values.image.every((item) => item instanceof File)
    ? values.image
    : values.image instanceof File
      ? [values.image]
      : [];
  const existingImageCount = Array.isArray(values.image) && values.image.every((item) => typeof item === 'string')
    ? values.image.filter((item) => item.trim()).length
    : typeof values.image === 'string' && values.image
      ? values.image.split(',').filter(Boolean).length
      : 0;
  const hasImage = selectedFiles.length > 0 || existingImageCount > 0;
  const ageOptions = [
    { value: 'young', label: 'Молодий' },
    { value: 'adult', label: 'Дорослий' },
  ];

  const sexOptions = [
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
            value={values.sex || 'male'}
            options={sexOptions}
            ariaLabel="Стать тварини"
            onValueChange={(value) => onChange({ sex: value as 'male' | 'female' })}
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
          multiple
          onChange={(event) => onChange({ image: Array.from(event.target.files ?? []) })}
          required={!hasImage}
        />
        <span className="admin-animal-form__file-meta">
          {selectedFiles.length > 0
            ? `Обрано файлів: ${selectedFiles.length}`
            : existingImageCount > 0
              ? `Поточних фото: ${existingImageCount}`
              : 'Додайте щонайменше одне фото'}
        </span>
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
