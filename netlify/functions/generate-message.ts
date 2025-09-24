import { GoogleGenAI } from "@google/genai";
import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

// Redefine types here to avoid complex pathing issues with the /src directory
enum LeadStatus {
  New = 'New',
  Contacted = 'Contacted',
  Qualified = 'Qualified',
  Lost = 'Lost',
  Won = 'Won',
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  company: string;
  status: LeadStatus;
  notes: string;
  updatedAt: string; // ISO string
}

const generatePrompt = (lead: Lead) => `
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

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { lead } = JSON.parse(event.body || '{}') as { lead: Lead };

    if (!lead) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Lead data is required' }),
      };
    }
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey });

    const prompt = generatePrompt(lead);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.7,
        }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: response.text }),
    };
  } catch (error) {
    console.error("Error in Netlify function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to generate AI message: ${errorMessage}` }),
    };
  }
};

export { handler };
