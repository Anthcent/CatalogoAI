"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { saveItemAction } from "@/modules/catalog/actions";
import { blockTypes, type BlockDraft } from "@/modules/catalog/types";
import { createBlockContent } from "@/modules/catalog/types";
import { BlockContentEditor } from "./block-content-editor";

type Props = { item: { id:string; publicCode:string; title:string; description:string; blocks:{id:string;type:string;content:unknown}[] } };

export function CanvasEditor({ item }: Props) {
  const [title,setTitle]=useState(item.title); const [description,setDescription]=useState(item.description);
  const [blocks,setBlocks]=useState<BlockDraft[]>(item.blocks.map(b=>({id:b.id,type:b.type,content:b.content as Record<string,unknown>})));
  const [menu,setMenu]=useState(false); const [status,setStatus]=useState("Guardado"); const [pending,startTransition]=useTransition();
  const initialized=useRef(false);
  useEffect(()=>{ if(!initialized.current){initialized.current=true;return} setStatus("Cambios sin guardar"); const timer=setTimeout(()=>startTransition(async()=>{setStatus("Guardando...");try{await saveItemAction({id:item.id,title,description,blocks});setStatus("Guardado")}catch{setStatus("Error al guardar")}}),1200);return()=>clearTimeout(timer)},[title,description,blocks,item.id]);
  const add=(type:string)=>{setBlocks(v=>[...v,{type,content:createBlockContent(type)}]);setMenu(false)};
  const patch=(index:number,content:Record<string,unknown>)=>setBlocks(v=>v.map((b,i)=>i===index?{...b,content}:b));
  const move=(index:number,delta:number)=>setBlocks(v=>{const n=[...v],to=index+delta;if(to<0||to>=n.length)return v;[n[index],n[to]]=[n[to],n[index]];return n});
  return <main className="canvas">
    <div className="row"><span className="code">{item.publicCode}</span><span className="save-status" aria-live="polite">{pending?"Guardando...":status}</span></div>
    <input className="canvas-title" value={title} onChange={e=>setTitle(e.target.value)} aria-label="Título"/>
    <textarea className="field canvas-description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Agrega una descripción breve para encontrarlo fácilmente después."/>
    <div style={{marginTop:30}}>{blocks.map((block,index)=><div className="block" key={block.id??`${block.type}-${index}`}>
      <span className="eyebrow">{blockTypes.find(([key])=>key===block.type)?.[1]??block.type}</span>
      <BlockContentEditor type={block.type} content={block.content} onChange={content=>patch(index,content)}/>
      <div className="block-actions"><button className="icon-btn" onClick={()=>move(index,-1)} aria-label="Mover arriba"><ChevronUp size={15}/></button><button className="icon-btn" onClick={()=>move(index,1)} aria-label="Mover abajo"><ChevronDown size={15}/></button><button className="icon-btn" onClick={()=>setBlocks(v=>v.toSpliced(index+1,0,{...block,id:undefined}))} aria-label="Duplicar"><Copy size={15}/></button><button className="icon-btn" onClick={()=>setBlocks(v=>v.filter((_,i)=>i!==index))} aria-label="Eliminar"><Trash2 size={15}/></button></div>
    </div>)}</div>
    <button className="add-block" onClick={()=>setMenu(v=>!v)}><Plus size={15}/> Agregar bloque</button>
    {menu&&<div className="block-menu">{blockTypes.map(([key,label])=><button className="btn" key={key} onClick={()=>add(key)}>{label}</button>)}</div>}
  </main>;
}
