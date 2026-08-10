import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_SIZE = 10 * 1024 * 1024;
const UPLOADS_DIR =
  process.env.UPLOADS_DIR ?? path.join(process.cwd(), "uploads");
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "text/markdown",
]);

export async function storeFile(file: File) {
  if (!ALLOWED.has(file.type)) throw new Error("Tipo de archivo no permitido.");
  if (!file.size || file.size > MAX_SIZE)
    throw new Error("El archivo debe pesar menos de 10 MB.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-180);
  const storedPath = `${randomUUID()}-${safeName}`;
  await mkdir(UPLOADS_DIR, { recursive: true });
  await writeFile(
    path.join(UPLOADS_DIR, storedPath),
    Buffer.from(await file.arrayBuffer()),
  );
  return {
    path: storedPath,
    fileName: safeName,
    mimeType: file.type,
    size: file.size,
  };
}

export async function removeFile(storedPath: string) {
  await unlink(path.join(UPLOADS_DIR, path.basename(storedPath)));
}

export async function loadFile(storedPath: string) {
  return readFile(
    path.join(UPLOADS_DIR, path.basename(storedPath)),
  );
}
