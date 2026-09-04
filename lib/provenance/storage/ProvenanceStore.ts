/**
 * ProvenanceStore Interface
 * Storage abstraction separating provenance logic from underlying database / blockchain anchors.
 */

import { ContentFingerprint } from '../models/ContentFingerprint';
import { ProvenanceRecord } from '../models/ProvenanceRecord';

export interface ProvenanceStore {
  /**
   * Persists or updates a content asset fingerprint.
   */
  saveFingerprint(fingerprint: ContentFingerprint): Promise<void>;

  /**
   * Retrieves the current fingerprint record for a specific content asset.
   */
  getFingerprintByContentId(contentId: string): Promise<ContentFingerprint | null>;

  /**
   * Finds any assets matching an exact cryptographic fingerprint.
   */
  findFingerprintsByHash(fingerprint: string): Promise<ContentFingerprint[]>;

  /**
   * Appends an immutable provenance audit record (version lineage).
   */
  saveProvenanceRecord(record: ProvenanceRecord): Promise<void>;

  /**
   * Retrieves the full immutable provenance lineage for an asset.
   */
  getProvenanceHistory(contentId: string): Promise<ProvenanceRecord[]>;

  /**
   * Retrieves all candidate fingerprints for similarity scanning.
   */
  getAllFingerprintsForSimilarity(excludeContentId?: string): Promise<ContentFingerprint[]>;
}
