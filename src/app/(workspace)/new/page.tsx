import { db } from "@/lib/db";
import { QuickCapture } from "@/components/quick-capture";
import { createItemAction } from "@/modules/catalog/actions";

export default async function NewPage({searchParams}:{searchParams:Promise<{mode?:string;template?:string}>}) {
  const {mode,template}=await searchParams; const [templates,businesses]=await Promise.all([db.template.findMany({orderBy:{uses:"desc"}}),db.business.findMany({where:{active:true}})]);
  return <div className="page"><span className="eyebrow">Create without friction</span><h1>{mode==="capture"?"Quick capture":"Start something useful"}</h1>{mode==="capture"?<QuickCapture/>:<form action={createItemAction} className="card form-stack" style={{maxWidth:700}}><label>Title<input className="field" name="title" placeholder="Untitled knowledge" autoFocus/></label><label>How do you want to begin?<select className="field" name="templateId" defaultValue={template??""}><option value="">Blank canvas</option>{templates.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select></label><label>Business (optional)<select className="field" name="businessId"><option value="">General / Shared</option>{businesses.map(b=><option value={b.id} key={b.id}>{b.name}</option>)}</select></label><button className="btn primary">Open canvas</button></form>}</div>;
}
