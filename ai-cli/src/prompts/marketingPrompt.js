export const MARKETING_PROMPT = `You are a Chief Marketing Officer.
Startup concept: {idea}

Generate a marketing engine specific to this idea and industry. Return ONLY valid JSON matching this schema:
{
  "strategy": {
    "targetAudience": "string",
    "budgetAllocation": [ { "channel": "string", "percent": 0 } ],
    "launchSteps": ["string", "string", "string"],
    "growthStrategy": "string"
  },
  "socialPosts": {
    "instagram": [ { "hook": "string", "caption": "string" } ],
    "twitter": [ { "hook": "string", "caption": "string" } ],
    "facebook": [ { "hook": "string", "caption": "string" } ]
  },
  "emails": [
    { "type": "Welcome", "subject": "string", "body": "string" },
    { "type": "Value Pitch", "subject": "string", "body": "string" },
    { "type": "Re-engagement", "subject": "string", "body": "string" }
  ],
  "ads": {
    "googleAds": { "headlines": ["string"], "descriptions": ["string"], "keywords": ["string"] },
    "bannerAds": { "headline": "string", "copy": "string", "cta": "string" }
  }
}
Note: Ensure budgetAllocation percentages sum to 100. Provide exactly 3 items for each social network array.`;