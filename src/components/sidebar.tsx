import Link from "next/link";
import { BookOpen, Home, Inbox, LayoutTemplate, LogOut, Plus, Search, Settings } from "lucide-react";
import { logoutAction } from "@/modules/auth/actions";

export function Sidebar() {
  return <aside className="sidebar">
    <div className="brand">Archivo Vivo<small>EXPERT KNOWLEDGE</small></div>
    <nav className="nav">
      <Link href="/"><Home size={18}/><span>Home</span></Link>
      <Link href="/search"><Search size={18}/><span>Search</span></Link>
      <Link href="/catalog"><BookOpen size={18}/><span>Catalog</span></Link>
      <Link href="/new" className="new-link"><Plus size={18}/><span>New</span></Link>
      <Link href="/templates"><LayoutTemplate size={18}/><span>Templates</span></Link>
      <Link href="/inbox"><Inbox size={18}/><span>Inbox</span></Link>
      <Link href="/settings"><Settings size={18}/><span>Settings</span></Link>
    </nav>
    <form action={logoutAction} className="sidebar-footer"><button className="logout"><LogOut size={18}/><span>Sign out</span></button></form>
  </aside>;
}
