import Link from "next/link";
import { ArrowRight, BookOpen, Inbox, LayoutTemplate, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { ItemCard } from "@/components/item-card";

export default async function HomePage() {
  const [recent,total,inbox,favorites]=await Promise.all([
    db.catalogItem.findMany({where:{archivedAt:null},include:{businesses:{include:{business:true}},type:true,tags:{include:{tag:true}}},orderBy:{updatedAt:"desc"},take:6}),
    db.catalogItem.count({where:{archivedAt:null}}),db.catalogItem.count({where:{inInbox:true,archivedAt:null}}),db.catalogItem.count({where:{favorite:true,archivedAt:null}}),
  ]);
  return <div className="page"><section className="hero"><div><span className="eyebrow">Tu memoria operativa</span><h1>¿Qué quieres construir<br/>hoy?</h1><form action="/search" className="hero-search"><input name="q" placeholder="Ejemplo: recursos para una clase de JavaScript"/><button className="btn dark">Explorar <ArrowRight size={17}/></button></form></div><div className="stats"><div className="card stat"><span className="subtle">Conocimiento</span><strong>{total}</strong></div><div className="card stat"><span className="subtle">Bandeja</span><strong>{inbox}</strong></div><div className="card stat"><span className="subtle">Favoritos</span><strong>{favorites}</strong></div></div></section>
  <div className="quick-grid"><Link className="card quick" href="/new"><Plus/><b>Nuevo elemento</b></Link><Link className="card quick" href="/new?mode=capture"><Inbox/><b>Captura rápida</b></Link><Link className="card quick" href="/templates"><LayoutTemplate/><b>Usar plantilla</b></Link><Link className="card quick" href="/catalog"><BookOpen/><b>Explorar catálogo</b></Link></div>
  <div className="section-title"><h2>Modificados recientemente</h2><Link href="/catalog" className="subtle">Ver todos</Link></div>{recent.length?<div className="grid">{recent.map(item=><ItemCard key={item.id} item={item}/>)}</div>:<div className="empty"><h2>Tu catálogo está listo</h2><p className="subtle">Crea tu primer elemento o registra algo rápidamente.</p><Link className="btn primary" href="/new">Crear elemento</Link></div>}</div>;
}
