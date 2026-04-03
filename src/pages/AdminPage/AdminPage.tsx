import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Eye, LayoutGrid, List, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from 'lucide-react';
import { AdminAnimalForm } from './ui/AdminAnimalForm/AdminAnimalForm';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Modal } from '../../components/Modal/Modal';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { AppSelect } from '../../components/AppSelect/AppSelect';
import { instance } from '../../shared/lib/api.config';
import { Animal, AnimalAge, AnimalStatus, AnimalType } from '../../shared/types/animal';
import './AdminPage.scss';

const statusLabel: Record<Animal['status'], string> = {
  available: 'Доступний',
  'in-process': 'В процесі',
  adopted: 'Усиновлено',
};

const getTypeLabel = (value: Animal['type']) => {
  if (value === 'dog') return 'Собака';
  if (value === 'cat') return 'Кіт';
  return 'Невідомо';
};

const getAgeLabel = (value: Animal['age']) => {
  if (value === 'young') return 'Молодий';
  if (value === 'adult') return 'Дорослий';
  if (!value) return 'Невідомо';
  return value;
};

const getGenderLabel = (value: Animal['gender']) => {
  if (value === 'male') return 'Самець';
  if (value === 'female') return 'Самка';
  if (!value) return 'Невідомо';
  return value;
};

const typeFilterOptions = [
  { value: 'all', label: 'Усі типи' },
  { value: 'dog', label: 'Собака' },
  { value: 'cat', label: 'Кіт' },
  { value: 'unknown', label: 'Невідомо' },
];

const statusFilterOptions = [
  { value: 'all', label: 'Усі статуси' },
  { value: 'available', label: 'Доступні' },
  { value: 'in-process', label: 'В процесі' },
  { value: 'adopted', label: 'Усиновлені' },
];

const ageFilterOptions = [
  { value: 'all', label: 'Усі вікові категорії' },
  { value: 'young', label: 'Молоді' },
  { value: 'adult', label: 'Дорослі' },
];

const statusOptions = [
  { value: 'available', label: 'Доступний' },
  { value: 'in-process', label: 'В процесі' },
  { value: 'adopted', label: 'Усиновлено' },
];

type UploadResponse = {
  url?: string;
  urls?: string[];
};

type CreateAnimalResponse = {
  id: string;
  message?: string;
};

type ViewMode = 'grid' | 'list';

interface ApiAnimal {
  ID?: string;
  OrganizationID?: string;
  Name?: string;
  Age?: string;
  Sex?: string;
  Description?: string;
  PhotoURLs?: string[];
  Status?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

interface ApiAnimalListResponse {
  items?: ApiAnimal[];
}

const normalizeUrl = (url?: string | null) => (url ? url.replace(/([^:]\/)(\/)+/g, '$1') : '');

const normalizeType = (value?: string): AnimalType => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'cat') return 'cat';
  if (normalized === 'dog') return 'dog';
  return 'unknown';
};

const normalizeAge = (value?: string): AnimalAge => {
  const trimmed = value?.trim();
  if (!trimmed) return 'unknown';
  const normalized = trimmed.toLowerCase();
  if (normalized === 'young' || normalized === 'adult') return normalized;
  return trimmed;
};

const normalizeStatus = (value?: string): AnimalStatus => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'in-process') return 'in-process';
  if (normalized === 'adopted') return 'adopted';
  return 'available';
};

const normalizeSex = (value?: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) return 'unknown';
  const normalized = trimmed.toLowerCase();
  if (normalized === 'female' || normalized === 'male') return normalized;
  return trimmed;
};

const normalizePhotoUrls = (value: Animal['image'] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const uploadFiles = async (files: File[]): Promise<string[]> => {
  const uploads = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);

    const uploadResponse = await instance.post<UploadResponse>('/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json, application/problem+json',
      },
    });

    const candidate = uploadResponse.data.urls?.[0] ?? uploadResponse.data.url ?? '';
    const resolvedUrl = normalizeUrl(candidate);
    if (!resolvedUrl) {
      throw new Error('Upload response missing url');
    }
    return resolvedUrl;
  });

  return Promise.all(uploads);
};

