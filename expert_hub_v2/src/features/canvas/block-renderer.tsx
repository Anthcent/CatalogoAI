"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Copy, ExternalLink, FileText, ImagePlus, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { generateSummaryAction } from "@/features/ai/actions";
import { visualAssets } from "@/features/assets/data";
import type { CanvasBlock } from "./types";

type Change = (content: Record<string, unknown>) => void;
type Step = { id: string; title: string; detail: string; done: boolean };
type CheckItem = { id: string; text: string; done: boolean };

const text = (value: unknown) => String(value ?? "");
const strings = (value: unknown) => Array.isArray(value) ? value.map(text) : [];

function AssetPicker({ onPick, onClose }: { onPick: (file: string) => void; onClose: () => void }) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);
  const assets = visualAssets.filter((asset) =>
    `${asset.label} ${asset.category}`.toLocaleLowerCase("es").includes(query.toLocaleLowerCase("es")),
  );
  return (
    <div className="canvas-overlay" onMouseDown={onClose}>
      <section className="asset-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="asset-picker-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><div><small>BIBLIOTECA VISUAL</small><h2 id="asset-picker-title">Elegir gráfico</h2></div><button onClick={onClose} aria-label="Cerrar selector"><X /></button></header>
        <label className="picker-search">Buscar gráfico<input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Stickers, clases, código..." /></label>
        <div className="asset-picker-grid">
          {assets.map((asset) => (
            <button key={asset.id} onClick={() => { onPick(asset.file); onClose(); }}>
              <span><Image src={`/api/mockup-assets/${asset.file}`} alt="" fill sizes="120px" /></span>
              <b>{asset.label}</b><small>{asset.category}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export function BlockRenderer({ block, onChange, itemId }: { block: CanvasBlock; onChange: Change; itemId: string }) {
  const content = block.content;
  const [picker, setPicker] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [generating, startGenerating] = useTransition();

  if (block.type === "text")
    return <textarea className="doc-text" aria-label="Contenido de texto" value={text(content.text ?? content.html)} onChange={(event) => onChange({ ...content, text: event.target.value })} />;

  if (block.type === "heading") {
    const level = Number(content.level) === 3 ? 3 : 2;
    return <div className="heading-editor"><label>Nivel<select value={level} onChange={(event) => onChange({ ...content, level: Number(event.target.value) })}><option value={2}>H2</option><option value={3}>H3</option></select></label><input className={`heading-${level}`} aria-label="Texto del título" value={text(content.text)} onChange={(event) => onChange({ ...content, text: event.target.value })} /></div>;
  }

  if (block.type === "ai")
    return <div className="ai-summary"><Sparkles /><div><b>Resumen generado por Gemini</b><p>{text(content.text)}</p>{summaryError && <small role="alert">{summaryError}</small>}</div><button disabled={generating} onClick={() => startGenerating(async () => { setSummaryError(""); try { onChange({ ...content, text: await generateSummaryAction(itemId) }); } catch (error) { setSummaryError(error instanceof Error ? error.message : "No se pudo generar el resumen"); } })}>{generating ? "Generando..." : "Regenerar"}</button></div>;

  if (block.type === "callout")
    return <div className="callout-editor"><span>◎</span><textarea aria-label="Contenido destacado" value={text(content.text)} onChange={(event) => onChange({ ...content, text: event.target.value })} /></div>;

  if (block.type === "checklist") {
    const items: CheckItem[] = Array.isArray(content.items) ? content.items.map((item, index) => typeof item === "object" && item ? { id: text((item as CheckItem).id) || `item-${index}`, text: text((item as CheckItem).text), done: Boolean((item as CheckItem).done ?? (item as CheckItem & { checked?: boolean }).checked) } : { id: `item-${index}`, text: text(item), done: false }) : [];
    const update = (next: CheckItem[]) => onChange({ ...content, items: next });
    return <div className="checklist-editor">{items.map((item, index) => <div key={item.id}><input aria-label={`Completar ${item.text}`} type="checkbox" checked={item.done} onChange={() => update(items.map((current, i) => i === index ? { ...current, done: !current.done } : current))} /><input value={item.text} aria-label={`Tarea ${index + 1}`} onChange={(event) => update(items.map((current, i) => i === index ? { ...current, text: event.target.value } : current))} /><button aria-label={`Eliminar tarea ${index + 1}`} onClick={() => update(items.filter((_, i) => i !== index))}><Trash2 /></button></div>)}<button className="inline-add" onClick={() => update([...items, { id: crypto.randomUUID(), text: "Nueva tarea", done: false }])}><Plus /> Agregar tarea</button></div>;
  }

  if (block.type === "table") {
    const rows = Array.isArray(content.rows) ? content.rows.map((row) => strings(row)) : [[""]];
    const columns = Math.max(1, ...rows.map((row) => row.length));
    const updateCell = (row: number, column: number, value: string) => onChange({ ...content, rows: rows.map((current, r) => r === row ? Array.from({ length: columns }, (_, c) => c === column ? value : current[c] ?? "") : current) });
    return <div className="table-editor"><div className="table-scroll"><table><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{Array.from({ length: columns }, (_, columnIndex) => <td key={columnIndex}><input aria-label={`Fila ${rowIndex + 1}, columna ${columnIndex + 1}`} value={row[columnIndex] ?? ""} onChange={(event) => updateCell(rowIndex, columnIndex, event.target.value)} /></td>)}</tr>)}</tbody></table></div><div className="table-actions"><button onClick={() => onChange({ ...content, rows: [...rows, Array(columns).fill("")] })}>+ Fila</button><button onClick={() => onChange({ ...content, rows: rows.map((row) => [...row, ""]) })}>+ Columna</button>{rows.length > 1 && <button onClick={() => onChange({ ...content, rows: rows.slice(0, -1) })}>Quitar fila</button>}{columns > 1 && <button onClick={() => onChange({ ...content, rows: rows.map((row) => row.slice(0, -1)) })}>Quitar columna</button>}</div></div>;
  }

  if (block.type === "prompt") {
    const variables = strings(content.variables);
    return <div className="prompt-card"><div className="prompt-meta"><label>Modelo<input value={text(content.model)} onChange={(event) => onChange({ ...content, model: event.target.value })} /></label><label>Herramienta<input value={text(content.tool)} onChange={(event) => onChange({ ...content, tool: event.target.value })} /></label><label>Uso<input value={text(content.usage)} onChange={(event) => onChange({ ...content, usage: event.target.value })} /></label></div><textarea className="prompt-text" aria-label="Prompt" value={text(content.text)} onChange={(event) => onChange({ ...content, text: event.target.value })} /><label className="variables-editor">Variables<input value={variables.join(", ")} onChange={(event) => onChange({ ...content, variables: event.target.value.split(",").map((value) => value.trim()).filter(Boolean) })} /></label><button onClick={async () => { try { await navigator.clipboard.writeText(text(content.text)); setFeedback("Prompt copiado"); } catch { setFeedback("El navegador bloqueó el portapapeles"); } }}><Copy /> Copiar prompt</button><span className="action-feedback" role="status" aria-live="polite">{feedback}</span></div>;
  }

  if (block.type === "steps") {
    const steps: Step[] = Array.isArray(content.steps) ? content.steps.map((step, index) => typeof step === "string" ? { id: `step-${index}`, title: step, detail: "", done: strings(content.done).includes(String(index)) } : { id: text((step as Step).id) || `step-${index}`, title: text((step as Step).title), detail: text((step as Step).detail), done: Boolean((step as Step).done) }) : [];
    const update = (next: Step[]) => onChange({ ...content, steps: next });
    return <div className="steps-editor"><div className="progress-row"><span>{steps.filter((step) => step.done).length} de {steps.length}</span><progress value={steps.filter((step) => step.done).length} max={Math.max(1, steps.length)} /></div>{steps.map((step, index) => <div className={step.done ? "done" : ""} key={step.id}><input type="checkbox" aria-label={`Completar paso ${index + 1}`} checked={step.done} onChange={() => update(steps.map((current, i) => i === index ? { ...current, done: !current.done } : current))} /><i>{step.done ? <Check /> : index + 1}</i><span><input aria-label={`Título del paso ${index + 1}`} value={step.title} onChange={(event) => update(steps.map((current, i) => i === index ? { ...current, title: event.target.value } : current))} /><input aria-label={`Detalle del paso ${index + 1}`} value={step.detail} placeholder="Detalle opcional" onChange={(event) => update(steps.map((current, i) => i === index ? { ...current, detail: event.target.value } : current))} /></span><button aria-label={`Eliminar paso ${index + 1}`} onClick={() => update(steps.filter((_, i) => i !== index))}><Trash2 /></button></div>)}<button className="inline-add" onClick={() => update([...steps, { id: crypto.randomUUID(), title: "Nuevo paso", detail: "", done: false }])}><Plus /> Agregar paso</button></div>;
  }

  if (block.type === "image") {
    const image = text(content.image);
    return <div className="image-editor">{image ? <div><Image src={`/api/mockup-assets/${image}`} alt={text(content.alt)} fill sizes="600px" /></div> : <p>Selecciona un gráfico de la biblioteca visual.</p>}<label>Texto alternativo<input value={text(content.alt)} onChange={(event) => onChange({ ...content, alt: event.target.value })} /></label><button onClick={() => setPicker(true)}><ImagePlus /> {image ? "Cambiar gráfico" : "Elegir gráfico"}</button>{image && <button onClick={() => onChange({ ...content, image: "" })}><Trash2 /> Quitar</button>}{picker && <AssetPicker onClose={() => setPicker(false)} onPick={(file) => onChange({ ...content, image: file })} />}</div>;
  }

  if (block.type === "gallery") {
    const images = strings(content.images);
    return <div className="gallery-editor"><div className="canvas-gallery">{images.map((image, index) => <div key={`${image}-${index}`}><Image src={`/api/mockup-assets/${image}`} alt="" fill sizes="220px" /><button aria-label={`Quitar imagen ${index + 1}`} onClick={() => onChange({ ...content, images: images.filter((_, i) => i !== index) })}><X /></button></div>)}<button className="add-image" onClick={() => setPicker(true)}><ImagePlus /> Agregar</button></div>{picker && <AssetPicker onClose={() => setPicker(false)} onPick={(file) => onChange({ ...content, images: [...images, file] })} />}</div>;
  }

  if (block.type === "file")
    return <div className="resource-card"><FileText /><div><input aria-label="Etiqueta del archivo" value={text(content.name)} onChange={(event) => onChange({ ...content, name: event.target.value })} /><small>Gestiona archivos reales asociados a este elemento.</small></div><Link href={`/elementos/${itemId}/recursos`}>Abrir recursos <ExternalLink /></Link></div>;

  if (block.type === "link") {
    const url = text(content.url);
    const safeUrl = /^https?:\/\//i.test(url) ? url : "";
    return <div className="link-editor"><label>Texto<input value={text(content.label)} onChange={(event) => onChange({ ...content, label: event.target.value })} /></label><label>URL<input type="url" value={url} onChange={(event) => onChange({ ...content, url: event.target.value })} /></label>{safeUrl ? <a href={safeUrl} target="_blank" rel="noreferrer">Abrir enlace <ExternalLink /></a> : <small>Escribe una URL completa que comience con http:// o https://.</small>}</div>;
  }

  if (block.type === "diagram") {
    const nodes = strings(content.nodes);
    return <div className="diagram-editor"><div>{nodes.map((node, index) => <span key={index}><input aria-label={`Nodo ${index + 1}`} value={node} onChange={(event) => onChange({ ...content, nodes: nodes.map((current, i) => i === index ? event.target.value : current) })} /><button aria-label={`Eliminar nodo ${index + 1}`} onClick={() => onChange({ ...content, nodes: nodes.filter((_, i) => i !== index) })}><X /></button>{index < nodes.length - 1 && <b>→</b>}</span>)}</div><button className="inline-add" onClick={() => onChange({ ...content, nodes: [...nodes, "Nuevo nodo"] })}><Plus /> Agregar nodo</button></div>;
  }

  const items = strings(content.items);
  return <div className="relations-block">{items.map((item, index) => <div key={`${item}-${index}`}><span>{item}</span><button aria-label={`Quitar relación ${index + 1}`} onClick={() => onChange({ ...content, items: items.filter((_, i) => i !== index) })}><X /></button></div>)}<Link href={`/elementos/${itemId}/relaciones`}><Plus /> Gestionar relaciones</Link></div>;
}
