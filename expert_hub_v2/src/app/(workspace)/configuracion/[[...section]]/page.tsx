import { SettingsView } from "@/features/settings/settings-view";
import { getBooleanSetting, getSetting } from "@/features/settings/service";
export default async function SettingsPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  const [generationModel, embeddingModel, semantic, automaticSummaries] =
    await Promise.all([
      getSetting(
        "generation_model",
        process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      ),
      getSetting(
        "embedding_model",
        process.env.GEMINI_EMBEDDING_MODEL ?? "gemini-embedding-001",
      ),
      getBooleanSetting("semantic_search_enabled", true),
      getBooleanSetting("automatic_summaries_enabled", true),
    ]);
  return (
    <SettingsView
      initial={section?.[0] ?? "perfil"}
      ai={{
        configured: Boolean(process.env.GEMINI_API_KEY),
        generationModel,
        embeddingModel,
        semantic,
        automaticSummaries,
      }}
    />
  );
}
