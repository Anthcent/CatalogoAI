import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";

export default async function TemplatesPage(){const templates=await db.template.findMany({include:{business:true,type:true},orderBy:{uses:"desc"}});return <div className="page"><div className="row"><div><span className="eyebrow">Reusable structures</span><h1>Templates</h1></div><Link className="btn primary" href="/templates/new"><Plus size={17}/>Build template</Link></div><div className="grid">{templates.map(t=><Link href={`/new?template=${t.id}`} className="card" key={t.id}><span className="pill">{t.type?.name??"Flexible"}</span><h2 style={{marginTop:22}}>{t.name}</h2><p className="subtle">{t.description}</p><small>{t.uses} uses</small></Link>)}</div></div>}
