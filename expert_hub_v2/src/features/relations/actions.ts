"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";

export async function createRelationAction(formData: FormData) {
  const user = await requireUser();
  const sourceItemId = String(formData.get("sourceItemId") ?? "");
  const targetItemId = String(formData.get("targetItemId") ?? "");
  const relationType = String(formData.get("relationType") ?? "relacionado con")
    .trim()
    .slice(0, 80);
  if (!sourceItemId || !targetItemId || sourceItemId === targetItemId)
    throw new Error("Elige otro elemento.");
  const allowed = await db.catalogItem.count({
    where: { id: { in: [sourceItemId, targetItemId] }, createdById: user.id },
  });
  if (allowed !== 2) throw new Error("No autorizado.");
  await db.itemRelation.upsert({
    where: {
      sourceItemId_targetItemId_relationType: {
        sourceItemId,
        targetItemId,
        relationType,
      },
    },
    update: {},
    create: { sourceItemId, targetItemId, relationType },
  });
  revalidatePath(`/elementos/${sourceItemId}/relaciones`);
}

export async function deleteRelationAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const relation = await db.itemRelation.findFirst({
    where: { id, source: { createdById: user.id } },
  });
  if (relation) await db.itemRelation.delete({ where: { id } });
  revalidatePath(`/elementos/${relation?.sourceItemId ?? ""}/relaciones`);
}
