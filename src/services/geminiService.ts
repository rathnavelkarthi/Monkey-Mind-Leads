import { Lead } from '../types';

export const generateWhatsAppMessage = async (lead: Lead): Promise<string> => {
  try {
    const response = await fetch('/api/generate-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lead }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Use a more specific error message from the server function if available
      throw new Error(errorData.error || `Failed to get a response from the server.`);
    }

    const data = await response.json();
    if (!data.message) {
      throw new Error("Received an empty message from the server.");
    }
    return data.message;
  } catch (error) {
    console.error("Error calling generate-message function:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(`Failed to generate AI-powered message. ${errorMessage}`);
  }
};
