import { Type } from '@google/genai';

export const marketingSchema = {
  type: Type.OBJECT,
  properties: {
    strategy: {
      type: Type.OBJECT,
      properties: {
        targetAudience: { type: Type.STRING },
        budgetAllocation: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              channel: { type: Type.STRING },
              percent: { type: Type.NUMBER },
            },
          },
        },
        launchSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
        growthStrategy: { type: Type.STRING },
      },
    },
    socialPosts: {
      type: Type.OBJECT,
      properties: {
        instagram: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { hook: { type: Type.STRING }, caption: { type: Type.STRING } },
          },
        },
        twitter: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { hook: { type: Type.STRING }, caption: { type: Type.STRING } },
          },
        },
        facebook: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: { hook: { type: Type.STRING }, caption: { type: Type.STRING } },
          },
        },
      },
    },
    emails: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          subject: { type: Type.STRING },
          body: { type: Type.STRING },
        },
      },
    },
    ads: {
      type: Type.OBJECT,
      properties: {
        googleAds: {
          type: Type.OBJECT,
          properties: {
            headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
            descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        bannerAds: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            copy: { type: Type.STRING },
            cta: { type: Type.STRING },
          },
        },
      },
    },
  },
};