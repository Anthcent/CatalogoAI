"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/modules/auth/session";
import { generatePublicCode } from "./code";
import type { BlockDraft } from "./types";
import type { Prisma } from "@/generated/prisma/client";
import { indexItem } from "@/modules/search/indexer";

async function uniqueCode() {
  for (let i = 0; i < 5; i++) {
    const code = generatePublicCode();
    if (!(await db.catalogItem.findUnique({ where: { publicCode: code } }))) return code;
  }
  throw new Error("Could not generate a unique public code.");
}

export async function createItemAction(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "Untitled").trim() || "Untitled";
  const templateId = String(formData.get("templateId") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const template = templateId ? await db.template.findUnique({ where: { id: templateId } }) : null;
  const structure = (template?.structure as unknown as BlockDraft[] | null) ?? [{ type: "paragraph", content: { text: "" } }];
  const item = await db.catalogItem.create({
    data: {
      publicCode: await uniqueCode(), title, createdById: user.id, typeId: template?.typeId,
      businesses: businessId ? { create: { businessId } } : undefined,
      blocks: { create: structure.map((block, position) => ({ type: block.type, position, content: block.content as Prisma.InputJsonValue })) },
    },
  });
  if (template) await db.template.update({ where: { id: template.id }, data: { uses: { increment: 1 } } });
  redirect(`/catalog/${item.id}`);
}

export async function quickCaptureAction(formData: FormData) {
  const user = await requireUser();
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;
  await db.catalogItem.create({ data: {
    publicCode: await uniqueCode(), title: String(formData.get("title") ?? "").trim() || "Quick capture",
    description: content.slice(0, 240), createdById: user.id, inInbox: true,
    blocks: { create: { type: content.startsWith("http") ? "link" : "paragraph", position: 0, content: { text: content, url: content.startsWith("http") ? content : undefined } } },
  } });
  revalidatePath("/"); revalidatePath("/inbox");
}

export async function saveItemAction(input: { id: string; title: string; description: string; blocks: BlockDraft[] }) {
  await requireUser();
  const existing = await db.catalogItem.findUnique({ where: { id: input.id }, include: { blocks: true, versions: { orderBy: { version: "desc" }, take: 1 } } });
  if (!existing) throw new Error("Item not found.");
  const snapshot = { title: existing.title, description: existing.description, blocks: existing.blocks };
  await db.$transaction([
    db.itemVersion.create({ data: { itemId: input.id, version: (existing.versions[0]?.version ?? 0) + 1, summary: "Canvas update", snapshot } }),
    db.block.deleteMany({ where: { itemId: input.id } }),
    db.catalogItem.update({ where: { id: input.id }, data: {
      title: input.title.trim() || "Untitled", description: input.description,
      blocks: { create: input.blocks.map((b, position) => ({ type: b.type, position, content: b.content as Prisma.InputJsonValue })) },
    } }),
  ]);
  revalidatePath(`/catalog/${input.id}`); revalidatePath("/catalog");
  await indexItem(input.id).catch(error => console.error("Semantic indexing failed", error));
  return { savedAt: new Date().toISOString() };
}

export async function toggleFavoriteAction(id: string) {
  await requireUser();
  const item = await db.catalogItem.findUniqueOrThrow({ where: { id }, select: { favorite: true } });
  await db.catalogItem.update({ where: { id }, data: { favorite: !item.favorite } });
  revalidatePath("/catalog");
}

export async function archiveItemAction(id: string) {
  await requireUser();
  await db.catalogItem.update({ where: { id }, data: { archivedAt: new Date() } });
  revalidatePath("/catalog");
}

export async function createRelationAction(formData: FormData) {
  await requireUser();
  const sourceItemId = String(formData.get("sourceItemId") ?? "");
  const targetItemId = String(formData.get("targetItemId") ?? "");
  const relationType = String(formData.get("relationType") ?? "related to");
  if (!sourceItemId || !targetItemId || sourceItemId === targetItemId) throw new Error("Choose a different target item.");
  await db.itemRelation.upsert({
    where: { sourceItemId_targetItemId_relationType: { sourceItemId, targetItemId, relationType } },
    update: {}, create: { sourceItemId, targetItemId, relationType },
  });
  revalidatePath(`/catalog/${sourceItemId}/relations`);
}

export async function deleteRelationAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const sourceItemId = String(formData.get("sourceItemId") ?? "");
  await db.itemRelation.delete({ where: { id } });
  revalidatePath(`/catalog/${sourceItemId}/relations`);
}

export async function restoreVersionAction(formData: FormData) {
  await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  const versionId = String(formData.get("versionId") ?? "");
  const [item, historical] = await Promise.all([
    db.catalogItem.findUnique({ where: { id: itemId }, include: { blocks: { orderBy: { position: "asc" } }, versions: { orderBy: { version: "desc" }, take: 1 } } }),
    db.itemVersion.findFirst({ where: { id: versionId, itemId } }),
  ]);
  if (!item || !historical) throw new Error("Version not found.");
  const snapshot = historical.snapshot as { title: string; description: string; blocks: { type: string; content: Prisma.JsonValue }[] };
  const currentSnapshot = { title: item.title, description: item.description, blocks: item.blocks } as Prisma.InputJsonValue;
  await db.$transaction([
    db.itemVersion.create({ data: { itemId, version: (item.versions[0]?.version ?? 0) + 1, summary: `Before restoring version ${historical.version}`, snapshot: currentSnapshot } }),
    db.block.deleteMany({ where: { itemId } }),
    db.catalogItem.update({ where: { id: itemId }, data: {
      title: snapshot.title, description: snapshot.description,
      blocks: { create: snapshot.blocks.map((block, position) => ({ type: block.type, position, content: block.content as Prisma.InputJsonValue })) },
    } }),
  ]);
  revalidatePath(`/catalog/${itemId}`); revalidatePath(`/catalog/${itemId}/history`);
  redirect(`/catalog/${itemId}`);
}

export async function updatePropertiesAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const tags = [...new Set(String(formData.get("tags") ?? "").split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 30);
  const businessIds = formData.getAll("businessIds").map(String).filter(Boolean);
  await db.$transaction(async transaction => {
    await transaction.catalogItem.update({ where: { id }, data: {
      typeId: String(formData.get("typeId") ?? "") || null,
      categoryId: String(formData.get("categoryId") ?? "") || null,
      statusId: String(formData.get("statusId") ?? "") || null,
      favorite: formData.get("favorite") === "on",
      inInbox: formData.get("inInbox") === "on",
      archivedAt: formData.get("archived") === "on" ? new Date() : null,
    } });
    await transaction.itemBusiness.deleteMany({ where: { itemId: id } });
    if (businessIds.length) await transaction.itemBusiness.createMany({ data: businessIds.map(businessId => ({ itemId: id, businessId })), skipDuplicates: true });
    await transaction.itemTag.deleteMany({ where: { itemId: id } });
    for (const name of tags) {
      const tag = await transaction.tag.upsert({ where: { name }, update: {}, create: { name } });
      await transaction.itemTag.create({ data: { itemId: id, tagId: tag.id } });
    }
  });
  revalidatePath(`/catalog/${id}`); revalidatePath(`/catalog/${id}/properties`); revalidatePath("/catalog"); revalidatePath("/inbox");
  redirect(`/catalog/${id}`);
}
