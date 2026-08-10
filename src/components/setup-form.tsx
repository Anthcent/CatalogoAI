"use client";

import { useActionState } from "react";
import { setupAction } from "@/modules/auth/actions";

export function SetupForm() {
  const [state, action, pending] = useActionState(setupAction, { error: null });
  return <form action={action} className="form-stack">
    <div><span className="eyebrow">Configuración única</span><h1>Crea tu administrador.</h1><p className="subtle">Esta página se bloquea permanentemente después de crear la primera cuenta.</p></div>
    <label>Nombre<input className="field" name="name" required autoComplete="name" autoFocus/></label>
    <label>Correo electrónico<input className="field" name="email" type="email" required autoComplete="email"/></label>
    <label>Contraseña<input className="field" name="password" type="password" minLength={12} required autoComplete="new-password"/></label>
    <label>Confirmar contraseña<input className="field" name="confirmation" type="password" minLength={12} required autoComplete="new-password"/></label>
    {state.error && <p role="alert" style={{color:"#b42318"}}>{state.error}</p>}
    <button className="btn primary" disabled={pending}>{pending ? "Creando espacio..." : "Crear administrador"}</button>
  </form>;
}
