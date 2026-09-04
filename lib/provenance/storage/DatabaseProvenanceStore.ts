/**
 * DatabaseProvenanceStore
 * Prisma ORM implementation of ProvenanceStore.
 */

import { prisma } from '@/lib/db/prisma';
import { ProvenanceStore } from './ProvenanceStore';
import { ContentFingerprint } from '../models/ContentFingerprint';
import { ProvenanceRecord } from '../models/ProvenanceRecord';

export class DatabaseProvenanceStore implements ProvenanceStore {
  public async saveFingerprint(data: ContentFingerprint): Promise<void> {
    await prisma.contentFingerprint.upsert({
      where: { contentId: data.contentId },
      update: {
        fingerprint: data.fingerprint,
        simHash: data.simHash || null,
        algorithm: data.algorithm,
        fingerprintVersion: data.fingerprintVersion,
        contentType: data.contentType,
        canonicalBytes: data.canonicalBytes || null,
      },
      create: {
        id: data.id,
        contentId: data.contentId,
        projectId: data.projectId,
        fingerprint: data.fingerprint,
        simHash: data.simHash || null,
        algorithm: data.algorithm,
        fingerprintVersion: data.fingerprintVersion,
        contentType: data.contentType,
        canonicalBytes: data.canonicalBytes || null,
        createdAt: data.createdAt,
      },
    });
  }

  public async getFingerprintByContentId(contentId: string): Promise<ContentFingerprint | null> {
    const record = await prisma.contentFingerprint.findUnique({
      where: { contentId },
    });

    if (!record) return null;

    return {
      id: record.id,
      contentId: record.contentId,
      projectId: record.projectId,
      fingerprint: record.fingerprint,
      simHash: record.simHash || undefined,
      algorithm: record.algorithm,
      fingerprintVersion: record.fingerprintVersion,
      contentType: record.contentType,
      canonicalBytes: record.canonicalBytes || undefined,
      createdAt: record.createdAt,
    };
  }

  public async findFingerprintsByHash(fingerprint: string): Promise<ContentFingerprint[]> {
    const records = await prisma.contentFingerprint.findMany({
      where: { fingerprint },
    });

    return records.map((r) => ({
      id: r.id,
      contentId: r.contentId,
      projectId: r.projectId,
      fingerprint: r.fingerprint,
      simHash: r.simHash || undefined,
      algorithm: r.algorithm,
      fingerprintVersion: r.fingerprintVersion,
      contentType: r.contentType,
      canonicalBytes: r.canonicalBytes || undefined,
      createdAt: r.createdAt,
    }));
  }

  public async saveProvenanceRecord(record: ProvenanceRecord): Promise<void> {
    await prisma.provenanceRecord.create({
      data: {
        id: record.id,
        contentId: record.contentId,
        contentFingerprint: record.contentFingerprint,
        parentFingerprint: record.parentFingerprint || null,
        simHash: record.simHash || null,
        creatorType: record.creatorType,
        creatorId: record.creatorId || null,
        algorithm: record.algorithm,
        fingerprintVersion: record.fingerprintVersion,
        contentType: record.contentType,
        createdAt: record.createdAt,
      },
    });
  }

  public async getProvenanceHistory(contentId: string): Promise<ProvenanceRecord[]> {
    const records = await prisma.provenanceRecord.findMany({
      where: { contentId },
      orderBy: { createdAt: 'asc' },
    });

    return records.map((r) => ({
      id: r.id,
      contentId: r.contentId,
      contentFingerprint: r.contentFingerprint,
      parentFingerprint: r.parentFingerprint,
      simHash: r.simHash,
      creatorType: r.creatorType as 'user' | 'system' | 'ai',
      creatorId: r.creatorId,
      algorithm: r.algorithm,
      fingerprintVersion: r.fingerprintVersion,
      contentType: r.contentType,
      createdAt: r.createdAt,
    }));
  }

  public async getAllFingerprintsForSimilarity(excludeContentId?: string): Promise<ContentFingerprint[]> {
    const records = await prisma.contentFingerprint.findMany({
      where: excludeContentId ? { contentId: { not: excludeContentId } } : undefined,
    });

    return records.map((r) => ({
      id: r.id,
      contentId: r.contentId,
      projectId: r.projectId,
      fingerprint: r.fingerprint,
      simHash: r.simHash || undefined,
      algorithm: r.algorithm,
      fingerprintVersion: r.fingerprintVersion,
      contentType: r.contentType,
      canonicalBytes: r.canonicalBytes || undefined,
      createdAt: r.createdAt,
    }));
  }
}
