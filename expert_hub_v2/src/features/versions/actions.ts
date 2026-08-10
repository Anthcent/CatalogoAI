"use server";

import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";

export async function restoreVersionAction(formData: FormData) {
  const user = await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  const versionId = String(formData.get("versionId") ?? "");
  await db.$transaction(async (transaction) => {
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${itemId}))`;
    const [item, historical] = await Promise.all([
      transaction.catalogItem.findFirst({
        where: { id: itemId, createdById: user.id },
        include: {
          blocks: { orderBy: { position: "asc" } },
          versions: { orderBy: { version: "desc" }, take: 1 },
        },
      }),
      transaction.itemVersion.findFirst({ where: { id: versionId, itemId } }),
    ]);
    if (
      !item ||
      !historical ||
      !historical.snapshot ||
      typeof historical.snapshot !== "object" ||
      Array.isArray(historical.snapshot)
    )
      throw new Error("No se encontró la versión.");
    const snapshot = historical.snapshot as {
      title?: unknown;
      description?: unknown;
      blocks?: unknown;
    };
    const blocks = Array.isArray(snapshot.blocks)
      ? (snapshot.blocks as {
          id?: unknown;
          type?: unknown;
          content?: unknown;
        }[])
      : [];
    await transaction.itemVersion.create({
      data: {
        itemId,
        version: (item.versions[0]?.version ?? 0) + 1,
        summary: `Antes de restaurar v${historical.version}`,
        snapshot: {
          title: item.title,
          description: item.description,
          blocks: item.blocks,
        } as Prisma.InputJsonValue,
      },
    });
    const historicalIds = new Set(
      blocks
        .map((block) => block.id)
        .filter((id): id is string => typeof id === "string"),
    );
    const removedIds = item.blocks
      .filter((block) => !historicalIds.has(block.id))
      .map((block) => block.id);
    if (removedIds.length)
      await transaction.block.deleteMany({
        where: { id: { in: removedIds }, itemId },
      });
    for (const block of item.blocks.filter((block) =>
      historicalIds.has(block.id),
    )) {
      await transaction.block.update({
        where: { id: block.id },
        data: { position: block.position + 1000 },
      });
    }
    await transaction.catalogItem.update({
      where: { id: itemId },
      data: {
        title: typeof snapshot.title === "string" ? snapshot.title : item.title,
        description:
          typeof snapshot.description === "string"
            ? snapshot.description
            : item.description,
      },
    });
    const currentById = new Map(item.blocks.map((block) => [block.id, block]));
    for (const [position, block] of blocks.entries()) {
      const data = {
        type: typeof block.type === "string" ? block.type : "text",
        position,
        content: (block.content ?? {}) as Prisma.InputJsonValue,
      };
      const current =
        typeof block.id === "string" ? currentById.get(block.id) : undefined;
      if (current)
        await transaction.block.update({ where: { id: current.id }, data });
      else
        await transaction.block.create({
          data: {
            ...data,
            itemId,
            ...(typeof block.id === "string" ? { id: block.id } : {}),
          },
        });
    }
  });
  redirect(`/elementos/${itemId}`);
}
