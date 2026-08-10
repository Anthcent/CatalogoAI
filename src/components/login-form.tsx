"use client";

import { useActionState } from "react";
import { loginAction } from "@/modules/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null });
  return <form action={action} className="form-stack">
    <div><span className="eyebrow">Private workspace</span><h1>Welcome back.</h1><p className="subtle">Your operational knowledge is waiting.</p></div>
    <label>Email<input className="field" name="email" type="email" required autoComplete="email" /></label>
    <label>Password<input className="field" name="password" type="password" required autoComplete="current-password" /></label>
    {state.error && <p role="alert" style={{color:"#b42318"}}>{state.error}</p>}
    <button className="btn primary" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
  </form>;
}
