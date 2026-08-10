import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { currentUser } from "@/modules/auth/session";
import { db } from "@/lib/db";

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  if (!(await db.user.count())) redirect("/setup");
  return <main className="auth-page"><section className="auth-art"><span className="eyebrow">Sistema de conocimiento experto</span><h1>Créalo una vez.<br/>Encuéntralo siempre.</h1><p style={{color:"#b7c5bb",maxWidth:480}}>Un catálogo vivo para los procesos, ideas y recursos de Expert Academy, Design y Code.</p></section><section className="auth-form"><LoginForm/></section></main>;
}
