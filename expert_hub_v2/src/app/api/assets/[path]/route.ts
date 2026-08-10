import { db } from "@/lib/db";
import { currentUser } from "@/features/auth/session";
import { loadFile } from "@/features/assets/storage";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ path: string }> },
) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "No autorizado" }, { status: 401 });
  const storedPath = decodeURIComponent((await params).path);
  const asset = await db.asset.findFirst({
    where: { path: storedPath, item: { createdById: user.id } },
  });
  if (!asset) return Response.json({ error: "No encontrado" }, { status: 404 });
  try {
    const data = await loadFile(asset.path);
    return new Response(new Uint8Array(data), {
      headers: {
        "content-type": asset.mimeType,
        "content-disposition": `inline; filename="${asset.fileName.replaceAll('"', "")}"`,
        "x-content-type-options": "nosniff",
      },
    });
  } catch {
    return Response.json({ error: "Archivo no disponible" }, { status: 404 });
  }
}
