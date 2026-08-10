import { ItemCard } from "@/components/item-card";
import { requireUser } from "@/modules/auth/session";
import { searchItems } from "@/modules/search/service";

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const {q=""}=await searchParams; const user=await requireUser(); const results=q?await searchItems(q,user.id):[];
  return <div className="page"><span className="eyebrow">Busca por intención</span><h1>Encuentra lo que ya sabes.</h1><form className="hero-search" style={{maxWidth:750}}><input name="q" defaultValue={q} autoFocus placeholder="¿Qué estás intentando hacer?"/><button className="btn dark">Buscar</button></form>{q&&<><div className="section-title"><h2>{results.length} resultados</h2><span className="subtle">Ordenados por código, título y contenido</span></div><div className="grid">{results.map(item=><div key={item.id}><ItemCard item={item}/><p className="subtle" style={{fontSize:12,margin:"5px 12px"}}>Motivo: {item.reason}</p></div>)}</div></>}</div>;
}
