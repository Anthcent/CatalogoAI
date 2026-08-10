"use client";

import Image from "next/image";
import { Copy } from "lucide-react";
import { RichTextEditor } from "./rich-text-editor";

type Content = Record<string, unknown>;
type ChecklistItem = { text: string; checked: boolean };
type StepItem = { title: string; description: string; done: boolean };

export function BlockContentEditor({ type, content, onChange }: { type: string; content: Content; onChange: (content: Content) => void }) {
  const field = (key: string, value: unknown) => onChange({ ...content, [key]: value });
  if (type === "prompt") return <div className="special-block prompt-block">
    <div className="prompt-heading"><input value={String(content.name ?? "")} onChange={e=>field("name",e.target.value)} placeholder="Nombre del prompt" className="block-title-input"/><button type="button" className="btn" onClick={()=>navigator.clipboard.writeText(String(content.text??""))}><Copy size={15}/> Copiar prompt</button></div>
    <textarea value={String(content.text ?? "")} onChange={e=>field("text",e.target.value)} placeholder="Escribe el prompt principal..." rows={6}/>
    <div className="block-fields"><label>Modelo<input value={String(content.model ?? "")} onChange={e=>field("model",e.target.value)} placeholder="Gemini"/></label><label>Variables<input value={String(content.variables ?? "")} onChange={e=>field("variables",e.target.value)} placeholder="tema, estilo, cantidad"/></label></div>
    <label>Instrucciones adicionales<textarea value={String(content.instructions ?? "")} onChange={e=>field("instructions",e.target.value)} rows={2}/></label>
    <label>Ejemplo de resultado<textarea value={String(content.example ?? "")} onChange={e=>field("example",e.target.value)} rows={2}/></label>
    <label>Notas<textarea value={String(content.notes ?? "")} onChange={e=>field("notes",e.target.value)} rows={2}/></label>
  </div>;
  if (type === "checklist") {
    const items = (content.items as ChecklistItem[] | undefined) ?? [];
    const update = (index:number, patch:Partial<ChecklistItem>) => field("items",items.map((item,i)=>i===index?{...item,...patch}:item));
    return <div className="item-list">{items.map((item,index)=><div className="list-entry" key={index}><input type="checkbox" checked={item.checked} onChange={e=>update(index,{checked:e.target.checked})}/><input value={item.text} onChange={e=>update(index,{text:e.target.value})} placeholder="Tarea pendiente"/><button type="button" className="icon-btn" onClick={()=>field("items",items.filter((_,i)=>i!==index))}>×</button></div>)}<button type="button" className="inline-add" onClick={()=>field("items",[...items,{text:"",checked:false}])}>+ Agregar tarea</button></div>;
  }
  if (type === "steps") {
    const items = (content.items as StepItem[] | undefined) ?? [];
    const update = (index:number, patch:Partial<StepItem>) => field("items",items.map((item,i)=>i===index?{...item,...patch}:item));
    return <div className="item-list">{items.map((item,index)=><div className="step-entry" key={index}><b>{index+1}</b><div><input value={item.title} onChange={e=>update(index,{title:e.target.value})} placeholder="Nombre del paso"/><textarea value={item.description} onChange={e=>update(index,{description:e.target.value})} placeholder="Descripción, enlace o nota" rows={2}/></div><input type="checkbox" checked={item.done} onChange={e=>update(index,{done:e.target.checked})} aria-label="Paso completado"/><button type="button" className="icon-btn" onClick={()=>field("items",items.filter((_,i)=>i!==index))}>×</button></div>)}<button type="button" className="inline-add" onClick={()=>field("items",[...items,{title:"",description:"",done:false}])}>+ Agregar paso</button></div>;
  }
  if (type === "table") {
    const rows = (content.rows as string[][] | undefined) ?? [[""]];
    const cell = (row:number,column:number,value:string) => field("rows",rows.map((cells,r)=>r===row?cells.map((current,c)=>c===column?value:current):cells));
    return <div className="table-editor"><table><tbody>{rows.map((cells,row)=><tr key={row}>{cells.map((value,column)=><td key={column}><input value={value} onChange={e=>cell(row,column,e.target.value)} placeholder={row===0?"Encabezado":"Dato"}/></td>)}</tr>)}</tbody></table><div><button type="button" className="inline-add" onClick={()=>field("rows",[...rows,Array(rows[0]?.length||1).fill("")])}>+ Fila</button><button type="button" className="inline-add" onClick={()=>field("rows",rows.map(row=>[...row,""]))}>+ Columna</button></div></div>;
  }
  if (type === "link") return <div className="block-fields"><input value={String(content.title??"")} onChange={e=>field("title",e.target.value)} placeholder="Título del enlace"/><input value={String(content.url??"")} onChange={e=>field("url",e.target.value)} placeholder="https://..."/><textarea value={String(content.notes??"")} onChange={e=>field("notes",e.target.value)} placeholder="¿Para qué sirve?" rows={2}/></div>;
  if (type === "image") return <div className="image-block"><input value={String(content.url??"")} onChange={e=>field("url",e.target.value)} placeholder="URL de la imagen o recurso adjunto"/>{Boolean(content.url)&&<Image unoptimized width={800} height={450} src={String(content.url)} alt={String(content.caption??"")}/>}<input value={String(content.caption??"")} onChange={e=>field("caption",e.target.value)} placeholder="Descripción de la imagen"/></div>;
  if (type === "code") return <div className="code-editor"><input value={String(content.language??"")} onChange={e=>field("language",e.target.value)} placeholder="Lenguaje"/><textarea value={String(content.text??"")} onChange={e=>field("text",e.target.value)} placeholder="Pega o escribe el código..." rows={8} spellCheck={false}/></div>;
  if(type==="paragraph")return <RichTextEditor html={String(content.html??content.text??"")} onChange={html=>{const {text:_,...rest}=content;void _;onChange({...rest,html})}}/>;
  const heading = type === "heading";
  return heading?<input className="block-title-input" value={String(content.text??"")} onChange={e=>field("text",e.target.value)} placeholder="Título"/>:<textarea value={String(content.text??"")} onChange={e=>field("text",e.target.value)} placeholder={type==="callout"?"Información importante...":"Comienza a escribir..."}/>;
}
