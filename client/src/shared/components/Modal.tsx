// components/ui/Modal.jsx
import React, { type ReactNode } from 'react';

interface ModalProps{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children:ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }:ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity cursor-pointer"
        onClick={onClose}
        role='button'
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

      </div>
    </div>

  );
  

};