"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { applyAiOrganizationAction } from "@/modules/catalog/actions";

type Suggestion = { title:string; description:string; category:string; type:string; tags:string[] };

export function AiOrganizer({ itemId, configured }: { itemId:string; configured:boolean }) {
  const [suggestion,setSuggestion]=useState<Suggestion|null>(null);
  const [status,setStatus]=useState("");
  async function analyze(){setStatus("Analizando contenido...");const response=await fetch(`/api/items/${itemId}/organize`,{method:"POST"});const result=await response.json();if(!response.ok){setStatus(result.error??"No se pudo analizar el contenido.");return}setSuggestion(result);setStatus("Análisis listo.")}
  if(!configured)return <div className="empty"><Sparkles/><h2>Gemini no está configurado</h2><p className="subtle">Agrega GEMINI_API_KEY en las variables del servicio para activar sugerencias.</p></div>;
  return <div className="ai-panel"><button className="btn primary" onClick={analyze}><Sparkles size={17}/>Analizar con Gemini</button>{status&&<p aria-live="polite" className="subtle">{status}</p>}{suggestion&&<form action={applyAiOrganizationAction} className="card form-stack"><input type="hidden" name="id" value={itemId}/><label>Título sugerido<input className="field" name="title" defaultValue={suggestion.title}/></label><label>Descripción<input className="field" name="description" defaultValue={suggestion.description}/></label><div className="properties-grid"><label>Categoría<input className="field" name="category" defaultValue={suggestion.category}/></label><label>Tipo<input className="field" name="type" defaultValue={suggestion.type}/></label></div><label>Etiquetas<input className="field" name="tags" defaultValue={suggestion.tags.join(", ")}/></label><p className="subtle">Revisa y modifica las sugerencias antes de aplicarlas.</p><button className="btn dark">Aplicar organización</button></form>}</div>;
}
