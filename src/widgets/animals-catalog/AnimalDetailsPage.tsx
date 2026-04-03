import { useParams, Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { Badge } from '../../shared/ui/Badge';
import { Modal } from '../../shared/ui/Modal';
import { mockAnimals } from '../../shared/entities/animal/mockAnimals';
import { ImageWithFallback } from '../../shared/ui/figma/ImageWithFallback';

export default function AnimalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const animal = mockAnimals.find((a) => a.id === id);

  if (!animal) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6B7280] mb-4">Animal not found</p>
          <Link to="/">
            <Button variant="primary">Back to home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#22C55E] transition-colors mb-6">
          <ArrowLeft className="w-5 h-5" />
          Back to all animals
        </Link>

        <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#E5E7EB]">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-square md:aspect-auto">
              <ImageWithFallback
                src={animal.image}
                alt={animal.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-[#111827] mb-2">{animal.name}</h1>
                    <div className="flex gap-4 text-[#6B7280]">
                      <span>{animal.type === 'dog' ? 'Dog' : 'Cat'}</span>
                      <span>•</span>
                      <span>{animal.gender === 'male' ? 'Male' : 'Female'}</span>
                    </div>
                  </div>
                  <Badge variant={animal.status === 'available' ? 'available' : animal.status === 'in-process' ? 'in-process' : 'adopted'}>
                    {animal.status === 'available' ? 'Looking for home' : animal.status === 'in-process' ? 'In process' : 'Adopted'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-[#111827] mb-1">Age</h3>
                    <p className="text-[#6B7280]">
                      {animal.age === 'young' ? 'Young (under 2 years)' : 'Adult (2+ years)'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[#111827] mb-1">About {animal.name}</h3>
                    <p className="text-[#6B7280]">{animal.description}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t-2 border-[#E5E7EB]">
                {animal.status === 'available' && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate(`/adopt/${animal.id}`)}
                  >
                    Adopt {animal.name}
                  </Button>
                )}
                {animal.status === 'in-process' && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    Adoption in progress
                  </Button>
                )}
                {animal.status === 'adopted' && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    disabled
                  >
                    Already adopted
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/donate')}
                >
                  Make a donation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="space-y-4">
          <p className="text-[#6B7280]">
            Thank you for your interest in adopting {animal.name}! Please fill
            out the adoption form.
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              setShowModal(false);
              navigate(`/adopt/${animal.id}`);
            }}
          >
            Go to adoption form
          </Button>
        </div>
      </Modal>
    </div>
  );
}
