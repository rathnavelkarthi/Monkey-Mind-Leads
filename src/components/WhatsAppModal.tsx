
import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { generateWhatsAppMessage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

// FIX: Added WhatsAppModal component implementation to resolve module error.

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, lead }) => {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (lead) {
            const firstName = lead.name.split(' ')[0];
            setMessage(`Hi ${firstName},`);
        } else {
            setMessage('');
        }
    }, [lead, isOpen]);

    if (!isOpen || !lead) return null;
    
    const handleGenerateMessage = async () => {
        setIsLoading(true);
        try {
            const generatedMessage = await generateWhatsAppMessage(lead);
            const firstName = lead.name.split(' ')[0];
            setMessage(`Hi ${firstName}, ${generatedMessage}`);
        } catch (error) {
            console.error("Failed to generate message", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSendMessage = () => {
        const phoneNumber = lead.phone.replace(/[^0-9+]/g, '');
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose} aria-modal="true" role="dialog">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Send WhatsApp Message</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">To: <span className="font-semibold">{lead.name}</span> ({lead.phone})</p>
                <div className="space-y-4">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Write your message..."
                    />
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleGenerateMessage}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                            <SparklesIcon className="w-5 h-5 mr-2"/>
                            {isLoading ? 'Generating...' : 'Generate with AI'}
                        </button>
                        <button
                            onClick={handleSendMessage}
                            className="flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                        >
                            <WhatsAppIcon className="w-5 h-5 mr-2" />
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
