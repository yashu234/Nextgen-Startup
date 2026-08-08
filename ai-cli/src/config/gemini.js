import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY environment variable is missing!');
}

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
export const TEXT_MODEL = 'gemini-2.5-flash';
export const IMAGE_MODEL = 'imagen-3.0-generate-002';