import { db } from "@/lib/db";
import { ItemCard } from "@/components/item-card";
import Link from "next/link";

export default async function CatalogPage({searchParams}:{searchParams:Promise<{business?:string;type?:string;status?:string;q?:string}>}) {
  const p=await searchParams;
  const [items,businesses,types,statuses]=await Promise.all([
    db.catalogItem.findMany({where:{archivedAt:null,title:p.q?{contains:p.q,mode:"insensitive"}:undefined,businesses:p.business?{some:{businessId:p.business}}:undefined,typeId:p.type||undefined,statusId:p.status||undefined},include:{businesses:{include:{business:true}},type:true,status:true,tags:{include:{tag:true}}},orderBy:{updatedAt:"desc"}}),
    db.business.findMany({where:{active:true}}),db.itemType.findMany(),db.status.findMany({orderBy:{order:"asc"}}),
  ]);
  return <div className="page"><span className="eyebrow">Everything in one place</span><h1>Catalog</h1><form className="filters"><input className="field" style={{maxWidth:260}} name="q" defaultValue={p.q} placeholder="Filter by title"/><select className="field" style={{maxWidth:200}} name="business" defaultValue={p.business}><option value="">All businesses</option>{businesses.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><select className="field" style={{maxWidth:180}} name="type" defaultValue={p.type}><option value="">All types</option>{types.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><select className="field" style={{maxWidth:180}} name="status" defaultValue={p.status}><option value="">All statuses</option>{statuses.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select><button className="btn dark">Apply</button><Link className="btn" href="/catalog">Clear filters</Link></form><p className="subtle">{items.length} items</p>{items.length?<div className="grid">{items.map(item=><ItemCard key={item.id} item={item}/>)}</div>:<div className="empty"><h2>Nothing matches these filters</h2><p className="subtle">Clear filters or create new knowledge.</p></div>}</div>;
}
