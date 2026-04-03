import { Link, useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSeo } from '../../shared/utils/useSeo';
import { mockAnimals } from '../../shared/data/mockAnimals';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import './AnimalDetailsPage.scss';

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const animal = mockAnimals.find((pet) => pet.id === id);
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
            <ImageWithFallback
              src={animal.image}
              alt={`${animal.name}, ${petAgeLabel.toLowerCase()} ${petTypeLabel.toLowerCase()}, профільне фото з притулку`}
              className="animal-details-page__main-image"
            />
            <div className="animal-details-page__thumbs">
              {[1, 2, 3].map((thumb) => (
                <ImageWithFallback
                  key={thumb}
                  src={animal.image}
                  alt={`Фото ${animal.name} ${thumb + 1}`}
                  className="animal-details-page__thumb-image"
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
