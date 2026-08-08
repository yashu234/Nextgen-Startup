import { ai, IMAGE_MODEL } from '../config/gemini.js';

export async function generateLogo(logoPrompt, idea) {
  try {
    const response = await ai.models.generateImages({
      model: IMAGE_MODEL,
      prompt: logoPrompt || `Minimalist flat vector logo for ${idea}`,
      config: { numberOfImages: 1, aspectRatio: '1:1', outputMimeType: 'image/jpeg' },
    });

    const logoBase64 = response.generatedImages?.[0]?.image?.imageBytes;
    return logoBase64 ? `data:image/jpeg;base64,${logoBase64}` : 'https://placehold.co/400x400/0f172a/ffffff?text=Logo';
  } catch (error) {
    console.warn('⚠️ Logo generation failed, using fallback:', error);
    return 'https://placehold.co/400x400/0f172a/ffffff?text=Logo';
  }
}