import { GoogleGenAI, Type } from "@google/genai";

export type AiOrganization = { title: string; description: string; category: string; type: string; tags: string[] };

export async function organizeContent(content: string): Promise<AiOrganization> {
  if (!process.env.GEMINI_API_KEY) throw new Error("Gemini is not configured.");
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    contents: `Organize this catalog knowledge:\n\n${content.slice(0, 20000)}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, required: ["title", "description", "category", "type", "tags"], properties: {
      title: { type: Type.STRING }, description: { type: Type.STRING }, category: { type: Type.STRING }, type: { type: Type.STRING }, tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    } } },
  });
  return JSON.parse(response.text ?? "{}") as AiOrganization;
}
