import { redirect } from "next/navigation";
import { SetupForm } from "@/components/setup-form";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (await db.user.count()) redirect("/login");
  return <main className="auth-page"><section className="auth-art"><span className="eyebrow">Secure first run</span><h1>Your workspace.<br/>Your credentials.</h1><p style={{color:"#b7c5bb",maxWidth:480}}>Create the only administrator without storing a password in Git, deployment logs or environment configuration.</p></section><section className="auth-form"><SetupForm/></section></main>;
}
