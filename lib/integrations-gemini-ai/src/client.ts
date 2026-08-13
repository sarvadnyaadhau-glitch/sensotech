import { GoogleGenAI } from "@google/genai";

let _ai: GoogleGenAI | null = null;

export function isAIConfigured(): boolean {
  return !!(
    process.env.AI_INTEGRATIONS_GEMINI_BASE_URL &&
    process.env.AI_INTEGRATIONS_GEMINI_API_KEY
  );
}

export function getAIClient(): GoogleGenAI {
  if (_ai) return _ai;

  if (!isAIConfigured()) {
    throw new Error("Gemini AI is not configured");
  }

  _ai = new GoogleGenAI({
    apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY!,
    httpOptions: {
      apiVersion: "",
      baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
    },
  });

  return _ai;
}

// Compatibility export: preserve the previous `ai` shape so existing imports keep working.
// The object proxies calls to the lazy-initialized client when used.
export const ai = {
  models: {
    async generateContent(...args: any[]) {
      const client = getAIClient();
      // @ts-ignore - forward to SDK
      return client.models.generateContent(...args);
    },
    // If other model methods are required elsewhere, add proxy methods here.
  },
};
