import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

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

  const fileExt = path.extname(originalFilename).toLowerCase().replace(/[^a-z0-9_.]/g, '');
  const rawBase = path.basename(originalFilename, path.extname(originalFilename));
  const safeBase = rawBase.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 60) || 'upload';
  const uniqueId = crypto.randomBytes(6).toString('hex');
  const filename = `${safeBase}_${uniqueId}${fileExt}`;

  // Ensure filePath is strictly resolved inside UPLOAD_DIR
  const filePath = path.resolve(UPLOAD_DIR, filename);
  if (!filePath.startsWith(path.resolve(UPLOAD_DIR))) {
    throw new Error('Path traversal detected in upload storage path resolution.');
  }

  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    filename,
    size: buffer.length,
    mimeType,
  };
}
