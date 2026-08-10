"use client";

import { useRef } from "react";

export function RichTextEditor({ html, onChange }: { html:string; onChange:(html:string)=>void }) {
  const editor=useRef<HTMLDivElement>(null);
  const command=(name:string,value?:string)=>{editor.current?.focus();document.execCommand(name,false,value);onChange(editor.current?.innerHTML??"")};
  return <div className="rich-editor"><div className="rich-toolbar" role="toolbar" aria-label="Formato de texto"><button type="button" onClick={()=>command("bold")}><b>N</b></button><button type="button" onClick={()=>command("italic")}><i>C</i></button><button type="button" onClick={()=>command("underline")}><u>S</u></button><button type="button" onClick={()=>command("formatBlock","h2")}>Título</button><button type="button" onClick={()=>command("insertUnorderedList")}>• Lista</button><button type="button" onClick={()=>command("insertOrderedList")}>1. Lista</button><button type="button" onClick={()=>{const url=window.prompt("URL del enlace");if(url)command("createLink",url)}}>Enlace</button><button type="button" onClick={()=>command("removeFormat")}>Limpiar</button></div><div ref={editor} className="rich-content" contentEditable suppressContentEditableWarning dangerouslySetInnerHTML={{__html:html}} onInput={event=>onChange(event.currentTarget.innerHTML)} data-placeholder="Comienza a escribir como en un documento..."/></div>;
}
