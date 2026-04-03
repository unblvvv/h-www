import { Search } from 'lucide-react';
import { AnimalAge, AnimalStatus, AnimalType } from '../shared/types/animal';
import { Input } from './Input';
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
        <Input
          type="text"
          placeholder="Search by pet name"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <div className="filter-bar__controls">
        <label>
          <span>Type</span>
          <select value={typeFilter} onChange={(event) => onTypeChange(event.target.value as AnimalType | 'all')}>
            <option value="all">All</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
        </label>

        <label>
          <span>Age</span>
          <select value={ageFilter} onChange={(event) => onAgeChange(event.target.value as AnimalAge | 'all')}>
            <option value="all">All</option>
            <option value="young">Young</option>
            <option value="adult">Adult</option>
          </select>
        </label>

        <label>
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value as AnimalStatus | 'all')}
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="in-process">In process</option>
            <option value="adopted">Adopted</option>
          </select>
        </label>
      </div>
    </section>
  );
}
