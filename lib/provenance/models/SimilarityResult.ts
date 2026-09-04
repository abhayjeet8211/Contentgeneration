/**
 * SimilarityResult Model
 * Detailed metric representation between two content items based on SimHash Hamming distance.
 */

export interface SimilarityResult {
  contentId: string;
  fingerprint: string;
  simHash: string;
  similarityScore: number;
  confidence: 'high' | 'medium' | 'low' | 'very_low';
  hammingDistance: number;
}
