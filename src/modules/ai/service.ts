import { GoogleGenAI, Type } from "@google/genai";

export type AiOrganization = { title: string; description: string; category: string; type: string; tags: string[] };

function client() {
  if (!process.env.GEMINI_API_KEY) throw new Error("Gemini no está configurado.");
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function organizeContent(content: string): Promise<AiOrganization> {
  const ai = client();
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    contents: `Organiza este conocimiento de catálogo. Responde completamente en español, con una descripción breve y etiquetas concisas:\n\n${content.slice(0, 20000)}`,
    config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, required: ["title", "description", "category", "type", "tags"], properties: {
      title: { type: Type.STRING }, description: { type: Type.STRING }, category: { type: Type.STRING }, type: { type: Type.STRING }, tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    } } },
  });
  return JSON.parse(response.text ?? "{}") as AiOrganization;
}

export async function embedTexts(contents: string[], taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY") {
  if (!contents.length) return [];
  const response = await client().models.embedContent({
    model: process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001",
    contents,
    config: { outputDimensionality: 768, taskType },
  });
  return (response.embeddings ?? []).map(embedding => embedding.values ?? []);
}
