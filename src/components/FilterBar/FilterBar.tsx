import { Search } from 'lucide-react';
import { AnimalAge, AnimalStatus, AnimalType } from '../../shared/types/animal';
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
        <select
          aria-label="Filter by pet type"
          value={typeFilter}
          onChange={(event) => onTypeChange(event.target.value as AnimalType | 'all')}
        >
          <option value="all">Type: All</option>
          <option value="dog">Type: Dog</option>
          <option value="cat">Type: Cat</option>
        </select>

        <select
          aria-label="Filter by pet age"
          value={ageFilter}
          onChange={(event) => onAgeChange(event.target.value as AnimalAge | 'all')}
        >
          <option value="all">Age: All</option>
          <option value="young">Age: Young</option>
          <option value="adult">Age: Adult</option>
        </select>

        <select
          aria-label="Filter by adoption status"
          value={statusFilter}
          onChange={(event) => onStatusChange(event.target.value as AnimalStatus | 'all')}
        >
          <option value="all">Status: All</option>
          <option value="available">Status: Available</option>
          <option value="in-process">Status: In process</option>
          <option value="adopted">Status: Adopted</option>
        </select>
      </div>
    </section>
  );
}
