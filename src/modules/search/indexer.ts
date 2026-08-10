import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { embedTexts } from "@/modules/ai/service";
import { indexableChunks } from "./chunks";
import { cosineSimilarity } from "./similarity";

export async function indexItem(itemId: string) {
  if (!process.env.GEMINI_API_KEY) return { indexed: 0, skipped: true };
  const item = await db.catalogItem.findUnique({ where: { id: itemId }, include: { blocks: { orderBy: { position: "asc" } } } });
  if (!item) return { indexed: 0, skipped: true };
  const chunks = indexableChunks(item);
  const vectors = await embedTexts(chunks.map(chunk => chunk.text), "RETRIEVAL_DOCUMENT");
  await db.$transaction(async transaction => {
    await transaction.embedding.deleteMany({ where: { itemId } });
    for (const [index, chunk] of chunks.entries()) {
      const vector = vectors[index];
      if (!vector?.length) continue;
      await transaction.embedding.create({ data: {
        itemId, sourceType: chunk.sourceType, sourceId: chunk.sourceId,
        textChunk: chunk.text, vector: vector as Prisma.InputJsonValue,
      } });
    }
  });
  return { indexed: vectors.length, skipped: false };
}

export async function semanticMatches(query: string) {
  if (!process.env.GEMINI_API_KEY) return [];
  const [vector] = await embedTexts([query], "RETRIEVAL_QUERY");
  if (!vector?.length) return [];
  const embeddings = await db.embedding.findMany({ select: { itemId: true, textChunk: true, vector: true }, take: 2000 });
  const best = new Map<string, { itemId: string; similarity: number; textChunk: string }>();
  for (const embedding of embeddings) {
    if (!Array.isArray(embedding.vector)) continue;
    const candidate = embedding.vector.map(Number);
    const similarity = cosineSimilarity(vector, candidate);
    if (similarity > (best.get(embedding.itemId)?.similarity ?? -1)) best.set(embedding.itemId, { itemId: embedding.itemId, similarity, textChunk: embedding.textChunk });
  }
  return [...best.values()].sort((a, b) => b.similarity - a.similarity).slice(0, 30);
}
