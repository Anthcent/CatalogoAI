import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Archivo Vivo", description: "Catálogo inteligente de conocimiento operativo" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
