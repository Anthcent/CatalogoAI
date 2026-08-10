import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ItemTabs } from "@/components/item-tabs";
import { createRelationAction, deleteRelationAction } from "@/modules/catalog/actions";

const relationTypes = ["relacionado con", "utiliza", "depende de", "deriva de", "reemplaza", "complementa", "generado a partir de", "pertenece a"];

export default async function RelationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, candidates] = await Promise.all([
    db.catalogItem.findUnique({ where: { id }, include: { outgoing: { include: { target: true }, orderBy: { createdAt: "desc" } }, incoming: { include: { source: true }, orderBy: { createdAt: "desc" } } } }),
    db.catalogItem.findMany({ where: { id: { not: id }, archivedAt: null }, select: { id: true, title: true, publicCode: true }, orderBy: { title: "asc" } }),
  ]);
  if (!item) notFound();
  return <><ItemTabs id={id} active="relations"/><main className="page" style={{maxWidth:900}}><span className="eyebrow">{item.publicCode}</span><h1>Relaciones</h1><form action={createRelationAction} className="card form-stack"><input type="hidden" name="sourceItemId" value={id}/><div className="relation-form"><select className="field" name="relationType">{relationTypes.map(type=><option key={type}>{type}</option>)}</select><select className="field" name="targetItemId" required><option value="">Elige un elemento</option>{candidates.map(candidate=><option value={candidate.id} key={candidate.id}>{candidate.publicCode} - {candidate.title}</option>)}</select><button className="btn primary">Crear relación</button></div></form><div className="section-title"><h2>Relaciones salientes</h2></div>{item.outgoing.length?item.outgoing.map(relation=><div className="card relation-row" key={relation.id}><span className="pill">{relation.relationType}</span><a href={`/catalog/${relation.target.id}`}><b>{relation.target.title}</b><small className="code">{relation.target.publicCode}</small></a><form action={deleteRelationAction}><input type="hidden" name="id" value={relation.id}/><input type="hidden" name="sourceItemId" value={id}/><button className="icon-btn" aria-label="Eliminar relación">Eliminar</button></form></div>):<p className="subtle">Todavía no hay relaciones salientes.</p>}<div className="section-title"><h2>Referenciado por</h2></div>{item.incoming.map(relation=><div className="card relation-row" key={relation.id}><span className="pill">{relation.relationType}</span><a href={`/catalog/${relation.source.id}`}><b>{relation.source.title}</b><small className="code">{relation.source.publicCode}</small></a></div>)}</main></>;
}
