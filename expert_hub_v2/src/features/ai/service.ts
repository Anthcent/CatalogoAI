import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";
import { getSetting } from "@/features/settings/service";

const organizationSchema = z.object({
  title: z.string().min(1).max(240),
  description: z.string().max(1000),
  category: z.string().max(120),
  type: z.string().max(120),
  tags: z.array(z.string().max(60)).max(20),
});

function client() {
  if (!process.env.GEMINI_API_KEY)
    throw new Error("Gemini no está configurado.");
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

export async function organizeContent(content: string) {
  const response = await client().models.generateContent({
    model: await getSetting(
      "generation_model",
      process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    ),
    contents: `Organiza este conocimiento. Responde en español con descripción breve y etiquetas concisas:\n\n${content.slice(0, 20_000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        required: ["title", "description", "category", "type", "tags"],
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          type: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
      },
    },
  });
  return organizationSchema.parse(JSON.parse(response.text ?? "{}"));
}

export async function embedTexts(
  contents: string[],
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY",
) {
  if (!contents.length) return [];
  const response = await client().models.embedContent({
    model: await getSetting(
      "embedding_model",
      process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001",
    ),
    contents,
    config: { outputDimensionality: 768, taskType },
  });
  return (response.embeddings ?? []).map((embedding) => embedding.values ?? []);
}

export async function summarizeContent(content: string) {
  const response = await client().models.generateContent({
    model: await getSetting(
      "generation_model",
      process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    ),
    contents: `Resume el siguiente elemento en español. Devuelve un solo párrafo claro y concreto, sin encabezados, de máximo 600 caracteres:\n\n${content.slice(0, 20_000)}`,
  });
  const summary = (response.text ?? "").trim().slice(0, 600);
  if (!summary) throw new Error("Gemini no devolvió un resumen.");
  return summary;
}
