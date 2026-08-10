import { db } from "@/lib/db";
import { ItemCard } from "@/components/item-card";
import Link from "next/link";

export default async function CatalogPage({searchParams}:{searchParams:Promise<{business?:string;type?:string;status?:string;q?:string}>}) {
  const p=await searchParams;
  const [items,businesses,types,statuses]=await Promise.all([
    db.catalogItem.findMany({where:{archivedAt:null,title:p.q?{contains:p.q,mode:"insensitive"}:undefined,businesses:p.business?{some:{businessId:p.business}}:undefined,typeId:p.type||undefined,statusId:p.status||undefined},include:{businesses:{include:{business:true}},type:true,status:true,tags:{include:{tag:true}}},orderBy:{updatedAt:"desc"}}),
    db.business.findMany({where:{active:true}}),db.itemType.findMany(),db.status.findMany({orderBy:{order:"asc"}}),
  ]);
  return <div className="page"><span className="eyebrow">Todo en un solo lugar</span><h1>Catálogo</h1><form className="filters"><input className="field" style={{maxWidth:260}} name="q" defaultValue={p.q} placeholder="Filtrar por título"/><select className="field" style={{maxWidth:200}} name="business" defaultValue={p.business}><option value="">Todas las empresas</option>{businesses.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><select className="field" style={{maxWidth:180}} name="type" defaultValue={p.type}><option value="">Todos los tipos</option>{types.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><select className="field" style={{maxWidth:180}} name="status" defaultValue={p.status}><option value="">Todos los estados</option>{statuses.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><button className="btn dark">Aplicar</button><Link className="btn" href="/catalog">Limpiar filtros</Link></form><p className="subtle">{items.length} elementos</p>{items.length?<div className="grid">{items.map(item=><ItemCard key={item.id} item={item}/>)}</div>:<div className="empty"><h2>Nada coincide con estos filtros</h2><p className="subtle">Limpia los filtros o crea nuevo conocimiento.</p></div>}</div>;
}
