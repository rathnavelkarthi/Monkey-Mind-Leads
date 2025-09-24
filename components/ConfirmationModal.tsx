import React from 'react';
import { TrashIcon } from './icons/TrashIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose} aria-modal="true" role="dialog">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <TrashIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
          {title}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {message}
          </p>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
