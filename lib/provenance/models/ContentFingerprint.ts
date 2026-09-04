/**
 * ContentFingerprint Model
 * Represents the persistent cryptographic and similarity identity for a generated content asset.
 */

export interface ContentFingerprint {
  id: string;
  contentId: string;
  projectId: string;
  fingerprint: string; // Cryptographic SHA-256 hex digest
  simHash?: string; // 64-bit SimHash hex digest
  algorithm: string; // Default: "SHA-256"
  fingerprintVersion: string; // Default: "1"
  contentType: string; // e.g. "LINKEDIN", "BLOG", "VIDEO", "PRESENTATION", "INFOGRAPHIC"
  canonicalBytes?: number;
  createdAt: Date;
}
