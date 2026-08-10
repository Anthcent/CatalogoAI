"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { saveItemAction } from "@/modules/catalog/actions";
import { blockTypes, type BlockDraft } from "@/modules/catalog/types";
import { createBlockContent } from "@/modules/catalog/types";
import { BlockContentEditor } from "./block-content-editor";

type Props = { item: { id:string; publicCode:string; title:string; description:string; favorite:boolean; blocks:{id:string;type:string;content:unknown}[]; type?:{name:string}|null; status?:{name:string}|null; category?:{name:string}|null; businesses?:{business:{name:string}}[]; assets?:{id:string}[]; links?:{id:string}[] } };
const toolGroups = [{label:"Contenido",types:["paragraph","heading","callout","code"]},{label:"Registro",types:["checklist","steps","prompt","table"]},{label:"Recursos",types:["link","image"]}];

export function CanvasEditor({ item }: Props) {
  const [title,setTitle]=useState(item.title); const [description,setDescription]=useState(item.description);
  const [blocks,setBlocks]=useState<BlockDraft[]>(item.blocks.map(b=>({id:b.id,type:b.type,content:b.content as Record<string,unknown>})));
  const [status,setStatus]=useState("Guardado"); const [pending,startTransition]=useTransition();
  const [toolsOpen,setToolsOpen]=useState(true);
  const [selected,setSelected]=useState<number|null>(null);
  const [dragging,setDragging]=useState<number|null>(null);
  const initialized=useRef(false);
  useEffect(()=>{ if(!initialized.current){initialized.current=true;return} setStatus("Cambios sin guardar"); const timer=setTimeout(()=>startTransition(async()=>{setStatus("Guardando...");try{await saveItemAction({id:item.id,title,description,blocks});setStatus("Guardado")}catch{setStatus("Error al guardar")}}),1200);return()=>clearTimeout(timer)},[title,description,blocks,item.id]);
  const add=(type:string)=>setBlocks(v=>{setSelected(v.length);return [...v,{type,content:createBlockContent(type)}]});
  const patch=(index:number,content:Record<string,unknown>)=>setBlocks(v=>v.map((b,i)=>i===index?{...b,content}:b));
  const move=(index:number,delta:number)=>setBlocks(v=>{const n=[...v],to=index+delta;if(to<0||to>=n.length)return v;[n[index],n[to]]=[n[to],n[index]];setSelected(to);return n});
  const duplicate=(index:number)=>setBlocks(v=>{const copy={...v[index],id:undefined,content:structuredClone(v[index].content)};setSelected(index+1);return v.toSpliced(index+1,0,copy)});
  const remove=(index:number)=>setBlocks(v=>{setSelected(v.length<=1?null:Math.min(index,v.length-2));return v.filter((_,i)=>i!==index)});
  const drop=(target:number)=>{if(dragging===null||dragging===target)return;const insertion=dragging<target?target-1:target;setBlocks(v=>{const next=[...v];const [block]=next.splice(dragging,1);next.splice(insertion,0,block);return next});setSelected(insertion);setDragging(null)};
  return <main className={`canvas-workspace ${toolsOpen?"":"tools-hidden"}`}>
    <header className="canvas-toolbar"><div><button className="canvas-tool-toggle" type="button" onClick={()=>setToolsOpen(open=>!open)} aria-label="Mostrar u ocultar herramientas">☰</button><span className="code">{item.publicCode}</span><b>{title || "Sin título"}</b></div><span className="save-status" aria-live="polite">{pending?"Guardando...":status}</span></header>
    {toolsOpen&&<aside className="canvas-tools"><span className="eyebrow">Herramientas</span>{toolGroups.map(group=><div className="tool-group" key={group.label}><small>{group.label}</small>{group.types.map(type=>{const found=blockTypes.find(([key])=>key===type);return found&&<button type="button" key={type} onClick={()=>add(type)}><Plus size={14}/><span>{found[1]}</span></button>})}</div>)}</aside>}
    <section className="canvas-center">
      <input className="canvas-title" value={title} onChange={e=>setTitle(e.target.value)} aria-label="Título"/>
      <textarea className="field canvas-description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Agrega una descripción breve para encontrarlo fácilmente después."/>
      {selected!==null&&blocks[selected]&&<div className="block-context-bar"><span><b>{blockTypes.find(([key])=>key===blocks[selected].type)?.[1]}</b> · {selected+1} de {blocks.length}</span><div><button type="button" onClick={()=>move(selected,-1)} disabled={selected===0}><ChevronUp size={16}/> Antes</button><button type="button" onClick={()=>move(selected,1)} disabled={selected===blocks.length-1}><ChevronDown size={16}/> Después</button><button type="button" onClick={()=>duplicate(selected)}><Copy size={16}/> Duplicar</button><button type="button" className="danger" onClick={()=>remove(selected)}><Trash2 size={16}/> Eliminar</button></div></div>}
      <div style={{marginTop:20}}>{blocks.map((block,index)=><div className={`block ${selected===index?"selected":""}`} key={block.id??`${block.type}-${index}`} onClick={()=>setSelected(index)} onFocusCapture={()=>setSelected(index)} onDragOver={event=>event.preventDefault()} onDrop={()=>drop(index)}>
      <button type="button" className="drag-handle" draggable onDragStart={()=>setDragging(index)} onDragEnd={()=>setDragging(null)} aria-label="Arrastrar para reordenar"><GripVertical size={17}/></button>
      <span className="eyebrow">{blockTypes.find(([key])=>key===block.type)?.[1]??block.type}</span>
      <BlockContentEditor type={block.type} content={block.content} onChange={content=>patch(index,content)}/>
      </div>)}</div>
      <button className="add-block" onClick={()=>add("paragraph")}><Plus size={15}/> Continuar escribiendo</button>
    </section>
    <aside className="canvas-context"><details open><summary>Organización</summary><dl><dt>Tipo</dt><dd>{item.type?.name??"Sin clasificar"}</dd><dt>Estado</dt><dd>{item.status?.name??"Sin estado"}</dd><dt>Categoría</dt><dd>{item.category?.name??"Sin categoría"}</dd><dt>Empresa</dt><dd>{item.businesses?.map(entry=>entry.business.name).join(", ")||"General"}</dd></dl><Link className="btn" href={`/catalog/${item.id}/properties`}>Editar propiedades</Link></details><details open><summary>Recursos y asistencia</summary><p>{item.assets?.length??0} archivos · {item.links?.length??0} enlaces</p><Link className="btn" href={`/catalog/${item.id}/resources`}>Abrir recursos</Link><Link className="btn" href={`/catalog/${item.id}/ai`}>Usar asistente IA</Link></details></aside>
    <footer className="canvas-footer"><span>{blocks.length} bloques</span><span>Guardado automático activo</span></footer>
  </main>;
}
