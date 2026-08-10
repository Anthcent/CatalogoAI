import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ItemTabs } from "@/components/item-tabs";
import { AiOrganizer } from "@/components/ai-organizer";

export default async function AiPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const item=await db.catalogItem.findUnique({where:{id},select:{publicCode:true,title:true}});if(!item)notFound();return <><ItemTabs id={id} active="ai"/><main className="page" style={{maxWidth:900}}><span className="eyebrow">{item.publicCode}</span><h1>Asistente de organización</h1><p className="subtle">Gemini analiza el lienzo y propone un título, descripción, categoría, tipo y etiquetas. Nada cambia sin tu confirmación.</p><AiOrganizer itemId={id} configured={Boolean(process.env.GEMINI_API_KEY)}/></main></>}
