"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export function AssetUploader({ itemId }: { itemId: string }) {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [status, setStatus] = useState("");
  async function upload(file: File) {
    setStatus("Cargando...");
    const body = new FormData(); body.set("file", file);
    const response = await fetch(`/api/items/${itemId}/assets`, { method: "POST", body });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setStatus(result.error ?? "No se pudo cargar el archivo."); return; }
    setStatus("Archivo cargado."); input.current!.value = ""; router.refresh();
  }
  return <div className="upload-zone"><Upload size={24}/><div><b>Adjuntar archivo</b><p className="subtle">Imágenes, PDF, audio, video y documentos de hasta 10 MB.</p></div><input ref={input} type="file" onChange={event=>event.target.files?.[0]&&upload(event.target.files[0])}/>{status&&<small aria-live="polite">{status}</small>}</div>;
}
