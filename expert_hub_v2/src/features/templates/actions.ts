"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";

export async function createTemplateAction(formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const sections = String(formData.get("sections") ?? "")
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean)
    .slice(0, 30);
  if (!name || !sections.length)
    throw new Error("Indica un nombre y al menos una sección.");
  await db.template.create({
    data: {
      name,
      description,
      businessId: String(formData.get("businessId") ?? "") || null,
      typeId: String(formData.get("typeId") ?? "") || null,
      structure: sections.map((title, index) => ({
        type: "text",
        content: { text: "", title, span: index === 0 ? 12 : 6 },
      })),
    },
  });
  redirect("/plantillas");
}
