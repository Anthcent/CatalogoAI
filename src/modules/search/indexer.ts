import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { embedTexts } from "@/modules/ai/service";
import { indexableChunks } from "./chunks";

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
      await transaction.$executeRawUnsafe(
        `INSERT INTO "Embedding" ("id", "itemId", "sourceType", "sourceId", "textChunk", "vector") VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6::vector)`,
        randomUUID(), itemId, chunk.sourceType, chunk.sourceId, chunk.text, `[${vector.join(",")}]`,
      );
    }
  });
  return { indexed: vectors.length, skipped: false };
}

export async function semanticMatches(query: string) {
  if (!process.env.GEMINI_API_KEY) return [];
  const [vector] = await embedTexts([query], "RETRIEVAL_QUERY");
  if (!vector?.length) return [];
  return db.$queryRawUnsafe<{ itemId: string; similarity: number; textChunk: string }[]>(
    `SELECT "itemId", MAX(1 - ("vector" <=> $1::vector))::double precision AS similarity, MIN("textChunk") AS "textChunk" FROM "Embedding" WHERE "vector" IS NOT NULL GROUP BY "itemId" ORDER BY similarity DESC LIMIT 30`,
    `[${vector.join(",")}]`,
  );
}
