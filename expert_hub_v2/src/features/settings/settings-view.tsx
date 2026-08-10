"use client";
import {
  Bell,
  Building2,
  Check,
  Database,
  KeyRound,
  Palette,
  Shield,
  SlidersHorizontal,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useActionState, useState } from "react";
import { saveAiSettingsAction } from "./actions";
const tabs = [
  { id: "perfil", label: "Perfil", icon: UserRound },
  { id: "empresas", label: "Empresas", icon: Building2 },
  { id: "ia", label: "Inteligencia artificial", icon: Sparkles },
  { id: "apariencia", label: "Apariencia", icon: Palette },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
  { id: "datos", label: "Datos y almacenamiento", icon: Database },
  { id: "seguridad", label: "Seguridad", icon: Shield },
];
type AiSettings = {
  configured: boolean;
  generationModel: string;
  embeddingModel: string;
  semantic: boolean;
  automaticSummaries: boolean;
};
export function SettingsView({
  initial = "perfil",
  ai,
}: {
  initial?: string;
  ai: AiSettings;
}) {
  const [tab, setTab] = useState(initial);
  const [state, action, pending] = useActionState(saveAiSettingsAction, {
    saved: false,
    error: null,
  });
  const [semantic, setSemantic] = useState(ai.semantic);
  const [autosummary, setAutosummary] = useState(ai.automaticSummaries);
  return (
    <div className="page workspace-page settings-page">
      <header className="page-title">
        <div>
          <small>PERSONALIZA TU ESPACIO</small>
          <h1>Configuración</h1>
          <p>Administra tu perfil, empresas, integraciones y preferencias.</p>
        </div>
      </header>
      <div className="settings-layout">
        <nav>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              type="button"
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
              key={id}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
        <form className="settings-panel" action={action}>
          <header>
            <div>
              <small>{tabs.find((item) => item.id === tab)?.label}</small>
              <h2>
                {tab === "ia"
                  ? "Gemini e inteligencia artificial"
                  : "Preferencias del espacio"}
              </h2>
            </div>
            {state.saved && (
              <span>
                <Check />
                Cambios guardados
              </span>
            )}
          </header>
          {tab === "ia" ? (
            <>
              <div className="integration-card">
                <span>
                  <Sparkles />
                </span>
                <div>
                  <b>Google Gemini</b>
                  <p>
                    {ai.configured
                      ? "Conectado mediante variable de entorno segura."
                      : "Configura GEMINI_API_KEY en el servidor."}
                  </p>
                </div>
                <i>{ai.configured ? "Activo" : "Inactivo"}</i>
              </div>
              <label>
                Modelo predeterminado
                <select
                  name="generationModel"
                  defaultValue={ai.generationModel}
                >
                  <option value={ai.generationModel}>
                    {ai.generationModel}
                  </option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash</option>
                  <option value="gemini-2.5-pro">gemini-2.5-pro</option>
                </select>
              </label>
              <label>
                Modelo de embeddings
                <select name="embeddingModel" defaultValue={ai.embeddingModel}>
                  <option value={ai.embeddingModel}>{ai.embeddingModel}</option>
                  <option value="gemini-embedding-001">
                    gemini-embedding-001
                  </option>
                </select>
              </label>
              <input
                type="hidden"
                name="semanticSearch"
                value={String(semantic)}
              />
              <input
                type="hidden"
                name="automaticSummaries"
                value={String(autosummary)}
              />
              <div className="setting-row">
                <div>
                  <b>Búsqueda semántica</b>
                  <p>Encuentra elementos por intención y significado.</p>
                </div>
                <button
                  className={`toggle ${semantic ? "on" : ""}`}
                  type="button"
                  onClick={() => setSemantic(!semantic)}
                >
                  <i />
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <b>Resúmenes automáticos</b>
                  <p>Genera una síntesis al completar un elemento.</p>
                </div>
                <button
                  className={`toggle ${autosummary ? "on" : ""}`}
                  type="button"
                  onClick={() => setAutosummary(!autosummary)}
                >
                  <i />
                </button>
              </div>
              <div className="api-note">
                <KeyRound />
                <p>
                  <b>La clave nunca se muestra en el navegador.</b>
                  <br />
                  Configura <code>GEMINI_API_KEY</code> únicamente en el entorno
                  del servidor.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="avatar-setting">
                <span>AD</span>
                <div>
                  <b>Administrador</b>
                  <p>admin@experthub.local</p>
                </div>
                <button>Cambiar imagen</button>
              </div>
              <div className="form-grid">
                <label>
                  Nombre
                  <input defaultValue="Administrador" />
                </label>
                <label>
                  Idioma
                  <select defaultValue="es">
                    <option value="es">Español</option>
                    <option>English</option>
                  </select>
                </label>
                <label>
                  Zona horaria
                  <select>
                    <option>America/Argentina/Buenos_Aires</option>
                  </select>
                </label>
                <label>
                  Vista inicial
                  <select>
                    <option>Inicio</option>
                    <option>Catálogo</option>
                  </select>
                </label>
              </div>
              <div className="setting-row">
                <div>
                  <b>Modo compacto</b>
                  <p>Reduce espacios para mostrar más información.</p>
                </div>
                <button className="toggle" type="button">
                  <i />
                </button>
              </div>
            </>
          )}
          <footer>
            <button type="reset">Descartar</button>
            <button type="submit" className="primary-button" disabled={pending}>
              <SlidersHorizontal />
              {pending ? "Guardando..." : "Guardar cambios"}
            </button>
          </footer>
          {state.error && <p className="login-error">{state.error}</p>}
        </form>
      </div>
    </div>
  );
}
