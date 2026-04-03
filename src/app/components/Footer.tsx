import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t-2 border-[#E5E7EB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#22C55E]" />
            <span className="text-[#111827]">Shelter</span>
          </div>
          <p className="text-[#6B7280]">
            Giving animals a second chance at happiness
          </p>
          <p className="text-[#6B7280]">
            © 2026 Animal Shelter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
