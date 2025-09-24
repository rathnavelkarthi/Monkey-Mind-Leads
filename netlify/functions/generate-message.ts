
import { GoogleGenAI } from "@google/genai";
import type { Handler } from "@netlify/functions";

// FIX: Implement server-side Gemini API call to generate messages.
// This function is deployed as a Netlify serverless function.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

interface Lead {
  name: string;
  company: string;
  notes: string;
  status: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    if (!event.body) {
        return { statusCode: 400, body: 'Missing request body' };
    }
    const lead = JSON.parse(event.body) as Lead;

    if (!lead.name || !lead.company) {
        return { statusCode: 400, body: 'Missing lead information' };
    }

    const prompt = `
        You are a sales representative. Write a friendly and professional WhatsApp message to a potential client.
        The message should be concise and aim to re-engage them. The message should not include a greeting (e.g., "Hi John,") as that will be added separately.
        
        Client Details:
        - Name: ${lead.name}
        - Company: ${lead.company}
        - Last interaction notes: ${lead.notes}
        - Status: ${lead.status}

        Generate just the message body.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    
    const message = response.text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    };
  } catch (error) {
    console.error("Error generating message:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { statusCode: 500, body: `Failed to generate message: ${errorMessage}` };
  }
};
