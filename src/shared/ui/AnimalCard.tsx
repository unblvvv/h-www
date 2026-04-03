import { Link } from 'react-router';
import { Badge } from './Badge';
import { Button } from './Button';
import { Animal } from '../entities/animal/animal';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AnimalCardProps {
  animal: Animal;
}

export function AnimalCard({ animal }: AnimalCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#E5E7EB] transition-all duration-200 hover:shadow-lg hover:border-[#22C55E] group">
      <div className="aspect-square overflow-hidden">
        <ImageWithFallback
          src={animal.image}
          alt={animal.name}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[#111827] mb-1">{animal.name}</h3>
            <p className="text-[#6B7280]">{animal.age}</p>
          </div>
          <Badge variant={animal.status === 'available' ? 'available' : animal.status === 'in-process' ? 'in-process' : 'adopted'}>
            {animal.status === 'available' ? 'Looking for home' : animal.status === 'in-process' ? 'In process' : 'Adopted'}
          </Badge>
        </div>

        <p className="text-[#6B7280] line-clamp-2">
          {animal.description}
        </p>

        <Link to={`/animal/${animal.id}`} className="block">
          <Button variant="primary" className="w-full">
            View details
          </Button>
        </Link>
      </div>
    </div>
  );
}
