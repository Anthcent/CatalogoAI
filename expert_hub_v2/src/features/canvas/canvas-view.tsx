"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Copy,
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
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { CatalogItem } from "@/features/catalog/data";
import { saveCanvasAction } from "./actions";
import { BlockRenderer } from "./block-renderer";
import {
  applyPreset,
  createBlock,
  duplicateBlock,
  moveBlock,
  reorderBlock,
  type BlockSpan,
  type CanvasBlock,
  type LayoutPreset,
} from "./types";

type SaveStatus = "saved" | "saving" | "error";
type Metadata = { category: string | null; createdAt: string; updatedAt: string; version: number };

const pickerOptions = [
  ["text", "Aa", "Texto"], ["heading", "H1", "Título"],
  ["checklist", "✓", "Checklist"], ["table", "▦", "Tabla"],
  ["prompt", "✦", "Prompt"], ["steps", "1.", "Pasos"],
  ["image", "▧", "Imagen"], ["gallery", "▥", "Galería"],
  ["file", "◫", "Archivo"], ["link", "↗", "Enlace"],
  ["diagram", "⌘", "Diagrama"], ["relations", "⌁", "Relacionado"],
] as const;

const saveLabels: Record<SaveStatus, string> = {
  saved: "Guardado",
  saving: "Guardando...",
  error: "No se pudo guardar",
};

