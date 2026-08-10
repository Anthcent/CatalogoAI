import Link from "next/link";
import { Star } from "lucide-react";

type ItemCardProps = { item: { id:string; publicCode:string; title:string; description:string; favorite:boolean; updatedAt:Date; status?:{name:string}|null; type?:{name:string}|null; businesses?:{business:{name:string;color:string}}[]; tags?:{tag:{name:string}}[] } };

export function ItemCard({ item }: ItemCardProps) {
  return <Link className="card" href={`/catalog/${item.id}`}>
    <div className="card-top"><span className="code">{item.publicCode}</span>{item.favorite && <Star size={16} fill="currentColor" color="#d9563f"/>}</div>
    <h3 style={{margin:"17px 0 8px"}}>{item.title}</h3>
    <p className="subtle" style={{minHeight:42}}>{item.description || "No description yet."}</p>
    <div>{item.businesses?.slice(0,2).map(({business})=><span className="pill" key={business.name} style={{borderColor:business.color}}>{business.name}</span>)}</div>
    <div style={{marginTop:14}}>{item.tags?.slice(0,4).map(({tag})=><span className="tag" key={tag.name}>#{tag.name}</span>)}</div>
    <div className="row" style={{marginTop:16,fontSize:12,color:"var(--muted)"}}><span>{item.type?.name ?? "Unclassified"}</span><span>{item.updatedAt.toLocaleDateString()}</span></div>
  </Link>;
}
