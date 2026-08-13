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