export function CanvasView({ item, initialBlocks, metadata }: { item: CatalogItem; initialBlocks: CanvasBlock[]; metadata: Metadata }) {
  const [title, setTitle] = useState(item.title);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(true);
  const [layout, setLayout] = useState(false);
  const [picker, setPicker] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [selectedId, setSelectedId] = useState(initialBlocks[0]?.id ?? "");
  const [status, setStatus] = useState<SaveStatus>("saved");
  const [liveMetadata, setLiveMetadata] = useState(metadata);
  const [revision, setRevision] = useState(0);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveQueue = useRef<Promise<boolean>>(Promise.resolve(true));
  const latestRevision = useRef(0);
  const savedRevision = useRef(0);
  const pickerInput = useRef<HTMLInputElement>(null);
  const layoutTrigger = useRef<HTMLButtonElement>(null);
  const layoutDialog = useRef<HTMLElement>(null);
  const wasLayoutOpen = useRef(false);
  const latestSnapshot = useRef({ title, blocks });
  useEffect(() => { latestSnapshot.current = { title, blocks }; }, [blocks, title]);

  const markChanged = () => {
    setStatus("saving");
    setRevision((current) => {
      latestRevision.current = current + 1;
      return current + 1;
    });
  };

  const enqueueSave = (nextTitle: string, nextBlocks: CanvasBlock[], nextRevision: number) => {
    const run = async () => {
      if (savedRevision.current >= nextRevision) {
        if (latestRevision.current === nextRevision) setStatus("saved");
        return true;
      }
      setStatus("saving");
      try {
        const result = await saveCanvasAction({ id: item.id, title: nextTitle, blocks: nextBlocks });
        setLiveMetadata((current) => ({ ...current, updatedAt: result.savedAt, version: result.version }));
        savedRevision.current = Math.max(savedRevision.current, nextRevision);
        if (latestRevision.current === nextRevision) setStatus("saved");
        return true;
      } catch {
        setStatus("error");
        return false;
      }
    };
    saveQueue.current = saveQueue.current.then(run, run);
    return saveQueue.current;
  };

  const flushLatest = async () => {
    while (savedRevision.current < latestRevision.current) {
      const targetRevision = latestRevision.current;
      const snapshot = latestSnapshot.current;
      if (!(await enqueueSave(snapshot.title, snapshot.blocks, targetRevision))) return false;
    }
    return true;
  };

  const enqueueSaveEvent = useEffectEvent(enqueueSave);
  useEffect(() => {
    if (!revision) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void enqueueSaveEvent(title, blocks, revision), 700);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [blocks, revision, title]);

  useEffect(() => {
    if (status === "saved") return;
    const preventLoss = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", preventLoss);
    return () => window.removeEventListener("beforeunload", preventLoss);
  }, [status]);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const editing = ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable;
      if (event.key === "Escape") { setLayout(false); setPicker(false); }
      if (event.key === "/" && !editing) { event.preventDefault(); setPicker(true); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        if (saveTimer.current) clearTimeout(saveTimer.current);
        void enqueueSaveEvent(title, blocks, latestRevision.current);
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [blocks, title]);

  useEffect(() => { if (picker) setTimeout(() => pickerInput.current?.focus(), 0); }, [picker]);
  useEffect(() => {
    if (layout) layoutDialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    else if (wasLayoutOpen.current) layoutTrigger.current?.focus();
    wasLayoutOpen.current = layout;
  }, [layout]);

  const trapDialogFocus = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]"));
    if (!controls.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const protectNavigation = async (event: ReactMouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    if (!anchor || status === "saved") return;
    event.preventDefault();
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const saved = await flushLatest();
    if (!saved) return;
    if (anchor.target === "_blank") window.open(anchor.href, "_blank", "noopener,noreferrer");
    else window.location.assign(anchor.href);
  };

  const updateBlocks = (updater: (current: CanvasBlock[]) => CanvasBlock[]) => {
    markChanged();
    setBlocks(updater);
  };
  const patch = (id: string, content: Record<string, unknown>) => updateBlocks((current) => current.map((block) => block.id === id ? { ...block, content } : block));
  const patchTitle = (id: string, nextTitle: string) => updateBlocks((current) => current.map((block) => block.id === id ? { ...block, title: nextTitle } : block));
  const setSpan = (id: string, span: BlockSpan) => updateBlocks((current) => current.map((block) => block.id === id ? { ...block, span } : block));
  const add = (type: Parameters<typeof createBlock>[0]) => {
    const block = createBlock(type, crypto.randomUUID());
    updateBlocks((current) => [...current, block]);
    setSelectedId(block.id);
    setPicker(false);
    setPickerQuery("");
    setTimeout(() => document.getElementById(`block-${block.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };
  const remove = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    const next = blocks.filter((block) => block.id !== id);
    markChanged();
    setBlocks(next);
    if (selectedId === id) setSelectedId(next[Math.min(index, next.length - 1)]?.id ?? "");
  };
  const duplicate = (id: string) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index < 0) return;
    const copy = duplicateBlock(blocks[index], crypto.randomUUID());
    updateBlocks((current) => [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]);
    setSelectedId(copy.id);
  };
  const move = (id: string, direction: -1 | 1) => updateBlocks((current) => moveBlock(current, id, direction));
  const drop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    updateBlocks((current) => reorderBlock(current, draggingId, targetId));
    setDraggingId(null);
  };
  const selectAndScroll = (id: string) => {
    setSelectedId(id);
    document.getElementById(`block-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const retrySave = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await flushLatest();
  };

  const visiblePickerOptions = pickerOptions.filter(([, , label]) => label.toLocaleLowerCase("es").includes(pickerQuery.toLocaleLowerCase("es")));
  const date = (value: string) => new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(new Date(value));

  return (
    <div className="canvas-page" onClickCapture={protectNavigation}>
      <header className="canvas-header">
        <Link href="/catalogo" aria-label="Volver al catálogo"><ArrowLeft /></Link>
        <div className="canvas-name"><div><span>{item.business}</span><code>{item.code}</code></div><input aria-label="Título del elemento" value={title} onChange={(event) => { markChanged(); setTitle(event.target.value); }} /></div>
        <div className={`save-state ${status}`} role="status" aria-live="polite"><i /> <span>{saveLabels[status]}</span>{status === "error" && <button onClick={retrySave}>Reintentar</button>}</div>
        <nav className="canvas-actions" aria-label="Acciones del lienzo">
          <Link href="/buscar"><Search /><span>Buscar</span></Link>
          <button ref={layoutTrigger} onClick={() => setLayout(true)}><LayoutGrid /><span>Layout</span></button>
          <Link href={`/elementos/${item.id}/versiones`}><History /><span>Versiones</span></Link>
          <Link href={`/elementos/${item.id}/relaciones`}><Link2 /><span>Relacionar</span></Link>
          <a href={`/api/elementos/${item.id}/export`}><Download /><span>Exportar</span></a>
          <Link className="primary-action" href={`/elementos/${item.id}/recursos`}><Share2 /><span>Recursos</span></Link>
        </nav>
      </header>

      <div className={`canvas-shell ${left ? "" : "left-closed"} ${right ? "" : "right-closed"}`}>
        {left ? <aside className="outline"><header><b>Contenido</b><button onClick={() => setLeft(false)} aria-label="Cerrar contenido"><PanelLeftClose /></button></header><nav>{blocks.map((block, index) => <button className={selectedId === block.id ? "active" : ""} onClick={() => selectAndScroll(block.id)} key={block.id}><i>{String(index + 1).padStart(2, "0")}</i><span>{block.title || "Sin título"}</span></button>)}</nav><button className="add-section" onClick={() => add("heading")}><Plus /> Agregar sección</button></aside> : <button className="pane-open left" onClick={() => setLeft(true)} aria-label="Abrir contenido"><PanelLeftClose /></button>}

        <main className="canvas-scroll">
          <article className="canvas-document">
            <section className="document-meta" aria-label="Metadatos"><span>Estado <b>{item.status}</b></span>{liveMetadata.category && <span>Categoría <b>{liveMetadata.category}</b></span>}<span>Tipo <b>{item.type}</b></span>{item.tags.map((tag) => <span key={tag}>#{tag}</span>)}</section>
            <div className="block-grid">
              {blocks.map((block, index) => <section id={`block-${block.id}`} className={`canvas-block ${selectedId === block.id ? "selected" : ""} ${draggingId === block.id ? "dragging" : ""}`} style={{ gridColumn: `span ${block.span}` }} key={block.id} onClick={() => setSelectedId(block.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(block.id)}>
                <div className="block-layout">
                  <button className="drag-handle" draggable onDragStart={() => setDraggingId(block.id)} onDragEnd={() => setDraggingId(null)} aria-label={`Arrastrar ${block.title}`}><GripVertical /></button>
                  <input aria-label="Título del bloque" value={block.title} onChange={(event) => patchTitle(block.id, event.target.value)} />
                  <div className="width-tools" aria-label="Ancho del bloque">{([4, 6, 8, 12] as BlockSpan[]).map((span) => <button className={block.span === span ? "active" : ""} aria-label={`Ancho ${span} de 12 columnas`} onClick={() => setSpan(block.id, span)} key={span}>{span === 4 ? "⅓" : span === 6 ? "½" : span === 8 ? "⅔" : "1/1"}</button>)}</div>
                  <div className="block-actions"><button disabled={index === 0} onClick={() => move(block.id, -1)} aria-label="Mover arriba"><ArrowUp /></button><button disabled={index === blocks.length - 1} onClick={() => move(block.id, 1)} aria-label="Mover abajo"><ArrowDown /></button><button onClick={() => duplicate(block.id)} aria-label="Duplicar bloque"><Copy /></button><button onClick={() => remove(block.id)} aria-label="Eliminar bloque"><Trash2 /></button></div>
                </div>
                <BlockRenderer block={block} itemId={item.id} onChange={(content) => patch(block.id, content)} />
              </section>)}
            </div>
            <div className="insert-line"><i /><button onClick={() => setPicker(true)} aria-label="Agregar bloque"><Plus /></button><i /></div>
            <p className="slash-help">Escribe <kbd>/</kbd> para insertar un bloque o <button onClick={() => setPicker(true)}>haz clic aquí</button></p>
          </article>
        </main>

        {right ? <aside className="properties"><header><b>Propiedades</b><button onClick={() => setRight(false)} aria-label="Cerrar propiedades"><PanelRightClose /></button></header><dl className="property-list"><div><dt>Empresa</dt><dd>{item.business}</dd></div><div><dt>Estado</dt><dd>{item.status}</dd></div><div><dt>Tipo</dt><dd>{item.type}</dd></div>{liveMetadata.category && <div><dt>Categoría</dt><dd>{liveMetadata.category}</dd></div>}<div><dt>Etiquetas</dt><dd className="property-tags">{item.tags.length ? item.tags.map((tag) => <span key={tag}>{tag}</span>) : "Sin etiquetas"}</dd></div><div><dt>Descripción</dt><dd>{item.description || "Sin descripción"}</dd></div><div><dt>Creado</dt><dd>{date(liveMetadata.createdAt)}</dd></div><div><dt>Modificado</dt><dd>{date(liveMetadata.updatedAt)}</dd></div><div><dt>Versión</dt><dd>{liveMetadata.version ? `v${liveMetadata.version}` : "Sin versiones"}</dd></div><div><dt>Bloques</dt><dd>{blocks.length}</dd></div></dl><div className="property-links"><Link href={`/elementos/${item.id}/recursos`}>Gestionar recursos</Link><Link href={`/elementos/${item.id}/relaciones`}>Gestionar relaciones</Link></div></aside> : <button className="pane-open right" onClick={() => setRight(true)} aria-label="Abrir propiedades"><PanelRightClose /></button>}
      </div>

      {picker && <div className="block-picker" role="dialog" aria-modal="true" aria-labelledby="block-picker-title"><label><Search /> <span id="block-picker-title">Buscar bloque</span><input ref={pickerInput} value={pickerQuery} onChange={(event) => setPickerQuery(event.target.value)} placeholder="Buscar bloque..." /><button onClick={() => setPicker(false)} aria-label="Cerrar selector"><X /></button></label><small>BLOQUES</small><div>{visiblePickerOptions.map(([type, icon, label]) => <button onClick={() => add(type)} key={type}><span>{icon}</span>{label}</button>)}</div>{visiblePickerOptions.length === 0 && <p>No hay bloques con ese nombre.</p>}</div>}

      {layout && <div className="canvas-overlay" onMouseDown={() => setLayout(false)}><section ref={layoutDialog} className="layout-dialog" role="dialog" aria-modal="true" aria-labelledby="layout-title" onKeyDown={trapDialogFocus} onMouseDown={(event) => event.stopPropagation()}><header><div><small>DISEÑO DEL LIENZO</small><h2 id="layout-title">Organiza el workspace a tu manera</h2><p>Los bloques siguen una cuadrícula de 12 columnas. Aplica una composición y ajusta cada bloque cuando lo necesites.</p></div><button onClick={() => setLayout(false)} aria-label="Cerrar layout"><X /></button></header><div className="layout-presets">{([ ["one", "Una columna", "Lectura tradicional"], ["two", "Dos columnas", "Comparar contenido"], ["three", "Tres columnas", "Workspace compacto"], ["free", "Composición libre", "Mezcla de anchos"] ] as [LayoutPreset, string, string][]).map(([preset, label, detail]) => <button key={preset} onClick={() => { updateBlocks((current) => applyPreset(current, preset)); setLayout(false); }}><LayoutGrid /><b>{label}</b><small>{detail}</small></button>)}</div><div className="layout-help"><GripVertical /><p><b>Arrastra cualquier bloque para reordenarlo.</b><br />También puedes usar Mover arriba/abajo y los controles ⅓, ½, ⅔ y 1/1.</p></div><footer><span>El layout se guarda dentro de este elemento.</span><button className="primary-action" onClick={() => setLayout(false)}>Listo</button></footer></section></div>}
    </div>
  );
}
