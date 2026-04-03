import { useState } from 'react';
import { CheckCircle2, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminAnimalForm } from '../../components/AdminAnimalForm/AdminAnimalForm';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { Animal } from '../../shared/types/animal';
import './AdminPage.scss';

export default function AdminPage() {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [formValues, setFormValues] = useState<Partial<Animal>>({
    name: '',
    type: 'dog',
    age: 'young',
    gender: 'male',
    description: '',
    image: '',
    status: 'available',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOpenCreate = () => {
    setEditingAnimal(null);
    setFormValues({
      name: '',
      type: 'dog',
      age: 'young',
      gender: 'male',
      description: '',
      image: '',
      status: 'available',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setFormValues(animal);
    setIsModalOpen(true);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingAnimal) {
      setAnimals((prev) => prev.map((animal) => (animal.id === editingAnimal.id ? ({ ...editingAnimal, ...formValues } as Animal) : animal)));
    } else {
      setAnimals((prev) => [...prev, { ...(formValues as Animal), id: Date.now().toString() }]);
    }

    setIsModalOpen(false);
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 1800);
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Delete this animal profile?');
    if (!confirmed) {
      return;
    }
    setAnimals((prev) => prev.filter((animal) => animal.id !== id));
  };

  return (
    <main className="page admin-page">
      <div className="app-container">
        <header className="admin-page__head">
          <div>
            <h1 className="section-title">Admin: manage animals</h1>
            <p className="section-subtitle">Create, edit, and remove animal cards visible in the adoption catalog.</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus size={16} />
            Add animal
          </Button>
        </header>

        {showSuccess ? (
          <p className="admin-page__success" role="status">
            <CheckCircle2 size={16} /> Saved successfully
          </p>
        ) : null}

        <section className="admin-page__table-wrap" aria-label="Admin animal list">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Age</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.id}>
                  <td>
                    <ImageWithFallback
                      src={animal.image}
                      alt={`${animal.name} profile image in admin list`}
                      className="admin-page__thumb"
                    />
                  </td>
                  <td>{animal.name}</td>
                  <td>{animal.type}</td>
                  <td>{animal.age}</td>
                  <td>
                    <Badge variant={animal.status} />
                  </td>
                  <td>
                    <div className="admin-page__actions">
                      <button aria-label={`Edit ${animal.name}`} onClick={() => handleOpenEdit(animal)}>
                        <Pencil size={16} />
                      </button>
                      <button aria-label={`Delete ${animal.name}`} onClick={() => handleDelete(animal.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAnimal ? 'Edit animal profile' : 'Add animal profile'}
      >
        <AdminAnimalForm
          values={formValues}
          submitLabel={editingAnimal ? 'Save changes' : 'Create animal'}
          onChange={(patch) => setFormValues((prev) => ({ ...prev, ...patch }))}
          onSubmit={handleSave}
        />
      </Modal>
    </main>
  );
}
