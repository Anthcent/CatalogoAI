import Link from "next/link";
import { ArrowRight, BookOpen, Inbox, LayoutTemplate, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { ItemCard } from "@/components/item-card";

export default async function HomePage() {
  const [recent,total,inbox,favorites]=await Promise.all([
    db.catalogItem.findMany({where:{archivedAt:null},include:{businesses:{include:{business:true}},type:true,tags:{include:{tag:true}}},orderBy:{updatedAt:"desc"},take:6}),
    db.catalogItem.count({where:{archivedAt:null}}),db.catalogItem.count({where:{inInbox:true,archivedAt:null}}),db.catalogItem.count({where:{favorite:true,archivedAt:null}}),
  ]);
  return <div className="page"><section className="hero"><div><span className="eyebrow">Your operational memory</span><h1>What do you want<br/>to build today?</h1><form action="/search" className="hero-search"><input name="q" placeholder="Try: resources for a JavaScript class"/><button className="btn dark">Explore <ArrowRight size={17}/></button></form></div><div className="stats"><div className="card stat"><span className="subtle">Knowledge</span><strong>{total}</strong></div><div className="card stat"><span className="subtle">Inbox</span><strong>{inbox}</strong></div><div className="card stat"><span className="subtle">Favorites</span><strong>{favorites}</strong></div></div></section>
  <div className="quick-grid"><Link className="card quick" href="/new"><Plus/><b>New item</b></Link><Link className="card quick" href="/new?mode=capture"><Inbox/><b>Quick capture</b></Link><Link className="card quick" href="/templates"><LayoutTemplate/><b>Use template</b></Link><Link className="card quick" href="/catalog"><BookOpen/><b>Browse catalog</b></Link></div>
  <div className="section-title"><h2>Recently touched</h2><Link href="/catalog" className="subtle">View all</Link></div>{recent.length?<div className="grid">{recent.map(item=><ItemCard key={item.id} item={item}/>)}</div>:<div className="empty"><h2>Your catalog is ready</h2><p className="subtle">Create your first item or capture something quickly.</p><Link className="btn primary" href="/new">Create item</Link></div>}</div>;
}
