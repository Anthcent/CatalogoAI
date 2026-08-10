import { ItemCard } from "@/components/item-card";
import { requireUser } from "@/modules/auth/session";
import { searchItems } from "@/modules/search/service";

export default async function SearchPage({searchParams}:{searchParams:Promise<{q?:string}>}) {
  const {q=""}=await searchParams; const user=await requireUser(); const results=q?await searchItems(q,user.id):[];
  return <div className="page"><span className="eyebrow">Search by intent</span><h1>Find what you already know.</h1><form className="hero-search" style={{maxWidth:750}}><input name="q" defaultValue={q} autoFocus placeholder="What are you trying to do?"/><button className="btn dark">Search</button></form>{q&&<><div className="section-title"><h2>{results.length} results</h2><span className="subtle">Ranked by code, title and content</span></div><div className="grid">{results.map(item=><div key={item.id}><ItemCard item={item}/><p className="subtle" style={{fontSize:12,margin:"5px 12px"}}>Why: {item.reason}</p></div>)}</div></>}</div>;
}
