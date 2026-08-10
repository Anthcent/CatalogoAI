"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { blockTypes } from "./types";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";
import { indexItem } from "@/features/search/indexer";

const blockSchema = z.object({
  id: z.uuid(),
  type: z.enum(blockTypes),
  title: z.string().max(120),
  span: z.union([z.literal(4), z.literal(6), z.literal(8), z.literal(12)]),
  content: z.record(z.string(), z.unknown()),
});

const canvasSchema = z.object({
  id: z.uuid(),
  title: z.string().trim().min(1).max(240),
  blocks: z.array(blockSchema).max(100),
});

export async function saveCanvasAction(input: z.input<typeof canvasSchema>) {
  const user = await requireUser();
  const data = canvasSchema.parse(input);
  const version = await db.$transaction(async (transaction) => {
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${data.id}))`;
    const existing = await transaction.catalogItem.findFirst({
      where: { id: data.id, createdById: user.id },
      include: {
        blocks: { orderBy: { position: "asc" } },
        versions: { orderBy: { version: "desc" }, take: 1 },
      },
    });
    if (!existing) throw new Error("No se encontró el elemento.");
    const nextVersion = (existing.versions[0]?.version ?? 0) + 1;
    await transaction.itemVersion.create({
      data: {
        itemId: data.id,
        version: nextVersion,
        summary: "Actualización del lienzo V2",
        snapshot: {
          title: existing.title,
          description: existing.description,
          blocks: existing.blocks,
        } as Prisma.InputJsonValue,
      },
    });
    const incomingIds = new Set(data.blocks.map((block) => block.id));
    const removedIds = existing.blocks
      .filter((block) => !incomingIds.has(block.id))
      .map((block) => block.id);
    if (removedIds.length)
      await transaction.block.deleteMany({
        where: { itemId: data.id, id: { in: removedIds } },
      });
    for (const block of existing.blocks) {
      if (incomingIds.has(block.id))
        await transaction.block.update({
          where: { id: block.id },
          data: { position: block.position + 1000 },
        });
    }
    await transaction.catalogItem.update({
      where: { id: data.id },
      data: { title: data.title },
    });
    const existingIds = new Set(existing.blocks.map((block) => block.id));
    for (const [position, block] of data.blocks.entries()) {
      const content = {
        ...block.content,
        title: block.title,
        span: block.span,
      } as Prisma.InputJsonValue;
      if (existingIds.has(block.id)) {
        await transaction.block.update({
          where: { id: block.id },
          data: { type: block.type, position, content },
        });
      } else {
        await transaction.block.create({
          data: {
            id: block.id,
            itemId: data.id,
            type: block.type,
            position,
            content,
          },
        });
      }
    }
    return nextVersion;
  });
  await indexItem(data.id).catch((error) =>
    console.error("Semantic indexing failed", error),
  );
  revalidatePath(`/elementos/${data.id}`);
  revalidatePath("/catalogo");
  return { savedAt: new Date().toISOString(), version };
}
