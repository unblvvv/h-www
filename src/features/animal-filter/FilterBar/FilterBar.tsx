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
    { value: 'all', label: 'Type: All' },
    { value: 'dog', label: 'Type: Dog' },
    { value: 'cat', label: 'Type: Cat' },
  ];

  const ageOptions = [
    { value: 'all', label: 'Age: All' },
    { value: 'young', label: 'Age: Young' },
    { value: 'adult', label: 'Age: Adult' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Status: All' },
    { value: 'available', label: 'Status: Available' },
    { value: 'in-process', label: 'Status: In process' },
    { value: 'adopted', label: 'Status: Adopted' },
  ];

  return (
    <section className="filter-bar" aria-label="Pet search and filters">
      <div className="filter-bar__search">
        <Search size={18} />
        <input
          className="filter-bar__search-input"
          type="text"
          placeholder="Search by pet name"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-bar__controls">
        <AppSelect
          className="filter-bar__select"
          ariaLabel="Filter by pet type"
          value={typeFilter}
          options={typeOptions}
          onValueChange={(value) => onTypeChange(value as AnimalType | 'all')}
        />

        <AppSelect
          className="filter-bar__select"
          ariaLabel="Filter by pet age"
          value={ageFilter}
          options={ageOptions}
          onValueChange={(value) => onAgeChange(value as AnimalAge | 'all')}
        />

        <AppSelect
          className="filter-bar__select"
          ariaLabel="Filter by adoption status"
          value={statusFilter}
          options={statusOptions}
          onValueChange={(value) => onStatusChange(value as AnimalStatus | 'all')}
        />
      </div>
    </section>
  );
}
