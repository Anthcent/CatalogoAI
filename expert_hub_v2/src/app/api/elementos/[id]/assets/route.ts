import { db } from "@/lib/db";
import { currentUser } from "@/features/auth/session";
import { removeFile, storeFile } from "@/features/assets/storage";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  if (
    !(await db.catalogItem.findFirst({
      where: { id, createdById: user.id },
      select: { id: true },
    }))
  )
    return Response.json({ error: "No encontrado" }, { status: 404 });
  const file = (await request.formData()).get("file");
  if (!(file instanceof File))
    return Response.json({ error: "Selecciona un archivo" }, { status: 400 });
  let stored: Awaited<ReturnType<typeof storeFile>> | null = null;
  try {
    stored = await storeFile(file);
    const asset = await db.asset.create({
      data: { itemId: id, storageType: "local", ...stored },
    });
    return Response.json(asset, { status: 201 });
  } catch (error) {
    if (stored) await removeFile(stored.path).catch(() => undefined);
    return Response.json(
      { error: error instanceof Error ? error.message : "Falló la carga" },
      { status: 400 },
    );
  }
}
