"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  Filter,
  Grid2X2,
  List,
  MoreHorizontal,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useDeferredValue, useState } from "react";
import { businessTone, catalogItems, filterCatalogItems } from "./data";

export function CatalogView({ sourceItems }: { sourceItems: typeof catalogItems }) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<string[]>([]);
  const [action, setAction] = useState<string | null>(null);
  const deferred = useDeferredValue(query);
  const items = filterCatalogItems(sourceItems, deferred);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  return (
    <div className="page catalog-page">
      <header className="page-title catalog-title">
        <div>
          <small>TODO TU CONOCIMIENTO</small>
          <h1>Catálogo</h1>
          <p>
          {sourceItems.length} elementos organizados entre tus tres empresas.
          </p>
        </div>
        <div className="title-actions">
          <button className="soft-button">
            <Filter />
            Filtros <b>3</b>
          </button>
          <Link className="primary-button" href="/nuevo">
            <Plus />
            Nuevo elemento
          </Link>
        </div>
      </header>
      <div className="catalog-toolbar">
        <label className="small-search">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por título, código o etiqueta..."
          />
        </label>
        <select defaultValue="updated">
          <option value="updated">Última modificación</option>
          <option>Más recientes</option>
          <option>Más usados</option>
          <option>A–Z</option>
        </select>
        <div className="view-switch">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
            aria-label="Vista de cuadrícula"
          >
            <Grid2X2 />
          </button>
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
            aria-label="Vista de lista"
          >
            <List />
          </button>
        </div>
      </div>
      <div className="filters">
        <button className="active">
          Empresa <b>Expert Design</b>
        </button>
        <button>
          Tipo <b>Todos</b>
        </button>
        <button>
          Estado <b>Activos</b>
        </button>
        <button>Etiquetas</button>
        <button>Más filtros</button>
        <button className="clear">Limpiar filtros</button>
      </div>
      {selected.length > 0 && (
        <div className="selection-bar">
          <span>
            <b>{selected.length}</b> seleccionados
          </span>
          <button onClick={() => setAction("Relacionar elementos")}>
            Relacionar
          </button>
          <button onClick={() => setAction("Crear a partir de selección")}>
            Crear a partir de selección
          </button>
          <button onClick={() => setAction("Exportar selección")}>
            Exportar
          </button>
          <button onClick={() => setSelected([])}>
            <X />
          </button>
        </div>
      )}
      <div className={`catalog-grid ${view}`}>
        {items.map((item) => (
          <article className="catalog-card" key={item.id}>
            <label className="check">
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => toggle(item.id)}
              />
              <i />
            </label>
            <button className="dots" aria-label="Acciones">
              <MoreHorizontal />
            </button>
            <Link
              href={`/elementos/${item.id}`}
              className={`catalog-visual ${businessTone(item.business)}`}
            >
              <Image
                src={`/api/mockup-assets/${item.image}`}
                alt=""
                fill
                sizes="300px"
              />
            </Link>
            <div className="catalog-body">
              <div className="row">
                <code>{item.code}</code>
                <span className={`company ${businessTone(item.business)}`}>
                  {item.business}
                </span>
                <span
                  className={`status ${item.status.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {item.status}
                </span>
              </div>
              <Link href={`/elementos/${item.id}`}>
                <h3>{item.title}</h3>
              </Link>
              <p>{item.description}</p>
              <div className="tag-row">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <footer>
                <span>{item.type}</span>
                <span>{item.updated}</span>
              </footer>
            </div>
          </article>
        ))}
      </div>
      {items.length === 0 && (
        <div className="empty-state">
          <Boxes />
          <h2>No encontramos elementos</h2>
          <p>Prueba otra búsqueda o limpia los filtros.</p>
        </div>
      )}
      {action && (
        <div className="overlay" onClick={() => setAction(null)}>
          <section
            className="action-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h2>{action}</h2>
              <button onClick={() => setAction(null)}>
                <X />
              </button>
            </header>
            <p>
              Esta acción se aplicará a {selected.length} elementos
              seleccionados.
            </p>
            <button className="primary-button" onClick={() => setAction(null)}>
              Continuar
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
