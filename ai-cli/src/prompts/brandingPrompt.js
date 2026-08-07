export const BRANDING_PROMPT = `You are an elite Brand Strategist and Creative Director.
Startup concept: {idea}

Generate a branding package strictly grounded in this concept — no generic filler.
Return ONLY valid JSON, no markdown fences, matching this schema:
{
  "tagline": "string, under 10 words, high-converting",
  "missionStatement": "string, 1-2 sentences",
  "coreValues": [ { "title": "string", "description": "1 sentence" } ],
  "logoPrompt": "detailed prompt for a flat vector logo, isolated on white background, no text unless specified",
  "colors": [ { "name": "string", "hex": "#RRGGBB", "usage": "primary/secondary/accent" } ]
}`;