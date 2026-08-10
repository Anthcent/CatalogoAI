"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/features/auth/session";

export type SettingsState = { saved: boolean; error: string | null };

export async function saveAiSettingsAction(
  _: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await requireUser();
  const generationModel = String(formData.get("generationModel") ?? "").replace(
    /^models\//,
    "",
  );
  const embeddingModel = String(formData.get("embeddingModel") ?? "").replace(
    /^models\//,
    "",
  );
  if (!generationModel || !embeddingModel)
    return { saved: false, error: "Selecciona ambos modelos." };
  const values = {
    generation_model: generationModel,
    embedding_model: embeddingModel,
    semantic_search_enabled: String(formData.get("semanticSearch") === "true"),
    automatic_summaries_enabled: String(
      formData.get("automaticSummaries") === "true",
    ),
  };
  await db.$transaction(
    Object.entries(values).map(([key, value]) =>
      db.appSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    ),
  );
  revalidatePath("/configuracion/ia");
  return { saved: true, error: null };
}
