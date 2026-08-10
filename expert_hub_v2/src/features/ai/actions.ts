"use server";

import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";
import { indexItem } from "@/features/search/indexer";
import { summarizeContent } from "./service";

export async function generateSummaryAction(itemId: string) {
  const user = await requireUser();
  const item = await db.catalogItem.findFirst({
    where: { id: itemId, createdById: user.id },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  if (!item) throw new Error("No se encontró el elemento.");
  const summary = await summarizeContent(
    `${item.title}\n${item.description}\n${item.blocks.map((block) => JSON.stringify(block.content)).join("\n")}`,
  );
  await db.catalogItem.update({ where: { id: item.id }, data: { summary } });
  await indexItem(item.id).catch((error) =>
    console.error("Summary indexing failed", error),
  );
  return summary;
}
