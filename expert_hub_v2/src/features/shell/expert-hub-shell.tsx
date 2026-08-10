"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell,ChevronRight,Menu,Plus,Search,Sparkles,X } from "lucide-react";
import { useEffect,useState } from "react";
import { businesses,navigation } from "./navigation";

export function ExpertHubShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();const [drawer,setDrawer]=useState(false);const [command,setCommand]=useState(false);
  useEffect(()=>{const listener=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="k"){event.preventDefault();setCommand(true)}};addEventListener("keydown",listener);return()=>removeEventListener("keydown",listener)},[]);
  const current=navigation.find(item=>item.href==="/"?pathname==="/":pathname.startsWith(item.href));
  return <div className="hub-shell">
    <aside className={`hub-sidebar ${drawer?"open":""}`}><div className="hub-brand"><span>EH</span><div><b>Expert Hub</b><small>Knowledge workspace</small></div><button onClick={()=>setDrawer(false)} aria-label="Cerrar menú"><X/></button></div><Link className="new-button" href="/nuevo"><Plus/>Nuevo <kbd>⌘N</kbd></Link><nav>{navigation.slice(0,6).map(({href,label,icon:Icon,...item})=><Link href={href} className={pathname===href||href!=="/"&&pathname.startsWith(href)?"active":""} key={href} onClick={()=>setDrawer(false)}><Icon/><span>{label}</span>{"count" in item&&<small>{item.count}</small>}{"alert" in item&&<i/>}</Link>)}</nav><section className="business-nav"><small>EMPRESAS</small>{businesses.map(item=><Link href={`/catalogo?empresa=${encodeURIComponent(item.label)}`} key={item.label}><i className={item.color}/><span>{item.label}</span><small>{item.count}</small></Link>)}</section><section className="storage"><div><span>Almacenamiento</span><b>38%</b></div><progress value="38" max="100"/><small>7.6 GB de 20 GB</small></section><nav className="sidebar-bottom">{navigation.slice(6).map(({href,label,icon:Icon})=><Link href={href} key={href}><Icon/><span>{label}</span></Link>)}</nav><div className="profile"><span>AD</span><div><b>Administrador</b><small>Sesión privada</small></div><button>•••</button></div></aside>
    <div className="hub-main"><header className="hub-topbar"><button className="mobile-menu" onClick={()=>setDrawer(true)}><Menu/></button><div className="breadcrumb"><b>Expert Hub</b><ChevronRight/><span>{current?.label??"Espacio"}</span></div><button className="global-search" onClick={()=>setCommand(true)}><Search/><span>Buscar en todo...</span><kbd>⌘K</kbd></button><Link className="gemini-chip" href="/configuracion/ia"><Sparkles/>Gemini activo</Link><button className="notification" aria-label="Notificaciones"><Bell/><i/></button></header><main>{children}</main></div>
    {drawer&&<button className="drawer-backdrop" onClick={()=>setDrawer(false)} aria-label="Cerrar menú"/>}
    {command&&<div className="overlay" onClick={()=>setCommand(false)}><section className="command" onClick={event=>event.stopPropagation()}><div><Search/><input autoFocus placeholder="Buscar elementos, comandos o códigos..."/><button onClick={()=>setCommand(false)}><X/></button></div><p>Escribe para buscar en todo Expert Hub.</p><footer><span>↑↓ navegar</span><span>↵ abrir</span><span>Esc cerrar</span></footer></section></div>}
  </div>
}
