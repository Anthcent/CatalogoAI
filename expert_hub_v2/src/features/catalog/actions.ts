"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";

async function uniqueCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `EXP-${randomBytes(4).toString("hex").slice(0, 6).toUpperCase()}`;
    if (!(await db.catalogItem.findUnique({ where: { publicCode: code } })))
      return code;
  }
  throw new Error("No se pudo generar un código único.");
}

export async function createItemAction(formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") ?? "").trim() || "Sin título";
  const templateId = String(formData.get("templateId") ?? "");
  const businessId = String(formData.get("businessId") ?? "");
  const template = templateId
    ? await db.template.findUnique({ where: { id: templateId } })
    : null;
  const structure = Array.isArray(template?.structure)
    ? (template.structure as {
        type?: string;
        content?: Record<string, unknown>;
      }[])
    : [{ type: "text", content: { text: "" } }];
  const item = await db.catalogItem.create({
    data: {
      publicCode: await uniqueCode(),
      title,
      createdById: user.id,
      typeId: template?.typeId,
      businesses: businessId ? { create: { businessId } } : undefined,
      blocks: {
        create: structure.map((block, position) => ({
          type:
            block.type === "paragraph" || block.type === "heading"
              ? "text"
              : (block.type ?? "text"),
          position,
          content: {
            ...(block.content ?? {}),
            title: String(
              block.content?.text ?? (position ? "Contenido" : "Resumen"),
            ),
            span: 12,
          } as Prisma.InputJsonValue,
        })),
      },
    },
  });
  if (template)
    await db.template.update({
      where: { id: template.id },
      data: { uses: { increment: 1 } },
    });
  redirect(`/elementos/${item.id}`);
}
