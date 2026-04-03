import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-[#111827]">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-xl hover:bg-[#F9FAFB] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
