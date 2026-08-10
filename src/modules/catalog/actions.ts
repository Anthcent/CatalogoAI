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
  throw new Error("No se pudo generar un código público único.");
}

export async function createItemAction(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "Sin título").trim() || "Sin título";
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
    publicCode: await uniqueCode(), title: String(formData.get("title") ?? "").trim() || "Captura rápida",
    description: content.slice(0, 240), createdById: user.id, inInbox: true,
    blocks: { create: { type: content.startsWith("http") ? "link" : "paragraph", position: 0, content: { text: content, url: content.startsWith("http") ? content : undefined } } },
  } });
  revalidatePath("/"); revalidatePath("/inbox");
}

export async function saveItemAction(input: { id: string; title: string; description: string; blocks: BlockDraft[] }) {
  await requireUser();
  const existing = await db.catalogItem.findUnique({ where: { id: input.id }, include: { blocks: true, versions: { orderBy: { version: "desc" }, take: 1 } } });
  if (!existing) throw new Error("No se encontró el elemento.");
  const snapshot = { title: existing.title, description: existing.description, blocks: existing.blocks };
  await db.$transaction([
    db.itemVersion.create({ data: { itemId: input.id, version: (existing.versions[0]?.version ?? 0) + 1, summary: "Actualización del lienzo", snapshot } }),
    db.block.deleteMany({ where: { itemId: input.id } }),
    db.catalogItem.update({ where: { id: input.id }, data: {
      title: input.title.trim() || "Sin título", description: input.description,
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
  const relationType = String(formData.get("relationType") ?? "relacionado con");
  if (!sourceItemId || !targetItemId || sourceItemId === targetItemId) throw new Error("Elige un elemento de destino diferente.");
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
  if (!item || !historical) throw new Error("No se encontró la versión.");
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

export async function addExternalLinkAction(formData: FormData) {
  await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  try { new URL(url); } catch { throw new Error("Ingresa una URL válida."); }
  await db.externalLink.create({ data: { itemId, title: title || new URL(url).hostname, url } });
  revalidatePath(`/catalog/${itemId}/resources`);
}

export async function deleteExternalLinkAction(formData: FormData) {
  await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  await db.externalLink.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath(`/catalog/${itemId}/resources`);
}

export async function deleteAssetAction(formData: FormData) {
  await requireUser();
  const itemId = String(formData.get("itemId") ?? "");
  const asset = await db.asset.delete({ where: { id: String(formData.get("id") ?? "") } });
  if (asset.storageType === "local") {
    const { LocalStorageProvider } = await import("@/modules/storage/local");
    await new LocalStorageProvider().delete(asset.path).catch(error => console.error("No se pudo eliminar el archivo físico", error));
  }
  revalidatePath(`/catalog/${itemId}/resources`);
}

export async function applyAiOrganizationAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryName = String(formData.get("category") ?? "").trim();
  const typeName = String(formData.get("type") ?? "").trim();
  const tags = [...new Set(String(formData.get("tags") ?? "").split(",").map(tag=>tag.trim().toLowerCase()).filter(Boolean))].slice(0,30);
  await db.$transaction(async transaction => {
    const category = categoryName ? await transaction.category.upsert({ where: { name: categoryName }, update: {}, create: { name: categoryName } }) : null;
    const type = typeName ? await transaction.itemType.upsert({ where: { name: typeName }, update: {}, create: { name: typeName } }) : null;
    await transaction.catalogItem.update({ where: { id }, data: { title: title || undefined, description: description || undefined, categoryId: category?.id, typeId: type?.id, inInbox: false } });
    for (const name of tags) {
      const tag = await transaction.tag.upsert({ where: { name }, update: {}, create: { name } });
      await transaction.itemTag.upsert({ where: { itemId_tagId: { itemId: id, tagId: tag.id } }, update: {}, create: { itemId: id, tagId: tag.id } });
    }
  });
  revalidatePath(`/catalog/${id}`); revalidatePath(`/catalog/${id}/properties`); revalidatePath("/inbox");
  redirect(`/catalog/${id}/properties`);
}

export async function composeItemsAction(formData: FormData) {
  const user = await requireUser();
  const sourceIds = [...new Set(formData.getAll("itemIds").map(String).filter(Boolean))];
  if (sourceIds.length < 2) throw new Error("Selecciona al menos dos elementos para combinarlos.");
  const sources = await db.catalogItem.findMany({ where: { id: { in: sourceIds }, archivedAt: null }, include: { blocks: { orderBy: { position: "asc" } } } });
  if (sources.length < 2) throw new Error("No se encontraron suficientes elementos disponibles.");
  const combinedBlocks = sources.flatMap(source => [
    { type: "heading", content: { text: `${source.publicCode} · ${source.title}` } as Prisma.InputJsonValue },
    ...source.blocks.map(block => ({ type: block.type, content: block.content as Prisma.InputJsonValue })),
    { type: "callout", content: { text: `Contenido incorporado desde ${source.publicCode}` } as Prisma.InputJsonValue },
  ]);
  const item = await db.catalogItem.create({ data: {
    publicCode: await uniqueCode(), title: String(formData.get("title") ?? "").trim() || `Composición de ${sources.length} elementos`,
    description: `Creado a partir de ${sources.map(source=>source.publicCode).join(", ")}.`, createdById: user.id,
    blocks: { create: combinedBlocks.map((block, position) => ({ ...block, position })) },
    outgoing: { create: sources.map(source => ({ targetItemId: source.id, relationType: "generado a partir de" })) },
  } });
  redirect(`/catalog/${item.id}`);
}
