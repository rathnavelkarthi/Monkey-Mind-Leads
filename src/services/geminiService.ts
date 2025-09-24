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
      // The server responded with an error. Read the body as text ONCE.
      const errorBody = await response.text();
      let errorMessage = `Request failed with status: ${response.status}`;
      
      try {
        // Try to parse the text as JSON.
        const errorData = JSON.parse(errorBody);
        // If it's a structured error from our function, use that message.
        errorMessage = errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // If parsing fails, it's not JSON. It's likely an HTML error page.
        if (errorBody && errorBody.toLowerCase().includes('<!doctype html')) {
          errorMessage = `Server returned an HTML error page (status ${response.status}). This can happen if the API route is not found. Check the Netlify function logs.`;
        } else {
          // Otherwise, it's just some other text response.
          errorMessage = errorBody || `An unknown server error occurred.`;
        }
      }
      throw new Error(errorMessage);
    }

    // If the response was successful, parse the JSON.
    const data = await response.json();
    if (!data.message) {
      throw new Error("Received a valid response, but it contained an empty message.");
    }
    return data.message;
  } catch (error) {
    console.error("Error in generateWhatsAppMessage service:", error);
    // Re-throw a user-friendly error message. The component will display this.
    const message = error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`Failed to generate AI-powered message. ${message}`);
  }
};