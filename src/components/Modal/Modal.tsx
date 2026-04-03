"use client";

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="app-modal" role="dialog" aria-modal="true" aria-label={title || 'Dialog window'}>
      <button className="app-modal__backdrop" onClick={onClose} aria-label="Close modal" />
      <div className="app-modal__panel">
        <div className="app-modal__head">
          {title ? <h2 className="app-modal__title">{title}</h2> : <span />}
          <button className="app-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="app-modal__body">{children}</div>
      </div>
    </div>
  );
}
