"use client";
import Image from "next/image";
import { Check, Copy, Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { generateSummaryAction } from "@/features/ai/actions";
import type { CanvasBlock } from "./types";
export function BlockRenderer({
  block,
  onChange,
  itemId,
}: {
  block: CanvasBlock;
  onChange: (content: Record<string, unknown>) => void;
  itemId: string;
}) {
  const content = block.content;
  const [summaryError, setSummaryError] = useState("");
  const [generating, startGenerating] = useTransition();
  if (block.type === "text")
    return (
      <div
        className="doc-text"
        contentEditable
        suppressContentEditableWarning
        onInput={(event) =>
          onChange({ ...content, html: event.currentTarget.innerText })
        }
      >
        {String(content.html ?? "").replace(/<[^>]+>/g, " ")}
      </div>
    );
  if (block.type === "ai")
    return (
      <div className="ai-summary">
        <Sparkles />
        <p>{String(content.text ?? "")}</p>
        <button
          disabled={generating}
          onClick={() =>
            startGenerating(async () => {
              setSummaryError("");
              try {
                onChange({
                  ...content,
                  text: await generateSummaryAction(itemId),
                });
              } catch (error) {
                setSummaryError(
                  error instanceof Error
                    ? error.message
                    : "No se pudo generar el resumen",
                );
              }
            })
          }
        >
          {generating ? "Generando..." : "Regenerar"}
        </button>
        {summaryError && <small>{summaryError}</small>}
      </div>
    );
  if (block.type === "callout")
    return (
      <div className="callout">
        <b>Objetivo principal</b>
        <p contentEditable suppressContentEditableWarning>
          {String(content.text ?? "")}
        </p>
      </div>
    );
  if (block.type === "prompt")
    return (
      <div className="prompt-card">
        <div className="prompt-meta">
          <span>
            Modelo <b>{String(content.model)}</b>
          </span>
          <span>
            Herramienta <b>{String(content.tool)}</b>
          </span>
          <span>
            Uso <b>{String(content.usage)}</b>
          </span>
        </div>
        <div className="prompt-vars">
          {(content.variables as string[]).map((variable) => (
            <span key={variable}>{`{${variable}}`}</span>
          ))}
        </div>
        <pre>{String(content.text)}</pre>
        <button
          onClick={() => navigator.clipboard.writeText(String(content.text))}
        >
          <Copy />
          Copiar prompt
        </button>
      </div>
    );
  if (block.type === "steps") {
    const steps = content.steps as string[];
    const done = (content.done as number[] | undefined) ?? [];
    return (
      <div className="steps">
        <header>
          <span>
            {done.length} de {steps.length}
          </span>
          <progress value={done.length} max={steps.length} />
        </header>
        {steps.map((step, index) => (
          <label className={done.includes(index) ? "done" : ""} key={step}>
            <input
              type="checkbox"
              checked={done.includes(index)}
              onChange={() =>
                onChange({
                  ...content,
                  done: done.includes(index)
                    ? done.filter((value) => value !== index)
                    : [...done, index],
                })
              }
            />
            <i>{done.includes(index) ? <Check /> : index + 1}</i>
            <span>{step}</span>
          </label>
        ))}
        <button>+ Agregar paso</button>
      </div>
    );
  }
  if (block.type === "gallery")
    return (
      <div className="canvas-gallery">
        {(content.images as string[]).map((image) => (
          <button key={image}>
            <Image
              src={`/api/mockup-assets/${image}`}
              alt=""
              fill
              sizes="220px"
            />
          </button>
        ))}
        <button className="add-image">+ Agregar asset</button>
      </div>
    );
  if (block.type === "diagram")
    return (
      <div className="diagram">
        {(content.nodes as string[]).map((node, index) => (
          <div key={node}>
            <span>{node}</span>
            {index < (content.nodes as string[]).length - 1 && <b>↓</b>}
          </div>
        ))}
        <button>Editar diagrama</button>
      </div>
    );
  if (block.type === "relations")
    return (
      <div className="relations-block">
        {(content.items as string[]).map((item) => (
          <button key={item}>
            {item}
            <span>→</span>
          </button>
        ))}
        <button className="add-relation">+ Relacionar elemento</button>
      </div>
    );
  return null;
}
