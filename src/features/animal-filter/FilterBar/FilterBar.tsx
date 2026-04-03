import { Search } from 'lucide-react';
import { AnimalAge, AnimalStatus, AnimalType } from '../../../shared/types/animal';
import { AppSelect } from '../../../components/AppSelect/AppSelect';
import './FilterBar.scss';

interface FilterBarProps {
  searchQuery: string;
  typeFilter: AnimalType | 'all';
  ageFilter: AnimalAge | 'all';
  statusFilter: AnimalStatus | 'all';
  onSearchChange: (value: string) => void;
  onTypeChange: (value: AnimalType | 'all') => void;
  onAgeChange: (value: AnimalAge | 'all') => void;
  onStatusChange: (value: AnimalStatus | 'all') => void;
}

export function FilterBar({
  searchQuery,
  typeFilter,
  ageFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onAgeChange,
  onStatusChange,
}: FilterBarProps) {
  const typeOptions = [
    { value: 'all', label: 'Тип: Усі' },
    { value: 'dog', label: 'Тип: Собака' },
    { value: 'cat', label: 'Тип: Кіт' },
  ];

  const ageOptions = [
    { value: 'all', label: 'Вік: Усі' },
    { value: 'young', label: 'Вік: Молодий' },
    { value: 'adult', label: 'Вік: Дорослий' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Статус: Усі' },
    { value: 'available', label: 'Статус: Доступний' },
    { value: 'in-process', label: 'Статус: В процесі' },
    { value: 'adopted', label: 'Статус: Усиновлено' },
  ];

  return (
    <section className="filter-bar" aria-label="Пошук та фільтри тварин">
      <div className="filter-bar__search">
        <Search size={18} />
        <input
          className="filter-bar__search-input"
          type="text"
          placeholder="Пошук за ім'ям тварини"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-bar__controls">
        <AppSelect
          className="filter-bar__select"
          ariaLabel="Фільтр за типом тварини"
          value={typeFilter}
          options={typeOptions}
          onValueChange={(value) => onTypeChange(value as AnimalType | 'all')}
        />

        <AppSelect
          className="filter-bar__select"
          ariaLabel="Фільтр за віком тварини"
          value={ageFilter}
          options={ageOptions}
          onValueChange={(value) => onAgeChange(value as AnimalAge | 'all')}
        />

        <AppSelect
          className="filter-bar__select"
          ariaLabel="Фільтр за статусом усиновлення"
          value={statusFilter}
          options={statusOptions}
          onValueChange={(value) => onStatusChange(value as AnimalStatus | 'all')}
        />
      </div>
    </section>
  );
}
