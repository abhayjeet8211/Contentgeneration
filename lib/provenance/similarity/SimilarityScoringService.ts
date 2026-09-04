/**
 * SimilarityScoringService
 * Converts Hamming distance into normalized similarity scores and confidence tiers.
 * 
 * Notice:
 * The similarity score is heuristic. It indicates probabilistic lexical similarity,
 * not legal proof of copying or plagiarism.
 */

import { provenanceConfig } from '../config/ProvenanceConfig';

export class SimilarityScoringService {
  /**
   * Converts Hamming distance [0..64] into a normalized similarity score [0.0..1.0].
   */
  public static calculateScore(hammingDistance: number): number {
    const clampedDistance = Math.max(0, Math.min(64, hammingDistance));
    const score = 1 - clampedDistance / 64;
    return Math.round(score * 1000) / 1000; // Round to 3 decimal places
  }

  /**
   * Maps a similarity score to a confidence tier based on configured thresholds.
   */
  public static determineConfidence(score: number): 'high' | 'medium' | 'low' | 'very_low' {
    const highThreshold = provenanceConfig.get('similarityHighThreshold');
    const mediumThreshold = provenanceConfig.get('similarityMediumThreshold');
    const lowThreshold = provenanceConfig.get('similarityLowThreshold');

    if (score >= highThreshold) {
      return 'high';
    }
    if (score >= mediumThreshold) {
      return 'medium';
    }
    if (score >= lowThreshold) {
      return 'low';
    }
    return 'very_low';
  }

  /**
   * Evaluates relationship description between two content assets.
   */
  public static evaluateRelationship(score: number, confidence: string): string {
    if (score >= 0.98) {
      return 'Near-identical content with minor stylistic variations.';
    }
    if (confidence === 'high') {
      return 'High similarity. Significant phrasing or structural overlap detected.';
    }
    if (confidence === 'medium') {
      return 'Moderate similarity. Partial content overlap or common thematic sections.';
    }
    if (confidence === 'low') {
      return 'Low similarity. Minor incidental token overlap.';
    }
    return 'No significant similarity match found.';
  }
}
