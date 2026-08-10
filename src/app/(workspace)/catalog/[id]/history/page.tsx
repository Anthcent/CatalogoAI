import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ItemTabs } from "@/components/item-tabs";
import { restoreVersionAction } from "@/modules/catalog/actions";

export default async function HistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.catalogItem.findUnique({ where: { id }, include: { versions: { orderBy: { version: "desc" } } } });
  if (!item) notFound();
  return <><ItemTabs id={id} active="history"/><main className="page" style={{maxWidth:900}}><span className="eyebrow">{item.publicCode}</span><h1>Version history</h1><p className="subtle">Restoring keeps the current state as a new revision, so no work is destroyed.</p>{item.versions.length?item.versions.map(version=><article className="card version-row" key={version.id}><div><b>Version {version.version}</b><p className="subtle">{version.summary || "Saved revision"} - {version.createdAt.toLocaleString()}</p></div><form action={restoreVersionAction}><input type="hidden" name="itemId" value={id}/><input type="hidden" name="versionId" value={version.id}/><button className="btn">Restore</button></form></article>):<div className="empty"><h2>No previous versions</h2><p className="subtle">Versions appear after canvas changes are saved.</p></div>}</main></>;
}
