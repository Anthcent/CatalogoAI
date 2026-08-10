"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ResourceUploader({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  return (
    <form
      className="quick-capture"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("Subiendo...");
        const response = await fetch(`/api/elementos/${itemId}/assets`, {
          method: "POST",
          body: new FormData(event.currentTarget),
        });
        const result = await response.json();
        setStatus(response.ok ? "Archivo cargado" : result.error);
        if (response.ok) {
          event.currentTarget.reset();
          router.refresh();
        }
      }}
    >
      <Upload />
      <input
        type="file"
        name="file"
        required
        accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf,text/plain,text/markdown"
      />
      <button>Subir</button>
      <span>{status}</span>
    </form>
  );
}
