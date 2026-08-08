import { ai, TEXT_MODEL } from '../config/gemini.js';
import { BRANDING_PROMPT } from '../prompts/brandingPrompt.js';
import { brandingSchema } from '../schemas/brandingSchema.js';
import { formatPrompt } from '../utils/promptFormatter.js';

export async function generateBranding(idea) {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: formatPrompt(BRANDING_PROMPT, { idea }),
    config: { responseMimeType: 'application/json', responseSchema: brandingSchema },
  });
  return JSON.parse(response.text || '{}');
}