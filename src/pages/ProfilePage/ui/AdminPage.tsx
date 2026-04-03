import { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Textarea } from '../../../shared/ui/Textarea';
import { Modal } from '../../../shared/ui/Modal';
import { Badge } from '../../../shared/ui/Badge';
import { mockAnimals } from '../../../shared/entities/animal/mockAnimals';
import { Animal, AnimalType, AnimalAge, AnimalStatus } from '../../../shared/entities/animal/animal';
import { ImageWithFallback } from '../../../shared/ui/ImageWithFallback';

export default function AdminPage() {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<Partial<Animal>>({
    name: '',
    type: 'dog',
    age: 'young',
    gender: 'male',
    description: '',
    image: '',
    status: 'available',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'dog',
      age: 'young',
      gender: 'male',
      description: '',
      image: '',
      status: 'available',
    });
    setEditingAnimal(null);
  };

  const handleOpenModal = (animal?: Animal) => {
    if (animal) {
      setEditingAnimal(animal);
      setFormData(animal);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => resetForm(), 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAnimal) {
      setAnimals(
        animals.map((a) =>
          a.id === editingAnimal.id ? { ...formData, id: a.id } as Animal : a
        )
      );
    } else {
      const newAnimal: Animal = {
        ...formData,
        id: Date.now().toString(),
      } as Animal;
      setAnimals([...animals, newAnimal]);
    }

    handleCloseModal();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this animal?')) {
      setAnimals(animals.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[#111827] mb-2">Animal Management</h1>
            <p className="text-[#6B7280]">Manage shelter animals and their adoption status</p>
          </div>
          <Button
            variant="primary"
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Animal
          </Button>
        </div>

        {showSuccess && (
          <div className="mb-6 bg-[#D1FAE5] border-2 border-[#10B981] text-[#065F46] p-4 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span>Changes saved successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border-2 border-[#E5E7EB] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b-2 border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-4 text-left text-[#111827]">Image</th>
                  <th className="px-6 py-4 text-left text-[#111827]">Name</th>
                  <th className="px-6 py-4 text-left text-[#111827]">Type</th>
                  <th className="px-6 py-4 text-left text-[#111827]">Age</th>
                  <th className="px-6 py-4 text-left text-[#111827]">Status</th>
                  <th className="px-6 py-4 text-left text-[#111827]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {animals.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-[#6B7280]">
                      No animals yet. Add your first animal to get started.
                    </td>
                  </tr>
                ) : (
                  animals.map((animal) => (
                    <tr key={animal.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <ImageWithFallback
                          src={animal.image}
                          alt={animal.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 text-[#111827]">{animal.name}</td>
                      <td className="px-6 py-4 text-[#6B7280] capitalize">{animal.type}</td>
                      <td className="px-6 py-4 text-[#6B7280] capitalize">{animal.age}</td>
                      <td className="px-6 py-4">
                        <Badge variant={animal.status === 'available' ? 'available' : animal.status === 'in-process' ? 'in-process' : 'adopted'}>
                          {animal.status === 'available' ? 'Available' : animal.status === 'in-process' ? 'In process' : 'Adopted'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(animal)}
                            className="p-2 rounded-xl hover:bg-[#E5E7EB] transition-colors"
                          >
                            <Pencil className="w-5 h-5 text-[#6B7280]" />
                          </button>
                          <button
                            onClick={() => handleDelete(animal.id)}
                            className="p-2 rounded-xl hover:bg-[#FEE2E2] transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-[#EF4444]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAnimal ? 'Edit Animal' : 'Add New Animal'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#111827] mb-2">Name</label>
            <Input
              type="text"
              placeholder="Animal name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#111827] mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as AnimalType })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] hover:border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>

            <div>
              <label className="block text-[#111827] mb-2">Age</label>
              <select
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value as AnimalAge })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] hover:border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="young">Young</option>
                <option value="adult">Adult</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#111827] mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] hover:border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-[#111827] mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as AnimalStatus })}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] hover:border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all duration-200"
                required
              >
                <option value="available">Available</option>
                <option value="in-process">In process</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#111827] mb-2">Image URL</label>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-[#111827] mb-2">Description</label>
            <Textarea
              placeholder="Describe the animal's personality and characteristics..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full">
            {editingAnimal ? 'Save Changes' : 'Add Animal'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
