"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { requireUser } from "@/modules/auth/session";

export async function createTemplateAction(formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const structureText = String(formData.get("structure") ?? "");
  if (!name) throw new Error("Template name is required.");
  const headings = structureText.split("\n").map((line) => line.trim()).filter(Boolean);
  const structure = (headings.length ? headings : [""]).map((text, index) => ({ type: index === 0 ? "heading" : "paragraph", content: { text } })) as Prisma.InputJsonValue;
  await db.template.create({ data: {
    name, description, structure,
    businessId: String(formData.get("businessId") ?? "") || null,
    typeId: String(formData.get("typeId") ?? "") || null,
  } });
  revalidatePath("/templates"); redirect("/templates");
}

export async function deleteTemplateAction(formData: FormData) {
  await requireUser();
  await db.template.delete({ where: { id: String(formData.get("id") ?? "") } });
  revalidatePath("/templates");
}
