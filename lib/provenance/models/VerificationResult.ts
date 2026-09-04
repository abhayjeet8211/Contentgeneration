/**
 * VerificationResult Model
 * Represents the response payload from verifying submitted content against stored assets.
 */

export interface VerificationResult {
  exact_match: boolean;
  matching_content_id: string | null;
  matching_project_id?: string | null;
  similarity_score: number; // 0.0 to 1.0
  confidence: 'high' | 'medium' | 'low' | 'very_low';
  fingerprint_algorithm: string;
  fingerprint_version: string;
  submitted_fingerprint: string;
  submitted_simhash?: string;
  matched_fingerprint?: string | null;
  hamming_distance?: number;
  message: string;
}
