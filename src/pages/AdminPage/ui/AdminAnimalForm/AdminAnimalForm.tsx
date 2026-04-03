import { Animal, AnimalAge, AnimalStatus, AnimalType } from '../../../../shared/types/animal';
import { Input } from '../../../../components/Input/Input';
import { Textarea } from '../../../../components/Textarea/Textarea';
import { Button } from '../../../../components/Button/Button';
import './AdminAnimalForm.scss';

interface AdminAnimalFormProps {
  values: Partial<Animal>;
  submitLabel: string;
  onChange: (patch: Partial<Animal>) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export function AdminAnimalForm({ values, submitLabel, onChange, onSubmit }: AdminAnimalFormProps) {
  return (
    <form className="admin-animal-form" onSubmit={onSubmit}>
      <label>
        <span>Name</span>
        <Input value={values.name || ''} onChange={(event) => onChange({ name: event.target.value })} required />
      </label>

      <div className="admin-animal-form__row">
        <label>
          <span>Type</span>
          <select
            value={values.type || 'dog'}
            onChange={(event) => onChange({ type: event.target.value as AnimalType })}
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </label>

        <label>
          <span>Age</span>
          <select
            value={values.age || 'young'}
            onChange={(event) => onChange({ age: event.target.value as AnimalAge })}
          >
            <option value="young">Young</option>
            <option value="adult">Adult</option>
          </select>
        </label>
      </div>

      <div className="admin-animal-form__row">
        <label>
          <span>Gender</span>
          <select
            value={values.gender || 'male'}
            onChange={(event) => onChange({ gender: event.target.value as 'male' | 'female' })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          <span>Status</span>
          <select
            value={values.status || 'available'}
            onChange={(event) => onChange({ status: event.target.value as AnimalStatus })}
          >
            <option value="available">Available</option>
            <option value="in-process">In process</option>
            <option value="adopted">Adopted</option>
          </select>
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
