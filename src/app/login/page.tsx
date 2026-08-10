import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { currentUser } from "@/modules/auth/session";

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  return <main className="auth-page"><section className="auth-art"><span className="eyebrow">Expert knowledge system</span><h1>Build once.<br/>Find forever.</h1><p style={{color:"#b7c5bb",maxWidth:480}}>A living catalog for the processes, ideas and resources that power Expert Academy, Design and Code.</p></section><section className="auth-form"><LoginForm/></section></main>;
}
