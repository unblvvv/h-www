import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, LayoutGrid, List, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { AdminAnimalForm } from './ui/AdminAnimalForm/AdminAnimalForm';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { AppSelect } from '../../components/AppSelect/AppSelect';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { Animal } from '../../shared/types/animal';
import './AdminPage.scss';

const statusLabel: Record<Animal['status'], string> = {
  available: 'Available',
  'in-process': 'In process',
  adopted: 'Adopted',
};

const typeLabel: Record<Animal['type'], string> = {
  dog: 'Dog',
  cat: 'Cat',
};

const ageLabel: Record<Animal['age'], string> = {
  young: 'Young',
  adult: 'Adult',
};

const typeFilterOptions = [
  { value: 'all', label: 'All types' },
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
];

const statusFilterOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'available', label: 'Available' },
  { value: 'in-process', label: 'In process' },
  { value: 'adopted', label: 'Adopted' },
];

const ageFilterOptions = [
  { value: 'all', label: 'All ages' },
  { value: 'young', label: 'Young' },
  { value: 'adult', label: 'Adult' },
];

const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'in-process', label: 'In process' },
  { value: 'adopted', label: 'Adopted' },
];

type ViewMode = 'grid' | 'list';

export default function AdminPage() {
  const [animals, setAnimals] = useState<Animal[]>(mockAnimals);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [previewAnimal, setPreviewAnimal] = useState<Animal | null>(null);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Animal['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Animal['status']>('all');
  const [ageFilter, setAgeFilter] = useState<'all' | Animal['age']>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(true);
    const timeout = window.setTimeout(() => setIsFiltering(false), 220);
    return () => window.clearTimeout(timeout);
  }, [searchQuery, typeFilter, statusFilter, ageFilter, viewMode]);

  const summary = useMemo(() => {
    return {
      total: animals.length,
      available: animals.filter((animal) => animal.status === 'available').length,
      inProcess: animals.filter((animal) => animal.status === 'in-process').length,
      adopted: animals.filter((animal) => animal.status === 'adopted').length,
    };
  }, [animals]);

  const filteredAnimals = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return animals.filter((animal) => {
      const matchesSearch =
        !normalizedQuery ||
        animal.name.toLowerCase().includes(normalizedQuery) ||
        animal.description.toLowerCase().includes(normalizedQuery);
      const matchesType = typeFilter === 'all' || animal.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || animal.status === statusFilter;
      const matchesAge = ageFilter === 'all' || animal.age === ageFilter;

      return matchesSearch && matchesType && matchesStatus && matchesAge;
    });
  }, [animals, ageFilter, searchQuery, statusFilter, typeFilter]);

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
    setPreviewAnimal(null);
    setEditingAnimal(animal);
    setFormValues(animal);
    setIsModalOpen(true);
  };

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    if (editingAnimal) {
      setAnimals((prev) =>
        prev.map((animal) =>
          animal.id === editingAnimal.id ? ({ ...editingAnimal, ...formValues } as Animal) : animal,
        ),
      );
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
    setPreviewAnimal((prev) => (prev?.id === id ? null : prev));
  };

  const handleStatusChange = (id: string, status: Animal['status']) => {
    setAnimals((prev) => prev.map((animal) => (animal.id === id ? { ...animal, status } : animal)));
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLElement>, animal: Animal) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setPreviewAnimal(animal);
    }
  };

  return (
    <main className="page admin-page">
      <div className="app-container">
        <section className="admin-page__panel">
          <header className="admin-page__head" data-header-anchor>
            <div className="admin-page__heading">
              <p className="admin-page__badge">Control center</p>
              <h1 className="section-title">Animal management</h1>
              <p className="section-subtitle">
                Manage profiles, statuses, and visibility of pets in your adoption catalog.
              </p>
            </div>
            <Button onClick={handleOpenCreate} className="admin-page__add-button">
              <Plus size={18} />
              Add animal
            </Button>
          </header>

          {showSuccess ? (
            <p className="admin-page__success" role="status">
              <CheckCircle2 size={16} /> Saved successfully
            </p>
          ) : null}

          <section className="admin-page__summary" aria-label="Animals summary">
            <article className="admin-page__summary-card admin-page__summary-card--total">
              <p>Total animals</p>
              <strong>{summary.total}</strong>
            </article>
            <article className="admin-page__summary-card admin-page__summary-card--available">
              <p>Available</p>
              <strong>{summary.available}</strong>
            </article>
            <article className="admin-page__summary-card admin-page__summary-card--in-process">
              <p>In process</p>
              <strong>{summary.inProcess}</strong>
            </article>
            <article className="admin-page__summary-card admin-page__summary-card--adopted">
              <p>Adopted</p>
              <strong>{summary.adopted}</strong>
            </article>
          </section>

          <section className="admin-page__filters" aria-label="Filter animals">
            <div className="admin-page__search">
              <Search size={18} />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or description"
                aria-label="Search animals"
              />
            </div>

            <div className="admin-page__filters-row">
              <label className="admin-page__filter">
                <span>
                  <SlidersHorizontal size={14} /> Type
                </span>
                <AppSelect
                  className="admin-page__filter-select"
                  value={typeFilter}
                  options={typeFilterOptions}
                  ariaLabel="Filter by type"
                  onValueChange={(value) => setTypeFilter(value as 'all' | Animal['type'])}
                />
              </label>

              <label className="admin-page__filter">
                <span>Status</span>
                <AppSelect
                  className="admin-page__filter-select"
                  value={statusFilter}
                  options={statusFilterOptions}
                  ariaLabel="Filter by status"
                  onValueChange={(value) => setStatusFilter(value as 'all' | Animal['status'])}
                />
              </label>

              <label className="admin-page__filter">
                <span>Age</span>
                <AppSelect
                  className="admin-page__filter-select"
                  value={ageFilter}
                  options={ageFilterOptions}
                  ariaLabel="Filter by age"
                  onValueChange={(value) => setAgeFilter(value as 'all' | Animal['age'])}
                />
              </label>

              <div className="admin-page__view-toggle" role="group" aria-label="View mode">
                <button
                  type="button"
                  className={viewMode === 'grid' ? 'is-active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={15} />
                  Grid
                </button>
                <button
                  type="button"
                  className={viewMode === 'list' ? 'is-active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List size={15} />
                  List
                </button>
              </div>
            </div>
          </section>

          <section className="admin-page__catalog" aria-label="Admin animal list">
            {isFiltering ? (
              <div className={viewMode === 'grid' ? 'admin-page__grid' : 'admin-page__list'}>
                {Array.from({ length: viewMode === 'grid' ? 6 : 4 }).map((_, index) => (
                  <article
                    key={`skeleton-${index}`}
                    className={
                      viewMode === 'grid'
                        ? 'admin-page__card admin-page__card--skeleton'
                        : 'admin-page__list-item admin-page__list-item--skeleton'
                    }
                    aria-hidden="true"
                  >
                    <div className="admin-page__skeleton-block" />
                  </article>
                ))}
              </div>
            ) : null}

            {!isFiltering && filteredAnimals.length === 0 ? (
              <div className="admin-page__empty">
                <h2>No animals found</h2>
                <p>Try changing filters or clear the search query to see all profiles.</p>
              </div>
            ) : null}

            {!isFiltering && filteredAnimals.length > 0 && viewMode === 'grid' ? (
              <div className="admin-page__grid">
                {filteredAnimals.map((animal) => (
                  <article
                    key={animal.id}
                    className="admin-page__card"
                    role="button"
                    tabIndex={0}
                    onClick={() => setPreviewAnimal(animal)}
                    onKeyDown={(event) => handleCardKeyDown(event, animal)}
                  >
                    <div className="admin-page__media">
                      <ImageWithFallback
                        src={animal.image}
                        alt={`${animal.name} profile image in admin card`}
                        className="admin-page__cover"
                      />
                      <div className="admin-page__card-actions">
                        <button
                          aria-label={`Preview ${animal.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setPreviewAnimal(animal);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          aria-label={`Edit ${animal.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenEdit(animal);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          aria-label={`Delete ${animal.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(animal.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="admin-page__card-body">
                      <div className="admin-page__card-top">
                        <h2>{animal.name}</h2>
                        <Badge variant={animal.status}>{statusLabel[animal.status]}</Badge>
                      </div>
                      <p className="admin-page__meta">
                        {typeLabel[animal.type]} / {ageLabel[animal.age]}
                      </p>
                      <p className="admin-page__description">{animal.description}</p>
                      <label className="admin-page__status-control">
                        <span>Change status</span>
                        <div
                          className="admin-page__status-select-wrap"
                          onClick={(event) => event.stopPropagation()}
                          onPointerDown={(event) => event.stopPropagation()}
                        >
                          <AppSelect
                            className="admin-page__status-select"
                            value={animal.status}
                            options={statusOptions}
                            ariaLabel={`Change status for ${animal.name}`}
                            onValueChange={(value) => handleStatusChange(animal.id, value as Animal['status'])}
                          />
                        </div>
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}

            {!isFiltering && filteredAnimals.length > 0 && viewMode === 'list' ? (
              <div className="admin-page__list">
                {filteredAnimals.map((animal) => (
                  <article key={animal.id} className="admin-page__list-item">
                    <ImageWithFallback
                      src={animal.image}
                      alt={`${animal.name} profile image in admin list`}
                      className="admin-page__thumb"
                    />
                    <div className="admin-page__list-main">
                      <h2>{animal.name}</h2>
                      <p>
                        {typeLabel[animal.type]} / {ageLabel[animal.age]}
                      </p>
                    </div>
                    <Badge variant={animal.status}>{statusLabel[animal.status]}</Badge>
                    <AppSelect
                      className="admin-page__list-select"
                      value={animal.status}
                      ariaLabel={`Change status for ${animal.name}`}
                      options={statusOptions}
                      onValueChange={(value) => handleStatusChange(animal.id, value as Animal['status'])}
                    />
                    <div className="admin-page__row-actions">
                      <button aria-label={`Preview ${animal.name}`} onClick={() => setPreviewAnimal(animal)}>
                        <Eye size={16} />
                      </button>
                      <button aria-label={`Edit ${animal.name}`} onClick={() => handleOpenEdit(animal)}>
                        <Pencil size={16} />
                      </button>
                      <button aria-label={`Delete ${animal.name}`} onClick={() => handleDelete(animal.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
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

      <Modal
        isOpen={Boolean(previewAnimal)}
        onClose={() => setPreviewAnimal(null)}
        title={previewAnimal ? `${previewAnimal.name} profile` : ''}
        panelClassName="admin-page__preview-modal"
      >
        {previewAnimal ? (
          <div className="admin-page__preview">
            <ImageWithFallback
              src={previewAnimal.image}
              alt={`${previewAnimal.name} preview`}
              className="admin-page__preview-image"
            />
            <div className="admin-page__preview-content">
              <Badge variant={previewAnimal.status}>{statusLabel[previewAnimal.status]}</Badge>
              <p className="admin-page__preview-meta">
                {typeLabel[previewAnimal.type]} / {ageLabel[previewAnimal.age]} /{' '}
                {previewAnimal.gender === 'male' ? 'Male' : 'Female'}
              </p>
              <p className="admin-page__preview-description">{previewAnimal.description}</p>
              <div className="admin-page__preview-actions">
                <Button onClick={() => handleOpenEdit(previewAnimal)}>
                  <Pencil size={16} />
                  Edit profile
                </Button>
                <Button variant="secondary" onClick={() => handleDelete(previewAnimal.id)}>
                  <Trash2 size={16} />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  );
}
