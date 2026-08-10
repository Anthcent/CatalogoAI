import { db } from "@/lib/db";
import { currentUser } from "@/features/auth/session";
import { toMarkdown } from "@/features/export/markdown";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser();
  if (!user) return Response.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const item = await db.catalogItem.findFirst({
    where: { id, createdById: user.id },
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  if (!item) return Response.json({ error: "No encontrado" }, { status: 404 });
  return new Response(toMarkdown(item), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-disposition": `attachment; filename="${item.publicCode}.md"`,
      "x-content-type-options": "nosniff",
    },
  });
}
