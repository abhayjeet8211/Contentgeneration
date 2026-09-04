/**
 * ContentVersionService
 * Manages version creation, parent-child fingerprint linkages, and provenance lineage history.
 */

import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { FingerprintService } from '../fingerprint/FingerprintService';
import { ProvenanceStore } from '../storage/ProvenanceStore';
import { DatabaseProvenanceStore } from '../storage/DatabaseProvenanceStore';
import { ContentFingerprint } from '../models/ContentFingerprint';
import { ProvenanceRecord } from '../models/ProvenanceRecord';

export interface CreateVersionOptions {
  contentId: string;
  projectId: string;
  contentType: string;
  newBody: string;
  changeSummary?: string;
  creatorType?: 'user' | 'system' | 'ai';
  creatorId?: string;
}

export class ContentVersionService {
  private fingerprintService: FingerprintService;
  private store: ProvenanceStore;

  constructor(store?: ProvenanceStore) {
    this.store = store || new DatabaseProvenanceStore();
    this.fingerprintService = new FingerprintService(this.store);
  }

  /**
   * Creates a new content version and links its provenance to the previous version's fingerprint.
   */
  public async createNewVersion(options: CreateVersionOptions): Promise<{
    versionNumber: number;
    fingerprint: ContentFingerprint;
    provenanceRecord: ProvenanceRecord;
  }> {
    // 1. Get current active fingerprint to use as parent
    const currentFingerprint = await this.store.getFingerprintByContentId(options.contentId);
    const parentFingerprint = currentFingerprint ? currentFingerprint.fingerprint : null;

    // 2. Generate new fingerprint and provenance record
    const { fingerprint, provenanceRecord } = await this.fingerprintService.generateAndStoreProvenance(
      options.newBody,
      {
        contentId: options.contentId,
        projectId: options.projectId,
        contentType: options.contentType,
        creatorType: options.creatorType || 'user',
        creatorId: options.creatorId,
        parentFingerprint,
      }
    );

    // 3. Count existing versions in Prisma
    const versionCount = await prisma.contentVersion.count({
      where: { contentId: options.contentId },
    });
    const nextVersionNumber = versionCount + 1;

    // 4. Create ContentVersion record in DB with fingerprint metadata
    await prisma.contentVersion.create({
      data: {
        id: crypto.randomUUID(),
        contentId: options.contentId,
        versionNumber: nextVersionNumber,
        body: options.newBody,
        changeSummary: options.changeSummary || `Version ${nextVersionNumber}`,
        parentFingerprint,
        fingerprint: fingerprint.fingerprint,
        simHash: fingerprint.simHash || null,
      },
    });

    return {
      versionNumber: nextVersionNumber,
      fingerprint,
      provenanceRecord,
    };
  }

  /**
   * Retrieves full version history with fingerprints for an asset.
   */
  public async getVersionHistory(contentId: string) {
    return prisma.contentVersion.findMany({
      where: { contentId },
      orderBy: { versionNumber: 'desc' },
    });
  }

  /**
   * Retrieves immutable provenance lineage chain for an asset.
   */
  public async getProvenanceLineage(contentId: string): Promise<ProvenanceRecord[]> {
    return this.store.getProvenanceHistory(contentId);
  }
}

export const contentVersionService = new ContentVersionService();
