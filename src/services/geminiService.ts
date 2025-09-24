import { Lead } from "../types";

export const generateWhatsAppMessage = async (lead: Lead): Promise<string> => {
    try {
        const response = await fetch('/.netlify/functions/generate-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(lead),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to generate message from API: ${errorText}`);
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Error generating WhatsApp message:", error);
        // Provide a fallback template
        return `I hope you're having a great week. I wanted to quickly follow up on our last conversation. Would you be available for a brief chat sometime next week?`;
    }
};
