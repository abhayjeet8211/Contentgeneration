import crypto from 'crypto';

export interface ContentHashMetadata {
  contentHash: string;
  hashAlgorithm: 'SHA-256';
  sizeBytes: number;
  timestamp: string;
}

export class ContentHashService {
  public static hashBuffer(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  public static hashText(text: string): string {
    // Normalize newlines and whitespace before hashing text
    const normalized = text.replace(/\r\n/g, '\n').trim();
    return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
  }

  public static getBufferMetadata(buffer: Buffer): ContentHashMetadata {
    return {
      contentHash: this.hashBuffer(buffer),
      hashAlgorithm: 'SHA-256',
      sizeBytes: buffer.length,
      timestamp: new Date().toISOString(),
    };
  }

  public static getTextMetadata(text: string): ContentHashMetadata {
    const normalized = text.replace(/\r\n/g, '\n').trim();
    const buf = Buffer.from(normalized, 'utf8');
    return {
      contentHash: this.hashText(text),
      hashAlgorithm: 'SHA-256',
      sizeBytes: buf.length,
      timestamp: new Date().toISOString(),
    };
  }
}
