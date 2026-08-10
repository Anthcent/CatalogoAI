import { redirect } from "next/navigation";
import { SetupForm } from "@/components/setup-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (await db.user.count()) redirect("/login");
  return <main className="auth-page"><section className="auth-art"><span className="eyebrow">Primer inicio seguro</span><h1>Tu espacio.<br/>Tus credenciales.</h1><p style={{color:"#b7c5bb",maxWidth:480}}>Crea el administrador sin guardar contraseñas en Git, logs de despliegue ni variables de configuración.</p></section><section className="auth-form"><SetupForm/></section></main>;
}
