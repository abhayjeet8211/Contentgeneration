/**
 * ProvenanceRecord Model
 * Represents an immutable audit trail entry tracking asset origin, version lineages, and creator type.
 */

export interface ProvenanceRecord {
  id: string;
  contentId: string;
  contentFingerprint: string;
  parentFingerprint?: string | null;
  simHash?: string | null;
  creatorType: 'user' | 'system' | 'ai';
  creatorId?: string | null;
  algorithm: string;
  fingerprintVersion: string;
  contentType: string;
  createdAt: Date;
}
