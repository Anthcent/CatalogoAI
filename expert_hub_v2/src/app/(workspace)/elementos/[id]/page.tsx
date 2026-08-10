import { notFound } from "next/navigation";
import { CanvasView } from "@/features/canvas/canvas-view";
import { getCanvasItem } from "@/features/catalog/queries";
import { requireUser } from "@/features/auth/session";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const result = await getCanvasItem(id, user.id);
  if (!result) notFound();
  return <CanvasView item={result.item} initialBlocks={result.blocks} />;
}
