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
      // The server responded with an error. We need to figure out if it's a
      // structured JSON error from our function, or an HTML page from Netlify.
      let errorMessage = `Request failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        // If we get here, it's a JSON error from our function.
        errorMessage = errorData.error || JSON.stringify(errorData);
      } catch (e) {
        // If response.json() fails, it's not JSON. It's likely an HTML error page.
        const textResponse = await response.text();
        if (textResponse && textResponse.toLowerCase().includes('<!doctype html')) {
          errorMessage = `Server returned an HTML error page (status ${response.status}). This can happen if the API route is not found. Check the Netlify function logs.`;
        } else {
          errorMessage = textResponse || `An unknown server error occurred.`;
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
