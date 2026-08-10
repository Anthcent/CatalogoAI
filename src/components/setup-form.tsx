"use client";

import { useActionState } from "react";
import { setupAction } from "@/modules/auth/actions";

export function SetupForm() {
  const [state, action, pending] = useActionState(setupAction, { error: null });
  return <form action={action} className="form-stack">
    <div><span className="eyebrow">One-time setup</span><h1>Create your administrator.</h1><p className="subtle">This page locks permanently after the first account is created.</p></div>
    <label>Name<input className="field" name="name" required autoComplete="name" autoFocus/></label>
    <label>Email<input className="field" name="email" type="email" required autoComplete="email"/></label>
    <label>Password<input className="field" name="password" type="password" minLength={12} required autoComplete="new-password"/></label>
    <label>Confirm password<input className="field" name="confirmation" type="password" minLength={12} required autoComplete="new-password"/></label>
    {state.error && <p role="alert" style={{color:"#b42318"}}>{state.error}</p>}
    <button className="btn primary" disabled={pending}>{pending ? "Creating workspace..." : "Create administrator"}</button>
  </form>;
}
