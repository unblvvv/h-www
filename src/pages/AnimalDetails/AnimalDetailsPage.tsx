import { Link, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSeo } from '../../shared/utils/useSeo';
import { apiRequest } from '../../shared/lib/api';
import { Animal, AnimalAge, AnimalStatus, AnimalType } from '../../shared/types/animal';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import './AnimalDetailsPage.scss';

interface ApiAnimal {
  Age?: string;
  CreatedAt?: string;
  Description?: string;
  ID?: string;
  Name?: string;
  OrganizationID?: string;
  PhotoURL?: string;
  Sex?: string;
  Status?: string;
  Type?: string;
  UpdatedAt?: string;
}

interface ApiAnimalListResponse {
  items?: ApiAnimal[];
}

const normalizeType = (value?: string): AnimalType => {
  const normalized = value?.trim().toLowerCase();
  return normalized === 'cat' ? 'cat' : 'dog';
};

const normalizeAge = (value?: string): AnimalAge => {
  const normalized = value?.trim().toLowerCase();
  return normalized === 'young' ? 'young' : 'adult';
};

const normalizeStatus = (value?: string): AnimalStatus => {
  const normalized = value?.trim().toLowerCase();
  if (normalized === 'in-process') return 'in-process';
  if (normalized === 'adopted') return 'adopted';
  return 'available';
};

const normalizeSex = (value?: string): 'male' | 'female' => {
  const normalized = value?.trim().toLowerCase();
  return normalized === 'female' ? 'female' : 'male';
};

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const petTypeLabel = animal?.type === 'dog' ? 'Собака' : 'Кіт';
  const petAgeLabel = animal?.age === 'young' ? 'Молодий' : 'Дорослий';
  const petGenderLabel = animal?.gender === 'female' ? 'Самка' : 'Самець';
  const statusLabel =
    animal?.status === 'available'
      ? 'доступний'
      : animal?.status === 'in-process'
        ? 'в процесі'
        : 'усиновлено';
  const statusHint =
    animal?.status === 'available'
      ? 'Готовий поїхати додому вже сьогодні'
      : animal?.status === 'in-process'
        ? 'Наразі сімʼя подає заявку'
        : 'Вже щасливо усиновлений';

  useSeo({
    title: animal ? `${animal.name} | Деталі врятованого улюбленця` : 'Деталі улюбленця | Притулок для тварин',
    description: animal
      ? `${animal.name} — ${petAgeLabel.toLowerCase()} ${petTypeLabel.toLowerCase()}, зараз статус: ${statusLabel}. Дізнайтеся більше та подайте заявку на усиновлення.`
      : 'Перегляньте деталі улюбленця та подайте заявку на усиновлення.',
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  useEffect(() => {
    setActivePhotoIndex(0);
  }, [animal?.id]);

  const photoUrls = (() => {
    if (!animal || typeof animal.image !== 'string') {
      return [''];
    }

    const parts = animal.image
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    return parts.length ? parts : [animal.image];
  })();

  const handlePrevPhoto = () => {
    if (photoUrls.length <= 1) return;
    setActivePhotoIndex((prev) => (prev - 1 + photoUrls.length) % photoUrls.length);
  };

  const handleNextPhoto = () => {
    if (photoUrls.length <= 1) return;
    setActivePhotoIndex((prev) => (prev + 1) % photoUrls.length);
  };

  useEffect(() => {
    let isMounted = true;
    if (!id) {
      setAnimal(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    apiRequest<ApiAnimalListResponse>('/animal')
      .then((data) => {
        if (!isMounted) return;
        const items = data.items ?? [];
        const mapped = items.map((item, index) => ({
          id: item.ID ?? `${index}`,
          name: item.Name ?? 'Без імені',
          type: normalizeType(item.Type),
          age: normalizeAge(item.Age),
          gender: normalizeSex(item.Sex),
          description: item.Description ?? '',
          image: item.PhotoURL ?? '',
          status: normalizeStatus(item.Status),
        }));
        const found = mapped.find((pet) => pet.id === id) ?? null;
        setAnimal(found);
      })
      .catch(() => {
        if (!isMounted) return;
        setAnimal(null);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <main className="page animal-details-page">
        <div className="app-container animal-details-page__not-found">
          <p className="section-subtitle">Завантаження профілю улюбленця...</p>
        </div>
      </main>
    );
  }

  if (!animal) {
    return (
      <main className="page animal-details-page">
        <div className="app-container animal-details-page__not-found">
          <h1 className="section-title">Улюбленця не знайдено</h1>
          <p className="section-subtitle">Цей профіль не існує або був видалений.</p>
          <Link to="/find-pet">
            <Button>Назад до каталогу</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page animal-details-page">
      <div className="app-container">
        <Link to="/find-pet" className="animal-details-page__back-link">
          <ArrowLeft size={18} />
          Назад до каталогу
        </Link>

        <article className="animal-details-page__card">
          <section className="animal-details-page__gallery" aria-label={`Фото ${animal.name}`}>
            <div className="animal-details-page__slider">
              <button
                type="button"
                className="animal-details-page__slider-arrow animal-details-page__slider-arrow--left"
                onClick={handlePrevPhoto}
                aria-label="Попереднє фото"
                disabled={photoUrls.length <= 1}
              >
                <ChevronLeft size={20} />
              </button>

              <ImageWithFallback
                src={photoUrls[activePhotoIndex] ?? ''}
                alt={`${animal.name}, фото ${activePhotoIndex + 1}`}
                className="animal-details-page__main-image"
              />

              <button
                type="button"
                className="animal-details-page__slider-arrow animal-details-page__slider-arrow--right"
                onClick={handleNextPhoto}
                aria-label="Наступне фото"
                disabled={photoUrls.length <= 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="animal-details-page__dots" role="tablist" aria-label="Слайди фото">
              {photoUrls.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    index === activePhotoIndex
                      ? 'animal-details-page__dot is-active'
                      : 'animal-details-page__dot'
                  }
                  onClick={() => setActivePhotoIndex(index)}
                  aria-label={`Показати фото ${index + 1}`}
                  aria-pressed={index === activePhotoIndex}
                />
              ))}
            </div>
          </section>

          <section className="animal-details-page__info">
            <header className="animal-details-page__title-wrap">
              <h1>{animal.name}</h1>
              <p>{petTypeLabel} - {petAgeLabel} - {petGenderLabel}</p>
            </header>

            <section className="animal-details-page__status-box" aria-label="Статус усиновлення">
              <Badge variant={animal.status} />
              <p>{statusHint}</p>
            </section>

            <section className="animal-details-page__about">
              <h2>Про улюбленця</h2>
              <p>{animal.description}</p>
            </section>

            <section className="animal-details-page__facts" aria-label="Факти про улюбленця">
              <div>
                <span>Тип</span>
                <strong>{petTypeLabel}</strong>
              </div>
              <div>
                <span>Вік</span>
                <strong>{petAgeLabel}</strong>
              </div>
              <div>
                <span>Стать</span>
                <strong>{petGenderLabel}</strong>
              </div>
              <div>
                <span>Статус</span>
                <strong>{animal.status === 'available' ? 'Доступний' : animal.status === 'in-process' ? 'В процесі' : 'Усиновлено'}</strong>
              </div>
            </section>

            <section className="animal-details-page__actions" aria-label="Дії з улюбленцем">
              <Button size="lg" onClick={() => navigate(`/adopt/${animal.id}`)} disabled={animal.status !== 'available'}>
                Усиновити цього улюбленця
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/donate')}>
                Підтримати
              </Button>
            </section>
          </section>
        </article>
      </div>
    </main>
  );
}
