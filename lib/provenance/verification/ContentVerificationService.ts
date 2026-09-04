/**
 * ContentVerificationService
 * Verifies submitted content against stored assets using cryptographic and similarity matching.
 * 
 * Rules:
 * 1. Canonicalization -> SHA-256 exact match check
 * 2. If no exact match -> SimHash Hamming distance similarity search
 * 3. Never leaks unauthorized private content or sensitive internal details
 */

import { CanonicalizationService } from '../fingerprint/CanonicalizationService';
import { CryptographicFingerprintService } from '../fingerprint/CryptographicFingerprintService';
import { SimilarityFingerprintService } from '../fingerprint/SimilarityFingerprintService';
import { SimHashService } from '../similarity/SimHashService';
import { SimilarityScoringService } from '../similarity/SimilarityScoringService';
import { ProvenanceStore } from '../storage/ProvenanceStore';
import { DatabaseProvenanceStore } from '../storage/DatabaseProvenanceStore';
import { VerificationResult } from '../models/VerificationResult';
import { provenanceConfig } from '../config/ProvenanceConfig';

export interface VerifyContentOptions {
  content: unknown;
  contentType?: string;
  callerProjectId?: string;
  callerUserId?: string;
}

export class ContentVerificationService {
  private store: ProvenanceStore;

  constructor(store?: ProvenanceStore) {
    this.store = store || new DatabaseProvenanceStore();
  }

  /**
   * Verifies submitted content for exact cryptographic match or high heuristic similarity.
   */
  public async verify(options: VerifyContentOptions): Promise<VerificationResult> {
    const contentType = options.contentType || 'text';
    const algorithm = provenanceConfig.get('fingerprintAlgorithm');
    const version = provenanceConfig.get('fingerprintVersion');

    // 1. Canonicalize content
    const canonical = CanonicalizationService.canonicalize(options.content, contentType);
    if (!canonical || canonical.trim().length === 0) {
      return {
        exact_match: false,
        matching_content_id: null,
        similarity_score: 0.0,
        confidence: 'very_low',
        fingerprint_algorithm: algorithm,
        fingerprint_version: version,
        submitted_fingerprint: '',
        message: 'Submitted content is empty or could not be canonicalized.',
      };
    }

    // 2. Cryptographic SHA-256 fingerprint
    const submittedFingerprint = CryptographicFingerprintService.hashCanonical(canonical);
    const submittedSimHash = SimHashService.calculateSimHash(canonical);

    // 3. Exact Match Lookup
    const exactMatches = await this.store.findFingerprintsByHash(submittedFingerprint);

    if (exactMatches.length > 0) {
      const match = exactMatches[0];
      // Check project ownership for safe reference exposure
      const isAuthorized = !options.callerProjectId || options.callerProjectId === match.projectId;
      const safeContentId = isAuthorized
        ? match.contentId
        : `auth-verified-${match.fingerprint.slice(0, 10)}`;

      return {
        exact_match: true,
        matching_content_id: safeContentId,
        matching_project_id: isAuthorized ? match.projectId : undefined,
        similarity_score: 1.0,
        confidence: 'high',
        fingerprint_algorithm: algorithm,
        fingerprint_version: version,
        submitted_fingerprint: submittedFingerprint,
        submitted_simhash: submittedSimHash,
        matched_fingerprint: match.fingerprint,
        hamming_distance: 0,
        message: 'Exact canonical content match verified in platform provenance repository.',
      };
    }

    // 4. Similarity Search (SimHash Hamming Distance)
    const candidates = await this.store.getAllFingerprintsForSimilarity();

    let bestMatch: {
      contentId: string;
      projectId: string;
      fingerprint: string;
      simHash: string;
      distance: number;
      score: number;
      confidence: 'high' | 'medium' | 'low' | 'very_low';
    } | null = null;

    for (const candidate of candidates) {
      if (!candidate.simHash) continue;

      const distance = SimHashService.hammingDistance(submittedSimHash, candidate.simHash);
      const score = SimilarityScoringService.calculateScore(distance);
      const confidence = SimilarityScoringService.determineConfidence(score);

      if (!bestMatch || score > bestMatch.score) {
        bestMatch = {
          contentId: candidate.contentId,
          projectId: candidate.projectId,
          fingerprint: candidate.fingerprint,
          simHash: candidate.simHash,
          distance,
          score,
          confidence,
        };
      }
    }

    if (bestMatch && bestMatch.confidence !== 'very_low') {
      const isAuthorized = !options.callerProjectId || options.callerProjectId === bestMatch.projectId;
      const safeContentId = isAuthorized
        ? bestMatch.contentId
        : `auth-match-${bestMatch.fingerprint.slice(0, 10)}`;

      const relationshipMsg = SimilarityScoringService.evaluateRelationship(
        bestMatch.score,
        bestMatch.confidence
      );

      return {
        exact_match: false,
        matching_content_id: safeContentId,
        matching_project_id: isAuthorized ? bestMatch.projectId : undefined,
        similarity_score: bestMatch.score,
        confidence: bestMatch.confidence,
        fingerprint_algorithm: algorithm,
        fingerprint_version: version,
        submitted_fingerprint: submittedFingerprint,
        submitted_simhash: submittedSimHash,
        matched_fingerprint: bestMatch.fingerprint,
        hamming_distance: bestMatch.distance,
        message: `${relationshipMsg} Note: Similarity is heuristic and does not constitute proof of copying.`,
      };
    }

    // 5. No Match Found
    return {
      exact_match: false,
      matching_content_id: null,
      similarity_score: bestMatch ? bestMatch.score : 0.0,
      confidence: 'very_low',
      fingerprint_algorithm: algorithm,
      fingerprint_version: version,
      submitted_fingerprint: submittedFingerprint,
      submitted_simhash: submittedSimHash,
      matched_fingerprint: null,
      hamming_distance: bestMatch ? bestMatch.distance : 64,
      message: 'No exact or significant similarity match found in provenance repository.',
    };
  }
}

export const contentVerificationService = new ContentVerificationService();
