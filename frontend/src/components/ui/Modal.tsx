import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white px-6 py-4 border-b border-stone-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="px-6 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
