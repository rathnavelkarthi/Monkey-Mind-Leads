import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { generateWhatsAppMessage } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

// FIX: Added WhatsAppModal component implementation to resolve module error.

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 32 32" fill="currentColor" {...props}>
        <path d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.044-.53-.044-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.38.288-.73.288-1.49.214-1.665-.073-.17-.302-.315-.64-.315zm-6.44 10.742a13.913 13.913 0 0 1-7.592-2.148l-1.615.824 1.17-1.57-.27-.417a11.96 11.96 0 0 1-1.51-5.32c0-6.525 5.27-11.795 11.795-11.795 6.525 0 11.795 5.27 11.795 11.795 0 6.525-5.27 11.795-11.795 11.795zm0-25.215a13.427 13.427 0 0 0-13.425 13.426c0 2.458.65 4.71 1.823 6.625l-2.12 2.822 3.028-1.58a13.38 13.38 0 0 0 6.13 1.58h.01c7.415 0 13.426-6.01 13.426-13.425C26.095 6.012 20.085 0 12.67 0z" />
    </svg>
);


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
