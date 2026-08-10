"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";
import { organizeContent } from "@/features/ai/service";
import { indexItem } from "@/features/search/indexer";

async function code() {
  return `EXP-${randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`;
}

export async function quickCaptureAction(formData: FormData) {
  const user = await requireUser();
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;
  await db.catalogItem.create({
    data: {
      publicCode: await code(),
      title: content.slice(0, 90),
      description: content.slice(0, 240),
      createdById: user.id,
      inInbox: true,
      blocks: {
        create: {
          type: "text",
          position: 0,
          content: { text: content, span: 12 },
        },
      },
    },
  });
  revalidatePath("/bandeja");
}

function selected(formData: FormData) {
  return [
    ...new Set(formData.getAll("itemIds").map(String).filter(Boolean)),
  ].slice(0, 100);
}

export async function archiveInboxAction(formData: FormData) {
  const user = await requireUser();
  await db.catalogItem.updateMany({
    where: { id: { in: selected(formData) }, createdById: user.id },
    data: { archivedAt: new Date() },
  });
  revalidatePath("/bandeja");
  revalidatePath("/catalogo");
}

export async function convertInboxAction(formData: FormData) {
  const user = await requireUser();
  await db.catalogItem.updateMany({
    where: { id: { in: selected(formData) }, createdById: user.id },
    data: { inInbox: false },
  });
  revalidatePath("/bandeja");
  revalidatePath("/catalogo");
}

export async function deleteInboxAction(formData: FormData) {
  const user = await requireUser();
  await db.catalogItem.deleteMany({
    where: {
      id: { in: selected(formData) },
      createdById: user.id,
      inInbox: true,
    },
  });
  revalidatePath("/bandeja");
  revalidatePath("/catalogo");
}

export async function classifyInboxAction(formData: FormData) {
  const user = await requireUser();
  const ids = selected(formData);
  const items = await db.catalogItem.findMany({
    where: { id: { in: ids }, createdById: user.id, inInbox: true },
    include: { blocks: true },
  });
  for (const item of items) {
    const source = `${item.title}\n${item.description}\n${item.blocks.map((block) => JSON.stringify(block.content)).join("\n")}`;
    const suggestion = await organizeContent(source);
    await db.$transaction(async (transaction) => {
      const category = suggestion.category
        ? await transaction.category.upsert({
            where: { name: suggestion.category },
            update: {},
            create: { name: suggestion.category },
          })
        : null;
      const type = suggestion.type
        ? await transaction.itemType.upsert({
            where: { name: suggestion.type },
            update: {},
            create: { name: suggestion.type },
          })
        : null;
      await transaction.catalogItem.update({
        where: { id: item.id },
        data: {
          title: suggestion.title,
          description: suggestion.description,
          categoryId: category?.id,
          typeId: type?.id,
          inInbox: false,
        },
      });
      for (const raw of suggestion.tags) {
        const name = raw.trim().toLowerCase();
        if (!name) continue;
        const tag = await transaction.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        await transaction.itemTag.upsert({
          where: { itemId_tagId: { itemId: item.id, tagId: tag.id } },
          update: {},
          create: { itemId: item.id, tagId: tag.id },
        });
      }
    });
    await indexItem(item.id).catch((error) =>
      console.error("Inbox indexing failed", error),
    );
  }
  revalidatePath("/bandeja");
  revalidatePath("/catalogo");
}
