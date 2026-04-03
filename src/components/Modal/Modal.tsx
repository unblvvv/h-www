"use client";

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  panelClassName?: string;
  bodyClassName?: string;
}

export function Modal({ isOpen, onClose, children, title, panelClassName, bodyClassName }: ModalProps) {
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
    <div className="app-modal" role="dialog" aria-modal="true" aria-label={title || 'Діалогове вікно'}>
      <button className="app-modal__backdrop" onClick={onClose} aria-label="Закрити модальне вікно" />
      <div className={`app-modal__panel${panelClassName ? ` ${panelClassName}` : ''}`}>
        <div className="app-modal__head">
          {title ? <h2 className="app-modal__title">{title}</h2> : <span />}
          <button className="app-modal__close" onClick={onClose} aria-label="Закрити модальне вікно">
            <X size={18} />
          </button>
        </div>
        <div className={`app-modal__body${bodyClassName ? ` ${bodyClassName}` : ''}`}>{children}</div>
      </div>
    </div>
  );
}
