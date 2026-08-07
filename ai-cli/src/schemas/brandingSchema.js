import { Type } from '@google/genai';

export const brandingSchema = {
  type: Type.OBJECT,
  properties: {
    tagline: { type: Type.STRING },
    missionStatement: { type: Type.STRING },
    coreValues: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
      },
    },
    logoPrompt: { type: Type.STRING },
    colors: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          hex: { type: Type.STRING },
          usage: { type: Type.STRING },
        },
      },
    },
  },
};