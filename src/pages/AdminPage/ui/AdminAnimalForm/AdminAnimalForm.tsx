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
    { value: 'dog', label: 'Dog' },
    { value: 'cat', label: 'Cat' },
  ];

  const ageOptions = [
    { value: 'young', label: 'Young' },
    { value: 'adult', label: 'Adult' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in-process', label: 'In process' },
    { value: 'adopted', label: 'Adopted' },
  ];

  return (
    <form className="admin-animal-form" onSubmit={onSubmit}>
      <label>
        <span>Name</span>
        <Input value={values.name || ''} onChange={(event) => onChange({ name: event.target.value })} required />
      </label>

      <div className="admin-animal-form__row">
        <label>
          <span>Type</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.type || 'dog'}
            options={typeOptions}
            ariaLabel="Animal type"
            onValueChange={(value) => onChange({ type: value as AnimalType })}
          />
        </label>

        <label>
          <span>Age</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.age || 'young'}
            options={ageOptions}
            ariaLabel="Animal age"
            onValueChange={(value) => onChange({ age: value as AnimalAge })}
          />
        </label>
      </div>

      <div className="admin-animal-form__row">
        <label>
          <span>Gender</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.gender || 'male'}
            options={genderOptions}
            ariaLabel="Animal gender"
            onValueChange={(value) => onChange({ gender: value as 'male' | 'female' })}
          />
        </label>

        <label>
          <span>Status</span>
          <AppSelect
            className="admin-animal-form__select"
            value={values.status || 'available'}
            options={statusOptions}
            ariaLabel="Animal status"
            onValueChange={(value) => onChange({ status: value as AnimalStatus })}
          />
        </label>
      </div>

      <label>
        <span>Photo</span>
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => onChange({ image: event.target.files?.[0] })}
          required
        />
      </label>

      <label>
        <span>Description</span>
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
