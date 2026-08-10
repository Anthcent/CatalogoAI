import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@/features/auth/session";

export async function GET() {
  if (!(await currentUser()))
    return Response.json({ error: "No autorizado" }, { status: 401 });
  if (!process.env.GEMINI_API_KEY)
    return Response.json(
      { error: "Gemini no está configurado" },
      { status: 503 },
    );
  try {
    const pager = await new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    }).models.list({ config: { pageSize: 100 } });
    const models: { name: string; displayName: string; actions: string[] }[] =
      [];
    for await (const model of pager) {
      if (model.name)
        models.push({
          name: model.name.replace(/^models\//, ""),
          displayName: model.displayName || model.name,
          actions: model.supportedActions ?? [],
        });
    }
    return Response.json({ models });
  } catch (error) {
    console.error("No se pudieron listar los modelos de Gemini", error);
    return Response.json(
      { error: "No se pudieron consultar los modelos disponibles" },
      { status: 503 },
    );
  }
}
