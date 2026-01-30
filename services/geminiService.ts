
import { GoogleGenAI, Type } from "@google/genai";
import { Gender } from "../types";

const API_KEY = process.env.API_KEY || '';

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

/**
 * Analyzes the uploaded image for gender and quality checks.
 */
export async function analyzeFace(imageBase64: string): Promise<{ gender: Gender; isClear: boolean; message?: string }> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1] || imageBase64,
          },
        },
        {
          text: `Analyze this photo for a professional headshot application.
          1. Detect the gender (male or female).
          2. Check if the face is clear, front-facing, and suitable for editing.
          Return JSON format: { "gender": "male" | "female", "isClear": boolean, "reason": "string if not clear" }`,
        },
      ],
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          gender: { type: Type.STRING, enum: ['male', 'female'] },
          isClear: { type: Type.BOOLEAN },
          reason: { type: Type.STRING },
        },
        required: ['gender', 'isClear'],
      },
    },
  });

  try {
    const result = JSON.parse(response.text || '{}');
    return {
      gender: result.gender === 'male' ? Gender.MALE : Gender.FEMALE,
      isClear: result.isClear,
      message: result.reason,
    };
  } catch (e) {
    console.error("Failed to parse analysis result", e);
    return { gender: Gender.UNKNOWN, isClear: false, message: "Could not analyze the image." };
  }
}

/**
 * Generates the professional portrait.
 */
export async function generatePortrait(
  imageBase64: string,
  gender: Gender,
  outfitPrompt: string
): Promise<string> {
  const ai = getGeminiClient();
  
  const systemPrompt = `You are a professional image editing assistant. 
  Rules:
  - Detect the face and work ONLY on that face. 
  - DO NOT change identity, age, gender, or facial features. 
  - Remove original background completely; replace with clean, light gray professional studio background.
  - Head and pose correction: If tilted, rotate head upright and centered.
  - Lighting: Brighten face and improve contrast naturally.
  - Quality: Upscale and enhance resolution while maintaining eye/skin color.
  - Outfit: ${outfitPrompt}
  - Output: High-res, photorealistic, professional portrait. No watermarks. No text.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64.split(',')[1] || imageBase64,
          },
        },
        {
          text: "Apply the professional headshot rules to this image. " + outfitPrompt,
        },
      ],
    },
    config: {
      // @ts-ignore - Some newer fields might not be in older SDK types
      systemInstruction: systemPrompt,
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data returned from Gemini.");
}
