
import { GoogleGenAI, Type } from "@google/genai";
import { Brand, StrategySectionType } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelFlash = 'gemini-2.5-flash';

export const generateBrandStrategy = async (brand: Brand, context?: string): Promise<Record<string, string>> => {
  let prompt = `
    Act as a world-class brand strategist. Based on the following brand details, generate the core strategic elements.
    
    Brand Name: ${brand.name}
    Niche: ${brand.niche}
    What they sell: ${brand.what_you_sell}
    Who they help: ${brand.who_you_help}
    Transformation: ${brand.transformation}
    Key Differentiator: ${brand.difference}
    Desired Emotions: ${brand.emotions}
    Values: ${brand.values}
    Personality: ${brand.personality}
  `;

  if (context) {
      prompt += `\n\nADDITIONAL CONTEXT (Use this source material as the primary truth):\n${context}\n`;
  }

  prompt += `
    Return a JSON object with the following keys (and text content values):
    - purpose
    - mission
    - vision
    - positioning
    - uvp
    - brand_promise
    - brand_archetype
    - tone_of_voice
    - brand_story
    - brand_manifesto
    - campaign_framework
    - messaging_pillars
    - content_pillars
    - creative_direction
    - ethics
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            purpose: { type: Type.STRING },
            mission: { type: Type.STRING },
            vision: { type: Type.STRING },
            positioning: { type: Type.STRING },
            uvp: { type: Type.STRING },
            brand_promise: { type: Type.STRING },
            brand_archetype: { type: Type.STRING },
            tone_of_voice: { type: Type.STRING },
            brand_story: { type: Type.STRING },
            brand_manifesto: { type: Type.STRING },
            campaign_framework: { type: Type.STRING },
            messaging_pillars: { type: Type.STRING },
            content_pillars: { type: Type.STRING },
            creative_direction: { type: Type.STRING },
            ethics: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Error generating strategy:", error);
    throw error;
  }
};

export const analyzeBrandText = async (text: string): Promise<{
  brand: Omit<Brand, 'id'>;
  identity: { image_style: string; video_style: string; do_nots: string };
}> => {
  const prompt = `
    Analyze the following brand document/text and extract the core brand attributes into a structured format.
    
    BRAND DOCUMENT:
    ${text}
    
    Return a JSON object containing a "brand" object and an "identity" object.
    
    Required Brand Fields: name, tagline, niche, what_you_sell, who_you_help, transformation, difference, emotions, values, personality.
    Required Identity Fields: image_style, video_style, do_nots.
    
    If specific fields are missing in the text, infer them based on the context or leave them as "Not specified".
  `;

  const response = await ai.models.generateContent({
      model: modelFlash,
      contents: prompt,
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  brand: {
                      type: Type.OBJECT,
                      properties: {
                          name: { type: Type.STRING },
                          tagline: { type: Type.STRING },
                          niche: { type: Type.STRING },
                          what_you_sell: { type: Type.STRING },
                          who_you_help: { type: Type.STRING },
                          transformation: { type: Type.STRING },
                          difference: { type: Type.STRING },
                          emotions: { type: Type.STRING },
                          values: { type: Type.STRING },
                          personality: { type: Type.STRING },
                      }
                  },
                  identity: {
                      type: Type.OBJECT,
                      properties: {
                          image_style: { type: Type.STRING },
                          video_style: { type: Type.STRING },
                          do_nots: { type: Type.STRING },
                      }
                  }
              }
          }
      }
  });

  return JSON.parse(response.text || "{}");
};

export const regenerateStrategySection = async (
  brand: Brand,
  sectionType: StrategySectionType,
  currentContent: string,
  instruction: string = "Improve and refine this."
): Promise<string> => {
  const prompt = `
    Context: You are a brand strategist for "${brand.name}".
    Brand Personality: ${brand.personality}.
    
    Task: Rewrite the "${sectionType}" section.
    Current Content: "${currentContent}"
    
    Instruction: ${instruction}
    
    Return ONLY the new content text. Do not add markdown formatting or conversational filler.
  `;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
  });

  return response.text || "";
};

export const generateMoodboardPrompts = async (brand: Brand, identityDescription: string): Promise<string[]> => {
  const prompt = `
    Create 5 distinct, high-quality AI image generation prompts (for Midjourney/DALL-E) to create a moodboard for a brand.
    
    Brand Name: ${brand.name}
    Personality: ${brand.personality}
    Emotions: ${brand.emotions}
    Visual Style Description: ${identityDescription}
    
    Return a JSON object with a key "prompts" which is an array of strings.
  `;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prompts: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  const data = JSON.parse(response.text || "{\"prompts\": []}");
  return data.prompts;
};

export const generateVisualRules = async (brand: Brand): Promise<{dos: string, donts: string}> => {
    const prompt = `
      Based on the brand "${brand.name}" (Personality: ${brand.personality}), generate a list of "Visual Do's" and "Visual Don'ts" to ensure brand consistency.
      
      Return JSON: { "dos": "string (bullet points)", "donts": "string (bullet points)" }
    `;

    const response = await ai.models.generateContent({
        model: modelFlash,
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text || "{}");
}

export const generateContentIdeas = async (
  brand: Brand,
  pillarName: string,
  platform: string,
  count: number = 5
): Promise<Array<{ hook: string; outline: string }>> => {
  const prompt = `
    Generate ${count} content ideas for the brand "${brand.name}".
    
    Context:
    - Niche: ${brand.niche}
    - Content Pillar: ${pillarName}
    - Target Platform: ${platform}
    - Tone: ${brand.personality}
    
    Return a JSON object with a key "ideas", where each item has "hook" and "outline".
  `;

  const response = await ai.models.generateContent({
    model: modelFlash,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          ideas: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                outline: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const data = JSON.parse(response.text || "{\"ideas\": []}");
  return data.ideas;
};
