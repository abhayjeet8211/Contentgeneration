import fs from 'fs/promises';
import path from 'path';
import { crypto } from 'next/dist/compiled/@edge-runtime/primitives';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export interface StoredFile {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export async function ensureUploadDirExists() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveUploadedFile(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<StoredFile> {
  await ensureUploadDirExists();

  const fileExt = path.extname(originalFilename);
  const safeBase = path.basename(originalFilename, fileExt).replace(/[^a-zA-Z0-9_-]/g, '_');
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const filename = `${safeBase}_${uniqueId}${fileExt}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    filename,
    size: buffer.length,
    mimeType,
  };
}
