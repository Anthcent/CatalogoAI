import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic="force-dynamic";
export default function V2BridgePage(){const target=process.env.EXPERT_HUB_V2_URL?.trim();if(target)redirect(target);if(process.env.NODE_ENV==="development")redirect("http://localhost:3001");return <main className="auth-page"><section className="auth-art"><span className="eyebrow">Expert Hub V2</span><h1>La nueva experiencia está separada.</h1><p style={{color:"#b7c5bb",maxWidth:480}}>La aplicación actual continúa estable mientras la V2 se construye y verifica.</p></section><section className="auth-form"><div className="form-stack" style={{maxWidth:430}}><h1>Vista V2 aún no desplegada</h1><p className="subtle">Despliega la carpeta <code>expert_hub_v2</code> como un segundo servicio y configura su URL en <code>EXPERT_HUB_V2_URL</code>.</p><Link className="btn" href="/login">Volver al inicio de sesión</Link></div></section></main>}
