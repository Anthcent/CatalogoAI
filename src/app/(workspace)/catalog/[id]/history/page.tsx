import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ItemTabs } from "@/components/item-tabs";
import { restoreVersionAction } from "@/modules/catalog/actions";

export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.catalogItem.findUnique({ where: { id }, include: { versions: { orderBy: { version: "desc" } } } });
  if (!item) notFound();
  return <><ItemTabs id={id} active="history"/><main className="page" style={{maxWidth:900}}><span className="eyebrow">{item.publicCode}</span><h1>Historial de versiones</h1><p className="subtle">Al restaurar se conserva el estado actual como una nueva revisión; ningún trabajo se destruye.</p>{item.versions.length?item.versions.map(version=><article className="card version-row" key={version.id}><div><b>Versión {version.version}</b><p className="subtle">{version.summary || "Revisión guardada"} - {version.createdAt.toLocaleString("es")}</p></div><form action={restoreVersionAction}><input type="hidden" name="itemId" value={id}/><input type="hidden" name="versionId" value={version.id}/><button className="btn">Restaurar</button></form></article>):<div className="empty"><h2>No hay versiones anteriores</h2><p className="subtle">Las versiones aparecen después de guardar cambios en el lienzo.</p></div>}</main></>;
}
