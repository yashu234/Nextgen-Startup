import { Type } from '@google/genai';

export const businessPlanSchema = {
  type: Type.OBJECT,
  properties: {
    marketValidation: {
      type: Type.OBJECT,
      properties: {
        demandSummary: { type: Type.STRING },
        growthTrend: { type: Type.STRING },
        tam: { type: Type.STRING },
        sam: { type: Type.STRING },
        som: { type: Type.STRING },
        targetAudience: { type: Type.STRING },
      },
    },
    usp: { type: Type.STRING },
    industryRealityCheck: {
      type: Type.OBJECT,
      properties: {
        whyCompaniesFail: { type: Type.STRING },
        whyWinnersSucceed: { type: Type.STRING },
      },
    },
    roadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          timeline: { type: Type.STRING },
          goal: { type: Type.STRING },
          deliverables: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  },
};