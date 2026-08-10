import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ItemTabs } from "@/components/item-tabs";
import { updatePropertiesAction } from "@/modules/catalog/actions";

export default async function PropertiesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [item, businesses, types, categories, statuses] = await Promise.all([
    db.catalogItem.findUnique({ where: { id }, include: { businesses: true, tags: { include: { tag: true } } } }),
    db.business.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    db.itemType.findMany({ orderBy: { name: "asc" } }),
    db.category.findMany({ where: { archivedAt: null }, orderBy: { name: "asc" } }),
    db.status.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!item) notFound();
  const selectedBusinesses = new Set(item.businesses.map(entry => entry.businessId));
  return <><ItemTabs id={id} active="properties"/><main className="page" style={{maxWidth:900}}>
    <span className="eyebrow">{item.publicCode}</span><h1>Propiedades</h1>
    <form action={updatePropertiesAction} className="card form-stack"><input type="hidden" name="id" value={id}/>
      <div className="properties-grid">
        <label>Tipo<select className="field" name="typeId" defaultValue={item.typeId ?? ""}><option value="">Sin clasificar</option>{types.map(type=><option value={type.id} key={type.id}>{type.name}</option>)}</select></label>
        <label>Categoría<select className="field" name="categoryId" defaultValue={item.categoryId ?? ""}><option value="">Sin categoría</option>{categories.map(category=><option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
        <label>Estado<select className="field" name="statusId" defaultValue={item.statusId ?? ""}><option value="">Sin estado</option>{statuses.map(status=><option value={status.id} key={status.id}>{status.name}</option>)}</select></label>
      </div>
      <fieldset><legend>Empresas</legend><div className="check-grid">{businesses.map(business=><label className="check-card" key={business.id}><input type="checkbox" name="businessIds" value={business.id} defaultChecked={selectedBusinesses.has(business.id)}/><span style={{color:business.color}}>{business.name}</span></label>)}</div></fieldset>
      <label>Etiquetas<input className="field" name="tags" defaultValue={item.tags.map(entry=>entry.tag.name).join(", ")} placeholder="stickers, impresión, gemini"/><small className="subtle">Separa las etiquetas con comas.</small></label>
      <fieldset><legend>Flujo de trabajo</legend><div className="check-grid"><label className="check-card"><input type="checkbox" name="favorite" defaultChecked={item.favorite}/> Favorito</label><label className="check-card"><input type="checkbox" name="inInbox" defaultChecked={item.inInbox}/> Mantener en bandeja</label><label className="check-card"><input type="checkbox" name="archived" defaultChecked={Boolean(item.archivedAt)}/> Archivado</label></div></fieldset>
      <button className="btn primary">Guardar propiedades</button>
    </form>
  </main></>;
}
