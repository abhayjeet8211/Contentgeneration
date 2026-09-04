/**
 * SimilarityFingerprintService
 * Coordinates token shingling, SimHash calculation, and pair-wise similarity comparisons.
 */

import { CanonicalizationService } from './CanonicalizationService';
import { SimHashService } from '../similarity/SimHashService';
import { SimilarityScoringService } from '../similarity/SimilarityScoringService';
import { SimilarityResult } from '../models/SimilarityResult';

export class SimilarityFingerprintService {
  /**
   * Generates a 64-bit SimHash hex digest from content.
   */
  public static generateSimHash(content: unknown, contentType: string = 'text'): string {
    const canonicalText = CanonicalizationService.canonicalize(content, contentType);
    return SimHashService.calculateSimHash(canonicalText);
  }

  /**
   * Compares two SimHashes and returns detailed similarity metrics.
   */
  public static compareSimHashes(
    simHashA: string,
    simHashB: string,
    targetContentId: string = '',
    targetFingerprint: string = ''
  ): SimilarityResult {
    const distance = SimHashService.hammingDistance(simHashA, simHashB);
    const score = SimilarityScoringService.calculateScore(distance);
    const confidence = SimilarityScoringService.determineConfidence(score);

    return {
      contentId: targetContentId,
      fingerprint: targetFingerprint,
      simHash: simHashB,
      similarityScore: score,
      confidence,
      hammingDistance: distance,
    };
  }
}
