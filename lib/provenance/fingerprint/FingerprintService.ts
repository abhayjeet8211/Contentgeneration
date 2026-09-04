/**
 * FingerprintService
 * High-level orchestration for generating content fingerprints and recording provenance.
 */

import crypto from 'crypto';
import { CryptographicFingerprintService } from './CryptographicFingerprintService';
import { SimilarityFingerprintService } from './SimilarityFingerprintService';
import { ProvenanceStore } from '../storage/ProvenanceStore';
import { DatabaseProvenanceStore } from '../storage/DatabaseProvenanceStore';
import { ContentFingerprint } from '../models/ContentFingerprint';
import { ProvenanceRecord } from '../models/ProvenanceRecord';
import { provenanceConfig } from '../config/ProvenanceConfig';

export interface GenerateProvenanceOptions {
  contentId: string;
  projectId: string;
  contentType: string;
  creatorType?: 'user' | 'system' | 'ai';
  creatorId?: string;
  parentFingerprint?: string | null;
}

export class FingerprintService {
  private store: ProvenanceStore;

  constructor(store?: ProvenanceStore) {
    this.store = store || new DatabaseProvenanceStore();
  }

  /**
   * Generates SHA-256 fingerprint, SimHash, and creates both ContentFingerprint and ProvenanceRecord.
   */
  public async generateAndStoreProvenance(
    content: unknown,
    options: GenerateProvenanceOptions
  ): Promise<{
    fingerprint: ContentFingerprint;
    provenanceRecord: ProvenanceRecord;
  }> {
    const { fingerprint, canonicalLength } = CryptographicFingerprintService.generateFingerprint(
      content,
      options.contentType
    );

    const simHash = SimilarityFingerprintService.generateSimHash(content, options.contentType);

    const now = new Date();
    const algorithm = provenanceConfig.get('fingerprintAlgorithm');
    const fingerprintVersion = provenanceConfig.get('fingerprintVersion');

    const contentFingerprint: ContentFingerprint = {
      id: crypto.randomUUID(),
      contentId: options.contentId,
      projectId: options.projectId,
      fingerprint,
      simHash,
      algorithm,
      fingerprintVersion,
      contentType: options.contentType,
      canonicalBytes: canonicalLength,
      createdAt: now,
    };

    const provenanceRecord: ProvenanceRecord = {
      id: crypto.randomUUID(),
      contentId: options.contentId,
      contentFingerprint: fingerprint,
      parentFingerprint: options.parentFingerprint || null,
      simHash,
      creatorType: options.creatorType || 'ai',
      creatorId: options.creatorId || null,
      algorithm,
      fingerprintVersion,
      contentType: options.contentType,
      createdAt: now,
    };

    // Persist to store
    await this.store.saveFingerprint(contentFingerprint);
    await this.store.saveProvenanceRecord(provenanceRecord);

    return {
      fingerprint: contentFingerprint,
      provenanceRecord,
    };
  }

  /**
   * Directly computes cryptographic and similarity fingerprint without persisting.
   */
  public generateFingerprintsOnly(
    content: unknown,
    contentType: string = 'text'
  ): {
    fingerprint: string;
    simHash: string;
    canonicalLength: number;
    canonicalText: string;
  } {
    const { fingerprint, canonicalLength, canonicalText } = CryptographicFingerprintService.generateFingerprint(
      content,
      contentType
    );
    const simHash = SimilarityFingerprintService.generateSimHash(content, contentType);

    return {
      fingerprint,
      simHash,
      canonicalLength,
      canonicalText,
    };
  }

  public getStore(): ProvenanceStore {
    return this.store;
  }
}

export const fingerprintService = new FingerprintService();
