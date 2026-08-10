import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/login-form";
import { currentUser } from "@/features/auth/session";

export default async function LoginPage() {
  if (await currentUser()) redirect("/");
  return <LoginForm />;
}
