import { ItemCard } from "@/components/item-card";
import { db } from "@/lib/db";

export default async function InboxPage(){const items=await db.catalogItem.findMany({where:{inInbox:true,archivedAt:null},include:{businesses:{include:{business:true}},type:true,tags:{include:{tag:true}}},orderBy:{createdAt:"desc"}});return <div className="page"><span className="eyebrow">Organiza después</span><h1>Bandeja</h1><p className="subtle">Capturas rápidas que esperan un poco de contexto.</p>{items.length?<div className="grid">{items.map(i=><ItemCard item={i} key={i.id}/>)}</div>:<div className="empty"><h2>Todo está organizado</h2><p className="subtle">Tu bandeja está vacía.</p></div>}</div>}
