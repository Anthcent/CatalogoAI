"use client";

import { ArrowRight, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useActionState } from "react";
import { loginAction } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null });
  return (
    <main className="login-page">
      <section className="login-brand">
        <div>
          <span>EH</span>
          <b>Expert Hub</b>
        </div>
        <div>
          <small>CONOCIMIENTO OPERATIVO</small>
          <h1>Tu trabajo no debería empezar de cero.</h1>
          <p>
            Centraliza procesos, prompts, recursos y decisiones para convertir
            experiencia dispersa en un sistema reutilizable.
          </p>
        </div>
        <footer>
          <Sparkles />
          Impulsado por Gemini
        </footer>
      </section>
      <section className="login-panel">
        <form action={action}>
          <header>
            <span>EH</span>
            <h2>Bienvenido de nuevo</h2>
            <p>Accede al espacio privado de Expert Hub.</p>
          </header>
          <label>
            Correo electrónico
            <div>
              <Mail />
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="tu@empresa.com"
              />
            </div>
          </label>
          <label>
            Contraseña
            <div>
              <LockKeyhole />
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={12}
              />
            </div>
          </label>
          {state.error && <p className="login-error">{state.error}</p>}
          <button className="primary-button" disabled={pending}>
            {pending ? "Ingresando..." : "Ingresar"}
            <ArrowRight />
          </button>
          <small>Usa las mismas credenciales de la aplicación estable.</small>
        </form>
      </section>
    </main>
  );
}
