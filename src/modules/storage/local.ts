import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { StorageProvider, StoredAsset } from "./provider";

const MAX_SIZE = 10 * 1024 * 1024;

export class LocalStorageProvider implements StorageProvider {
  async upload(file: File): Promise<StoredAsset> {
    if (file.size > MAX_SIZE) throw new Error("File exceeds the 10 MB limit.");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storedName = `${randomUUID()}-${safeName}`;
    const directory = path.join(process.cwd(), "uploads");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, storedName), Buffer.from(await file.arrayBuffer()));
    return { path: storedName, fileName: safeName, mimeType: file.type || "application/octet-stream", size: file.size };
  }
  async delete(storedPath: string) { await unlink(path.join(process.cwd(), "uploads", path.basename(storedPath))); }
  getUrl(storedPath: string) { return `/api/assets/${encodeURIComponent(storedPath)}`; }
}
