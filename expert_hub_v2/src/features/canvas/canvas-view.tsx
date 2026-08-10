"use client";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  GripVertical,
  History,
  LayoutGrid,
  Link2,
  PanelLeftClose,
  PanelRightClose,
  Plus,
  Search,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { BlockRenderer } from "./block-renderer";
import { saveCanvasAction } from "./actions";
import {
  applyPreset,
  defaultBlocks,
  type BlockSpan,
  type LayoutPreset,
} from "./types";
import type { CatalogItem } from "@/features/catalog/data";
const sections = [
  "Resumen",
  "Objetivo",
  "Prompt de generación",
  "Proceso",
  "Referencias visuales",
  "Preparación final",
  "Relaciones",
];
export function CanvasView({
  item,
  initialBlocks = defaultBlocks,
}: {
  item: CatalogItem;
  initialBlocks?: typeof defaultBlocks;
}) {
  const [title, setTitle] = useState(item.title);
  const [blocks, setBlocks] = useState(
    initialBlocks.length ? initialBlocks : defaultBlocks,
  );
  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(true);
  const [layout, setLayout] = useState(false);
  const [status, setStatus] = useState("Guardado");
  const [revision, setRevision] = useState(0);
  const [dragging, setDragging] = useState<number | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const latestRevision = useRef(0);
  const queuedRevision = useRef(0);
  const markChanged = () => {
    setStatus("Guardando...");
    setRevision((current) => {
      latestRevision.current = current + 1;
      return current + 1;
    });
  };
  const enqueueSave = (
    nextTitle: string,
    nextBlocks: typeof blocks,
    nextRevision: number,
  ) => {
    if (nextRevision <= queuedRevision.current) return saveQueue.current;
    queuedRevision.current = nextRevision;
    saveQueue.current = saveQueue.current.then(async () => {
      try {
        await saveCanvasAction({
          id: item.id,
          title: nextTitle,
          blocks: nextBlocks,
        });
        if (latestRevision.current === nextRevision) setStatus("Guardado");
      } catch {
        setStatus("Error al guardar");
      }
    });
    return saveQueue.current;
  };
  const enqueueSaveEvent = useEffectEvent(enqueueSave);
  useEffect(() => {
    if (!revision) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void enqueueSaveEvent(title, blocks, revision);
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [blocks, item.id, revision, title]);
  useEffect(() => {
    if (status === "Guardado") return;
    const preventLoss = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", preventLoss);
    return () => window.removeEventListener("beforeunload", preventLoss);
  }, [status]);
  const protectNavigation = async (event: ReactMouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor || status === "Guardado") return;
    event.preventDefault();
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await enqueueSave(title, blocks, latestRevision.current);
    window.location.assign(anchor.href);
  };
  const patch = (index: number, content: Record<string, unknown>) => {
    markChanged();
    setBlocks((current) =>
      current.map((block, i) => (i === index ? { ...block, content } : block)),
    );
  };
  const span = (index: number, value: BlockSpan) => {
    markChanged();
    setBlocks((current) =>
      current.map((block, i) =>
        i === index ? { ...block, span: value } : block,
      ),
    );
  };
  const drop = (target: number) => {
    if (dragging === null || dragging === target) return;
    markChanged();
    setBlocks((current) => {
      const next = [...current];
      const [block] = next.splice(dragging, 1);
      next.splice(dragging < target ? target - 1 : target, 0, block);
      return next;
    });
    setDragging(null);
  };
  return (
    <div className="canvas-page" onClickCapture={protectNavigation}>
      <header className="canvas-header">
        <Link href="/catalogo">
          <ArrowLeft />
        </Link>
        <div className="canvas-name">
          <span>{item.business}</span>
          <code>{item.code}</code>
          <input
            value={title}
            onChange={(event) => {
              markChanged();
              setTitle(event.target.value);
            }}
          />
        </div>
        <div className="save-state">
          <i className={status === "Guardado" ? "saved" : ""} />
          {status}
        </div>
        <div className="canvas-actions">
          <Link href="/buscar">
            <Search />
            <span>Buscar</span>
          </Link>
          <button onClick={() => setLayout(true)}>
            <LayoutGrid />
            <span>Layout</span>
          </button>
          <Link href={`/elementos/${item.id}/versiones`}>
            <History />
            <span>Versiones</span>
          </Link>
          <Link href={`/elementos/${item.id}/relaciones`}>
            <Link2 />
            <span>Relacionar</span>
          </Link>
          <a href={`/api/elementos/${item.id}/export`}>
            <Download />
            <span>Exportar</span>
          </a>
          <Link href={`/elementos/${item.id}/recursos`}>
            <Share2 />
            <span>Recursos</span>
          </Link>
        </div>
      </header>
      <div
        className={`canvas-shell ${left ? "" : "left-closed"} ${right ? "" : "right-closed"}`}
      >
        {left ? (
          <aside className="outline">
            <header>
              <b>Contenido</b>
              <button onClick={() => setLeft(false)}>
                <PanelLeftClose />
              </button>
            </header>
            <nav>
              {sections.map((section, index) => (
                <a
                  href={`#block-${defaultBlocks[index]?.id ?? "relations"}`}
                  key={section}
                >
                  <i>{index + 1}</i>
                  {section}
                </a>
              ))}
            </nav>
            <button>
              <Plus />
              Agregar sección
            </button>
          </aside>
        ) : (
          <button className="pane-open left" onClick={() => setLeft(true)}>
            <PanelLeftClose />
          </button>
        )}
        <main className="canvas-document">
          <section className="document-meta">
            <button>
              En proceso <ChevronDown />
            </button>
            <button>
              Productos <ChevronDown />
            </button>
            <button>
              Sticker <ChevronDown />
            </button>
            <span>stickers</span>
            <span>impresión</span>
            <button>+ Etiqueta</button>
          </section>
          <div className="block-grid">
            {blocks.map((block, index) => (
              <article
                id={`block-${block.id}`}
                className="canvas-block"
                style={{ gridColumn: `span ${block.span}` }}
                key={block.id}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => drop(index)}
              >
                <div className="block-layout">
                  <button
                    draggable
                    onDragStart={() => setDragging(index)}
                    onDragEnd={() => setDragging(null)}
                  >
                    <GripVertical />
                  </button>
                  <span>{block.title}</span>
                  <div>
                    {([4, 6, 8, 12] as BlockSpan[]).map((value) => (
                      <button
                        className={block.span === value ? "active" : ""}
                        onClick={() => span(index, value)}
                        key={value}
                      >
                        {value === 4
                          ? "⅓"
                          : value === 6
                            ? "½"
                            : value === 8
                              ? "⅔"
                              : "1/1"}
                      </button>
                    ))}
                  </div>
                </div>
                <BlockRenderer
                  block={block}
                  itemId={item.id}
                  onChange={(content) => patch(index, content)}
                />
              </article>
            ))}
          </div>
          <button className="insert-block">
            <Plus />
            Agregar bloque <small>o escribe /</small>
          </button>
        </main>
        {right ? (
          <aside className="properties">
            <header>
              <b>Propiedades</b>
              <button onClick={() => setRight(false)}>
                <PanelRightClose />
              </button>
            </header>
            <label>
              Empresa
              <select defaultValue={item.business}>
                <option>{item.business}</option>
                <option>Expert Academy</option>
                <option>Expert Design</option>
                <option>Expert Code</option>
              </select>
            </label>
            <label>
              Estado
              <select defaultValue={item.status}>
                <option>{item.status}</option>
                <option>Borrador</option>
                <option>Listo</option>
              </select>
            </label>
            <label>
              Tipo
              <select defaultValue={item.type}>
                <option>{item.type}</option>
              </select>
            </label>
            <label>
              Categoría
              <select>
                <option>Productos</option>
              </select>
            </label>
            <label>
              Etiquetas
              <div className="property-tags">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag} ×</span>
                ))}
                <button>+</button>
              </div>
            </label>
            <label>
              Descripción
              <textarea defaultValue={item.description} />
              <button className="gemini-action">
                <Sparkles />
                Mejorar con Gemini
              </button>
            </label>
            <div className="preview-box">
              <b>Preview</b>
              <div>Portada del elemento</div>
            </div>
            <dl>
              <div>
                <dt>Creado</dt>
                <dd>9 ago 2026</dd>
              </div>
              <div>
                <dt>Modificado</dt>
                <dd>Ahora</dd>
              </div>
              <div>
                <dt>Versión</dt>
                <dd>v12</dd>
              </div>
              <div>
                <dt>Bloques</dt>
                <dd>{blocks.length}</dd>
              </div>
            </dl>
          </aside>
        ) : (
          <button className="pane-open right" onClick={() => setRight(true)}>
            <PanelRightClose />
          </button>
        )}
      </div>
      {layout && (
        <div className="overlay" onClick={() => setLayout(false)}>
          <section
            className="layout-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <small>LIENZO V2</small>
                <h2>Distribución del documento</h2>
              </div>
              <button onClick={() => setLayout(false)}>×</button>
            </header>
            <p>Aplica un preset o combina libremente anchos de 12 columnas.</p>
            <div>
              {(
                [
                  ["one", "Una columna"],
                  ["two", "Dos columnas"],
                  ["three", "Tres columnas"],
                  ["free", "Composición libre"],
                ] as [LayoutPreset, string][]
              ).map(([preset, label]) => (
                <button
                  key={preset}
                  onClick={() => {
                    markChanged();
                    setBlocks((current) => applyPreset(current, preset));
                    setLayout(false);
                  }}
                >
                  <LayoutGrid />
                  <b>{label}</b>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