export default function AdminPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    instance
      .get<ApiAnimalListResponse>('/animal', {
        headers: {
          Accept: 'application/json, application/problem+json',
        },
      })
      .then((response) => {
        if (!isMounted) return;
        const items = response.data.items ?? [];
        const mapped = items.map((item, index) => ({
          id: item.ID ?? `${index}`,
          name: item.Name ?? 'Без імені',
          type: normalizeType(undefined),
          age: normalizeAge(item.Age),
          gender: normalizeSex(item.Sex),
          description: item.Description ?? '',
          image: item.PhotoURLs ?? [],
          status: normalizeStatus(item.Status),
        }));
        setAnimals(mapped);
      })
      .catch(() => {
        if (!isMounted) return;
        setAnimals([]);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      let photoUrls = normalizePhotoUrls(formValues.image);

      if (Array.isArray(formValues.image) && formValues.image.some((item) => item instanceof File)) {
        const uploaded = await uploadFiles(formValues.image as File[]);
        photoUrls = uploaded;
      } else if (formValues.image instanceof File) {
        const uploaded = await uploadFiles([formValues.image]);
        photoUrls = uploaded;
      }

      const createResponse = await instance.post<CreateAnimalResponse>('/admin/animal/create', {
        age: formValues.age,
        description: formValues.description,
        name: formValues.name,
        photo_urls: photoUrls,
        sex: formValues.gender,
        status: formValues.status,
      });

      const resolvedImage = photoUrls.length ? photoUrls : normalizePhotoUrls(formValues.image);

      if (editingAnimal) {
        setAnimals((prev) =>
          prev.map((animal) =>
            animal.id === editingAnimal.id
              ? ({
                  ...editingAnimal,
                  ...formValues,
                  image: resolvedImage,
                } as Animal)
              : animal,
          ),
        );
      } else {
        setAnimals((prev) => [
          ...prev,
          {
            ...(formValues as Animal),
            id: createResponse.data.id || Date.now().toString(),
            image: resolvedImage,
          },
        ]);
      }

      setIsModalOpen(false);
      setShowSuccess(true);
      window.setTimeout(() => setShowSuccess(false), 1800);
    } catch (error) {
      console.error('Failed to save animal', error);
      window.alert('Не вдалося зберегти тварину. Спробуйте ще раз.');
    }
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm('Видалити цей профіль тварини?');
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
              <p className="admin-page__badge">Центр керування</p>
              <h1 className="section-title">Керування тваринами</h1>
              <p className="section-subtitle">
                Керуйте профілями, статусами та видимістю тварин у каталозі.
              </p>
            </div>
            <Button onClick={handleOpenCreate} className="admin-page__add-button">
              <Plus size={18} />
              Додати тварину
            </Button>
          </header>

          {showSuccess ? (
            <p className="admin-page__success" role="status">
              <CheckCircle2 size={16} /> Успішно збережено
            </p>
          ) : null}

          <section className="admin-page__summary" aria-label="Підсумок тварин">
            <article className="admin-page__summary-card admin-page__summary-card--total">
              <p>Усього тварин</p>
              <strong>{summary.total}</strong>
            </article>
            <article className="admin-page__summary-card admin-page__summary-card--available">
              <p>Доступні</p>
              <strong>{summary.available}</strong>
            </article>
            <article className="admin-page__summary-card admin-page__summary-card--in-process">
              <p>В процесі</p>
              <strong>{summary.inProcess}</strong>
            </article>
            <article className="admin-page__summary-card admin-page__summary-card--adopted">
              <p>Усиновлені</p>
              <strong>{summary.adopted}</strong>
            </article>
          </section>

          <section className="admin-page__filters" aria-label="Фільтри тварин">
            <div className="admin-page__search">
              <Search size={18} />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Пошук за іменем або описом"
                aria-label="Пошук тварин"
              />
            </div>

            <div className="admin-page__filters-row">
              <label className="admin-page__filter">
                <span>
                  <SlidersHorizontal size={14} /> Тип
                </span>
                <AppSelect
                  className="admin-page__filter-select"
                  value={typeFilter}
                  options={typeFilterOptions}
                  ariaLabel="Фільтр за типом"
                  onValueChange={(value) => setTypeFilter(value as 'all' | Animal['type'])}
                />
              </label>

              <label className="admin-page__filter">
                <span>Статус</span>
                <AppSelect
                  className="admin-page__filter-select"
                  value={statusFilter}
                  options={statusFilterOptions}
                  ariaLabel="Фільтр за статусом"
                  onValueChange={(value) => setStatusFilter(value as 'all' | Animal['status'])}
                />
              </label>

              <label className="admin-page__filter">
                <span>Вік</span>
                <AppSelect
                  className="admin-page__filter-select"
                  value={ageFilter}
                  options={ageFilterOptions}
                  ariaLabel="Фільтр за віком"
                  onValueChange={(value) => setAgeFilter(value as 'all' | Animal['age'])}
                />
              </label>

              <div className="admin-page__view-toggle" role="group" aria-label="Режим перегляду">
                <button
                  type="button"
                  className={viewMode === 'grid' ? 'is-active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={15} />
                  Сітка
                </button>
                <button
                  type="button"
                  className={viewMode === 'list' ? 'is-active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List size={15} />
                  Список
                </button>
              </div>
            </div>
          </section>

          <section className="admin-page__catalog" aria-label="Список тварин в адмінці">
            {isLoading || isFiltering ? (
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
                <h2>Тварин не знайдено</h2>
                <p>Спробуйте змінити фільтри або очистити пошук, щоб побачити всі профілі.</p>
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
                        alt={`${animal.name} — профільне фото у картці адміна`}
                        className="admin-page__cover"
                      />
                      <div className="admin-page__card-actions">
                        <button
                          aria-label={`Перегляд ${animal.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            setPreviewAnimal(animal);
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          aria-label={`Редагувати ${animal.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenEdit(animal);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          aria-label={`Видалити ${animal.name}`}
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
                        {getTypeLabel(animal.type)} / {getAgeLabel(animal.age)}
                      </p>
                      <p className="admin-page__description">{animal.description}</p>
                      <label className="admin-page__status-control">
                        <span>Змінити статус</span>
                        <div
                          className="admin-page__status-select-wrap"
                          onClick={(event) => event.stopPropagation()}
                          onPointerDown={(event) => event.stopPropagation()}
                        >
                          <AppSelect
                            className="admin-page__status-select"
                            value={animal.status}
                            options={statusOptions}
                            ariaLabel={`Змінити статус для ${animal.name}`}
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
                      alt={`${animal.name} — профільне фото в списку адміна`}
                      className="admin-page__thumb"
                    />
                    <div className="admin-page__list-main">
                      <h2>{animal.name}</h2>
                      <p>
                        {getTypeLabel(animal.type)} / {getAgeLabel(animal.age)}
                      </p>
                    </div>
                    <Badge variant={animal.status}>{statusLabel[animal.status]}</Badge>
                    <AppSelect
                      className="admin-page__list-select"
                      value={animal.status}
                      ariaLabel={`Змінити статус для ${animal.name}`}
                      options={statusOptions}
                      onValueChange={(value) => handleStatusChange(animal.id, value as Animal['status'])}
                    />
                    <div className="admin-page__row-actions">
                      <button aria-label={`Перегляд ${animal.name}`} onClick={() => setPreviewAnimal(animal)}>
                        <Eye size={16} />
                      </button>
                      <button aria-label={`Редагувати ${animal.name}`} onClick={() => handleOpenEdit(animal)}>
                        <Pencil size={16} />
                      </button>
                      <button aria-label={`Видалити ${animal.name}`} onClick={() => handleDelete(animal.id)}>
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
        title={editingAnimal ? 'Редагувати профіль тварини' : 'Додати профіль тварини'}
      >
        <AdminAnimalForm
          values={formValues}
          submitLabel={editingAnimal ? 'Зберегти зміни' : 'Створити тварину'}
          onChange={(patch) => setFormValues((prev) => ({ ...prev, ...patch }))}
          onSubmit={handleSave}
        />
      </Modal>

      <Modal
        isOpen={Boolean(previewAnimal)}
        onClose={() => setPreviewAnimal(null)}
        title={previewAnimal ? `Профіль ${previewAnimal.name}` : ''}
        panelClassName="admin-page__preview-modal"
      >
        {previewAnimal ? (
          <div className="admin-page__preview">
            <ImageWithFallback
              src={previewAnimal.image}
              alt={`Попередній перегляд ${previewAnimal.name}`}
              className="admin-page__preview-image"
            />
            <div className="admin-page__preview-content">
              <Badge variant={previewAnimal.status}>{statusLabel[previewAnimal.status]}</Badge>
              <p className="admin-page__preview-meta">
                {getTypeLabel(previewAnimal.type)} / {getAgeLabel(previewAnimal.age)} /{' '}
                {getGenderLabel(previewAnimal.gender)}
              </p>
              <p className="admin-page__preview-description">{previewAnimal.description}</p>
              <div className="admin-page__preview-actions">
                <Button onClick={() => handleOpenEdit(previewAnimal)}>
                  <Pencil size={16} />
                  Редагувати профіль
                </Button>
                <Button variant="secondary" onClick={() => handleDelete(previewAnimal.id)}>
                  <Trash2 size={16} />
                  Видалити
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  );
}
