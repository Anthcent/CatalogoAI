import { db } from "@/lib/db";
import { createTemplateAction } from "@/modules/templates/actions";

export default async function NewTemplatePage() {
  const [businesses, types] = await Promise.all([db.business.findMany({ where: { active: true } }), db.itemType.findMany({ orderBy: { name: "asc" } })]);
  return <main className="page"><span className="eyebrow">Reusable structure</span><h1>Build a template</h1><form action={createTemplateAction} className="card form-stack" style={{maxWidth:750}}><label>Name<input className="field" name="name" required autoFocus/></label><label>Description<textarea className="field" name="description" rows={3}/></label><div className="relation-form"><label>Recommended business<select className="field" name="businessId"><option value="">Any business</option>{businesses.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label><label>Recommended type<select className="field" name="typeId"><option value="">Any type</option>{types.map(x=><option value={x.id} key={x.id}>{x.name}</option>)}</select></label></div><label>Initial sections<textarea className="field" name="structure" rows={9} placeholder={"Objective\nMaterials\nSteps\nResult\nNotes"}/><small className="subtle">One section per line. The structure is copied when an item is created.</small></label><button className="btn primary">Save template</button></form></main>;
}
