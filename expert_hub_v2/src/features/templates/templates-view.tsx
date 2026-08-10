"use client";

import Link from "next/link";
import {
  Check,
  Copy,
  LayoutTemplate,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useDeferredValue, useState } from "react";

type TemplateCard = {
  id: string;
  name: string;
  description: string;
  type: string;
  blocks: number;
  tone: string;
  featured: boolean;
  sections: string[];
};

export function TemplatesView({ templates }: { templates: TemplateCard[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Todas");
  const [active, setActive] = useState<TemplateCard | null>(null);
  const deferred = useDeferredValue(query.toLowerCase());
  const types = ["Todas", ...new Set(templates.map((item) => item.type))];
  const items = templates.filter(
    (item) =>
      (type === "Todas" || item.type === type) &&
      `${item.name} ${item.description}`.toLowerCase().includes(deferred),
  );
  return (
    <div className="page workspace-page">
      <header className="page-title">
        <div>
          <small>ESTRUCTURAS REUTILIZABLES</small>
          <h1>Plantillas</h1>
          <p>Empieza con una estructura probada y adáptala a tu trabajo.</p>
        </div>
        <Link href="/plantillas/nueva" className="primary-button">
          <Plus />
          Nueva plantilla
        </Link>
      </header>
      <section className="workspace-toolbar">
        <label className="small-search">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar plantillas..."
          />
        </label>
        <div className="filter-pills">
          {types.map((option) => (
            <button
              className={type === option ? "active" : ""}
              onClick={() => setType(option)}
              key={option}
            >
              {option}
            </button>
          ))}
        </div>
      </section>
      <div className="template-grid">
        {items.map((item) => (
          <article className="template-card" key={item.id}>
            <div className={`template-preview ${item.tone}`}>
              <LayoutTemplate />
              <div>
                {Array.from(
                  { length: Math.min(item.blocks, 6) },
                  (_, index) => (
                    <i key={index} />
                  ),
                )}
              </div>
              {item.featured && (
                <span>
                  <Sparkles />
                  Usada
                </span>
              )}
            </div>
            <div>
              <small>
                {item.type} · {item.blocks} bloques
              </small>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <footer>
                <button onClick={() => setActive(item)}>Vista previa</button>
                <Link
                  className="use-template"
                  href={`/nuevo?template=${item.id}`}
                >
                  <Copy />
                  Usar plantilla
                </Link>
              </footer>
            </div>
          </article>
        ))}
      </div>
      {active && (
        <div className="overlay" onClick={() => setActive(null)}>
          <section
            className="template-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <small>{active.type.toUpperCase()}</small>
                <h2>{active.name}</h2>
              </div>
              <button onClick={() => setActive(null)}>
                <X />
              </button>
            </header>
            <p>{active.description}</p>
            <div className="template-outline">
              {active.sections.map((section, index) => (
                <span key={`${section}-${index}`}>
                  <i>{index + 1}</i>
                  {section || "Contenido"}
                  <Check />
                </span>
              ))}
            </div>
            <footer>
              <button onClick={() => setActive(null)}>Cancelar</button>
              <Link
                className="primary-button"
                href={`/nuevo?template=${active.id}`}
              >
                <Copy />
                Crear desde plantilla
              </Link>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
