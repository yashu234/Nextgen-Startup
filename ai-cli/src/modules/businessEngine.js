import { ai, TEXT_MODEL } from '../config/gemini.js';
import { BUSINESS_PLAN_PROMPT } from '../prompts/businessPrompt.js';
import { businessPlanSchema } from '../schemas/businessSchema.js';
import { formatPrompt } from '../utils/promptFormatter.js';

export async function generateBusinessPlan(idea) {
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: formatPrompt(BUSINESS_PLAN_PROMPT, { idea }),
    config: { responseMimeType: 'application/json', responseSchema: businessPlanSchema },
  });
  return JSON.parse(response.text || '{}');
}