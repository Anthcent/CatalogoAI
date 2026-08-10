import { Search } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { requireUser } from "@/modules/auth/session";

export default async function WorkspaceLayout({children}:{children:React.ReactNode}) {
  await requireUser();
  return <div className="app-shell"><Sidebar/><div className="main"><header className="topbar"><form action="/search" style={{position:"relative"}}><Search size={17} style={{position:"absolute",left:13,top:12,color:"#7b847e"}}/><input className="global-search" style={{paddingLeft:38}} name="q" placeholder="Buscar en todo...  Ctrl + K"/></form></header>{children}</div></div>;
}
