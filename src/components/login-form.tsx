"use client";

import { useActionState } from "react";
import { loginAction } from "@/modules/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null });
  return <form action={action} className="form-stack">
    <div><span className="eyebrow">Espacio de trabajo privado</span><h1>Bienvenido de nuevo.</h1><p className="subtle">Tu conocimiento operativo te está esperando.</p></div>
    <label>Correo electrónico<input className="field" name="email" type="email" required autoComplete="email" /></label>
    <label>Contraseña<input className="field" name="password" type="password" required autoComplete="current-password" /></label>
    {state.error && <p role="alert" style={{color:"#b42318"}}>{state.error}</p>}
    <button className="btn primary" disabled={pending}>{pending ? "Ingresando..." : "Iniciar sesión"}</button>
  </form>;
}
