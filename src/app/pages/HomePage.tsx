import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Search, Heart } from 'lucide-react';
import { AnimalCard } from '../components/AnimalCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { mockAnimals } from '../data/mockAnimals';
import { AnimalType, AnimalAge, AnimalStatus } from '../types/animal';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AnimalType | 'all'>('all');
  const [ageFilter, setAgeFilter] = useState<AnimalAge | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | 'all'>('all');

  const filteredAnimals = useMemo(() => {
    return mockAnimals.filter((animal) => {
      const matchesSearch = animal.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || animal.type === typeFilter;
      const matchesAge = ageFilter === 'all' || animal.age === ageFilter;
      const matchesStatus =
        statusFilter === 'all' || animal.status === statusFilter;

      return matchesSearch && matchesType && matchesAge && matchesStatus;
    });
  }, [searchQuery, typeFilter, ageFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="bg-white border-b-2 border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Heart className="w-16 h-16 text-[#22C55E]" />
            </div>
            <h1 className="text-[#111827]">Find Your New Best Friend</h1>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Give a loving home to animals in need. Browse our available pets
              and start your adoption journey today.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/">
                <Button variant="primary" size="lg">
                  Find a pet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-[#6B7280] mb-2">Animal Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as AnimalType | 'all')}
                className="px-4 py-3 rounded-xl border-2 border-[#E5E7EB] hover:border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all duration-200"
              >
                <option value="all">All types</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </div>

            <div>
              <label className="block text-[#6B7280] mb-2">Age</label>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value as AnimalAge | 'all')}
                className="px-4 py-3 rounded-xl border-2 border-[#E5E7EB] hover:border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all duration-200"
              >
                <option value="all">All ages</option>
                <option value="young">Young</option>
                <option value="adult">Adult</option>
              </select>
            </div>

            <div>
              <label className="block text-[#6B7280] mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as AnimalStatus | 'all')}
                className="px-4 py-3 rounded-xl border-2 border-[#E5E7EB] hover:border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-transparent transition-all duration-200"
              >
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="in-process">In process</option>
                <option value="adopted">Adopted</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAnimals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#6B7280]">No animals found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
