import { ai, TEXT_MODEL } from '../config/gemini.js';
import { LANDING_PAGE_PROMPT } from '../prompts/landingPrompt.js';
import { formatPrompt } from '../utils/promptFormatter.js';

export async function generateLandingPage(idea, brandingContext) {
  const prompt = formatPrompt(LANDING_PAGE_PROMPT, {
    idea,
    brandingOutput: JSON.stringify(brandingContext),
  });

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
  });

  return (response.text || '')
    .replace(/^```html\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}