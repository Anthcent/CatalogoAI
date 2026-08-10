"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Copy, Plus, Trash2 } from "lucide-react";
import { saveItemAction } from "@/modules/catalog/actions";
import { blockTypes, type BlockDraft } from "@/modules/catalog/types";

type Props = { item: { id:string; publicCode:string; title:string; description:string; blocks:{id:string;type:string;content:unknown}[] } };

export function CanvasEditor({ item }: Props) {
  const [title,setTitle]=useState(item.title); const [description,setDescription]=useState(item.description);
  const [blocks,setBlocks]=useState<BlockDraft[]>(item.blocks.map(b=>({id:b.id,type:b.type,content:b.content as Record<string,unknown>})));
  const [menu,setMenu]=useState(false); const [status,setStatus]=useState("Saved"); const [pending,startTransition]=useTransition();
  const initialized=useRef(false);
  useEffect(()=>{ if(!initialized.current){initialized.current=true;return} setStatus("Unsaved changes"); const timer=setTimeout(()=>startTransition(async()=>{setStatus("Saving...");try{await saveItemAction({id:item.id,title,description,blocks});setStatus("Saved")}catch{setStatus("Save failed")}}),1200);return()=>clearTimeout(timer)},[title,description,blocks,item.id]);
  const add=(type:string)=>{setBlocks(v=>[...v,{type,content:{text:""}}]);setMenu(false)};
  const patch=(index:number,text:string)=>setBlocks(v=>v.map((b,i)=>i===index?{...b,content:{...b.content,text}}:b));
  const move=(index:number,delta:number)=>setBlocks(v=>{const n=[...v],to=index+delta;if(to<0||to>=n.length)return v;[n[index],n[to]]=[n[to],n[index]];return n});
  return <main className="canvas">
    <div className="row"><span className="code">{item.publicCode}</span><span className="save-status" aria-live="polite">{pending?"Saving...":status}</span></div>
    <input className="canvas-title" value={title} onChange={e=>setTitle(e.target.value)} aria-label="Title"/>
    <textarea className="field canvas-description" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add a short description so this is easy to find later."/>
    <div style={{marginTop:30}}>{blocks.map((block,index)=><div className="block" key={block.id??`${block.type}-${index}`}>
      <span className="eyebrow">{blockTypes.find(([key])=>key===block.type)?.[1]??block.type}</span>
      {block.type==="heading"?<input style={{font:"25px Georgia"}} value={String(block.content.text??"")} onChange={e=>patch(index,e.target.value)} placeholder="Heading"/>:<textarea value={String(block.content.text??"")} onChange={e=>patch(index,e.target.value)} placeholder={block.type==="prompt"?"Write a reusable prompt...":block.type==="steps"?"1. First step\n2. Next step":"Start writing..."}/>}
      <div className="block-actions"><button className="icon-btn" onClick={()=>move(index,-1)} aria-label="Move up"><ChevronUp size={15}/></button><button className="icon-btn" onClick={()=>move(index,1)} aria-label="Move down"><ChevronDown size={15}/></button><button className="icon-btn" onClick={()=>setBlocks(v=>v.toSpliced(index+1,0,{...block,id:undefined}))} aria-label="Duplicate"><Copy size={15}/></button><button className="icon-btn" onClick={()=>setBlocks(v=>v.filter((_,i)=>i!==index))} aria-label="Delete"><Trash2 size={15}/></button></div>
    </div>)}</div>
    <button className="add-block" onClick={()=>setMenu(v=>!v)}><Plus size={15}/> Add block</button>
    {menu&&<div className="block-menu">{blockTypes.map(([key,label])=><button className="btn" key={key} onClick={()=>add(key)}>{label}</button>)}</div>}
  </main>;
}
