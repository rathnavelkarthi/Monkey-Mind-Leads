import { GoogleGenAI } from "@google/genai";
import { Lead } from '../types';

// FIX: Removed unnecessary check for API_KEY. The guidelines state to assume it is always pre-configured and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateWhatsAppMessage = async (lead: Lead): Promise<string> => {
  const prompt = `
    You are a professional and friendly sales assistant. Your task is to write a concise and effective follow-up message for WhatsApp.

    **Instructions:**
    1.  Start with a friendly greeting, addressing the client by their first name.
    2.  Keep the message conversational and brief, suitable for a chat platform.
    3.  Mention their company to show personalization.
    4.  Refer to the previous interaction based on the notes provided.
    5.  The goal is to re-engage the lead and suggest a next step (e.g., "When's a good time for a quick 5-min call?").
    6.  Use emojis where appropriate to maintain a friendly tone, but don't overdo it.
    7.  The entire message should be 2-3 short paragraphs at most.

    **Lead Details:**
    -   **Name:** ${lead.name}
    -   **Company:** ${lead.company}
    -   **Notes from last interaction:** ${lead.notes}

    Generate the WhatsApp message now.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating message with Gemini API:", error);
    throw new Error("Failed to generate AI-powered message. Please try again.");
  }
};