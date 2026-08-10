import type { Metadata } from "next";
import "./styles.css";
import "./features.css";
import "./assets.css";
import "./canvas.css";
import "./workspace.css";
import "./auth.css";
import "./new-item.css";
import "./search-live.css";
import "./template-form.css";
import "./canvas-links.css";
import "./typography.css";

export const metadata:Metadata={title:"Expert Hub",description:"Catálogo inteligente y espacio de conocimiento"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
