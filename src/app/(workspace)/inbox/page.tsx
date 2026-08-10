import { ItemCard } from "@/components/item-card";
import { db } from "@/lib/db";

export default async function InboxPage(){const items=await db.catalogItem.findMany({where:{inInbox:true,archivedAt:null},include:{businesses:{include:{business:true}},type:true,tags:{include:{tag:true}}},orderBy:{createdAt:"desc"}});return <div className="page"><span className="eyebrow">Organize later</span><h1>Inbox</h1><p className="subtle">Quick captures waiting for a little context.</p>{items.length?<div className="grid">{items.map(i=><ItemCard item={i} key={i.id}/>)}</div>:<div className="empty"><h2>Everything is organized</h2><p className="subtle">Your inbox is clear.</p></div>}</div>}
