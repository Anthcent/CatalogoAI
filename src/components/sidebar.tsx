import Link from "next/link";
import { BookOpen, Home, Inbox, LayoutTemplate, LogOut, Plus, Search, Settings } from "lucide-react";
import { logoutAction } from "@/modules/auth/actions";

export function Sidebar() {
  return <aside className="sidebar">
    <div className="brand">Archivo Vivo<small>CONOCIMIENTO EXPERTO</small></div>
    <nav className="nav">
      <Link href="/"><Home size={18}/><span>Inicio</span></Link>
      <Link href="/search"><Search size={18}/><span>Buscar</span></Link>
      <Link href="/catalog"><BookOpen size={18}/><span>Catálogo</span></Link>
      <Link href="/new" className="new-link"><Plus size={18}/><span>Nuevo</span></Link>
      <Link href="/templates"><LayoutTemplate size={18}/><span>Plantillas</span></Link>
      <Link href="/inbox"><Inbox size={18}/><span>Bandeja</span></Link>
      <Link href="/settings"><Settings size={18}/><span>Configuración</span></Link>
    </nav>
    <form action={logoutAction} className="sidebar-footer"><button className="logout"><LogOut size={18}/><span>Cerrar sesión</span></button></form>
  </aside>;
}
