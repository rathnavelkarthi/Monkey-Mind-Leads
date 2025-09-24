import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { generateWhatsAppMessage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, lead }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen && lead) {
      const generateMessage = async () => {
        setIsLoading(true);
        setError(null);
        setMessage('');
        setIsCopied(false);
        try {
          const generatedMessage = await generateWhatsAppMessage(lead);
          setMessage(generatedMessage);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred.');
          }
        } finally {
          setIsLoading(false);
        }
      };
      generateMessage();
    }
  }, [isOpen, lead]);

  const handleCopyToClipboard = () => {
    if (message) {
      navigator.clipboard.writeText(message);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleOpenWhatsApp = () => {
    if (lead && message) {
      const phoneNumber = lead.phone.replace(/\D/g, ''); // Remove non-numeric characters
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <SparklesIcon className="w-6 h-6 mr-2 text-purple-500" />
            AI-Generated WhatsApp Message
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg min-h-[200px] flex items-center justify-center">
          {isLoading && <p className="text-gray-500">Generating message...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {message && (
            <textarea
              readOnly
              className="w-full h-48 p-2 border border-gray-300 rounded-md resize-none bg-white text-gray-700"
              value={message}
            />
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
           <button
            onClick={handleCopyToClipboard}
            disabled={!message || isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:bg-gray-300 transition-colors"
          >
            {isCopied ? 'Copied!' : 'Copy Message'}
          </button>
          <button
            onClick={handleOpenWhatsApp}
            disabled={!message || isLoading}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-green-300 transition-colors"
          >
            Open in WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;