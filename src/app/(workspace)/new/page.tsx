import { db } from "@/lib/db";
import { QuickCapture } from "@/components/quick-capture";
import { createItemAction } from "@/modules/catalog/actions";

export default async function NewPage({searchParams}:{searchParams:Promise<{mode?:string;template?:string}>}) {
  const {mode,template}=await searchParams; const [templates,businesses]=await Promise.all([db.template.findMany({orderBy:{uses:"desc"}}),db.business.findMany({where:{active:true}})]);
  return <div className="page"><span className="eyebrow">Crea sin fricción</span><h1>{mode==="capture"?"Captura rápida":"Comienza algo útil"}</h1>{mode==="capture"?<QuickCapture/>:<form action={createItemAction} className="card form-stack" style={{maxWidth:700}}><label>Título<input className="field" name="title" placeholder="Conocimiento sin título" autoFocus/></label><label>¿Cómo quieres comenzar?<select className="field" name="templateId" defaultValue={template??""}><option value="">Lienzo en blanco</option>{templates.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select></label><label>Empresa (opcional)<select className="field" name="businessId"><option value="">General / Compartido</option>{businesses.map(b=><option value={b.id} key={b.id}>{b.name}</option>)}</select></label><button className="btn primary">Abrir lienzo</button></form>}</div>;
}
