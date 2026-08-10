"use client";

import {
  Archive,
  FileText,
  Inbox,
  Link2,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useDeferredValue, useState } from "react";
import {
  archiveInboxAction,
  classifyInboxAction,
  convertInboxAction,
  deleteInboxAction,
  quickCaptureAction,
} from "./actions";

type InboxItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export function InboxView({ items }: { items: InboxItem[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.toLowerCase());
  const visible = items.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(deferred),
  );
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  return (
    <div className="page workspace-page">
      <header className="page-title">
        <div>
          <small>CAPTURA AHORA, ORGANIZA DESPUÉS</small>
          <h1>Bandeja</h1>
          <p>
            {items.length} entradas pendientes de convertir en conocimiento
            útil.
          </p>
        </div>
      </header>
      <form className="quick-capture" action={quickCaptureAction}>
        <Inbox />
        <input
          name="content"
          required
          placeholder="Pega un enlace, escribe una idea o captura una tarea..."
        />
        <button>
          <Plus />
          Capturar
        </button>
      </form>
      <div className="workspace-toolbar">
        <label className="small-search">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar en la bandeja..."
          />
        </label>
      </div>
      <form className="inbox-list">
        <header>
          <label>
            <input
              type="checkbox"
              checked={selected.length === items.length && items.length > 0}
              onChange={() =>
                setSelected(
                  selected.length === items.length
                    ? []
                    : items.map((item) => item.id),
                )
              }
            />
            Seleccionar todo
          </label>
          <div className="inbox-actions">
            <button
              formAction={classifyInboxAction}
              disabled={!selected.length}
            >
              <Sparkles />
              Clasificar con IA
            </button>
            <button formAction={archiveInboxAction} disabled={!selected.length}>
              <Archive />
              Archivar
            </button>
            <button formAction={convertInboxAction} disabled={!selected.length}>
              <Link2 />
              Convertir
            </button>
            <button formAction={deleteInboxAction} disabled={!selected.length}>
              <Trash2 />
              Eliminar
            </button>
          </div>
        </header>
        {selected.map((id) => (
          <input type="hidden" name="itemIds" value={id} key={id} />
        ))}
        {visible.map((item) => (
          <article
            className={selected.includes(item.id) ? "selected" : ""}
            key={item.id}
          >
            <label>
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggle(item.id)}
              />
              <i />
            </label>
            <div className="inbox-icon">
              <FileText />
            </div>
            <div>
              <h2>{item.title}</h2>
              <p>
                {item.description || "Captura rápida"} ·{" "}
                {new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(
                  new Date(item.createdAt),
                )}
              </p>
            </div>
            <button type="button" onClick={() => toggle(item.id)}>
              Seleccionar
            </button>
          </article>
        ))}
      </form>
    </div>
  );
}
