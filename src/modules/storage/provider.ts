export type StoredAsset = { path: string; fileName: string; mimeType: string; size: number };

export interface StorageProvider {
  upload(file: File): Promise<StoredAsset>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}
