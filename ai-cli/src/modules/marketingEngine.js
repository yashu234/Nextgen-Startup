import { ai, TEXT_MODEL } from '../config/gemini.js';
import { MARKETING_PROMPT } from '../prompts/marketingPrompt.js';
import { marketingSchema } from '../schemas/marketingSchema.js';
import { formatPrompt } from '../utils/promptFormatter.js';

export async function generateMarketingStrategy(idea) {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: formatPrompt(MARKETING_PROMPT, { idea }),
    config: { responseMimeType: 'application/json', responseSchema: marketingSchema },
  });
  return JSON.parse(response.text || '{}');
}