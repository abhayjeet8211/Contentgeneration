/**
 * CryptographicFingerprintService
 * Generates exact SHA-256 cryptographic fingerprints from canonical content.
 * 
 * Rules:
 * Standard SHA-256 hash using Node.js crypto module.
 * Never custom or non-standard cryptography.
 */

import crypto from 'crypto';
import { CanonicalizationService } from './CanonicalizationService';

export class CryptographicFingerprintService {
  /**
   * Computes SHA-256 hexadecimal fingerprint from canonical content.
   */
  public static generateFingerprint(content: unknown, contentType: string = 'text'): {
    fingerprint: string;
    canonicalLength: number;
    canonicalText: string;
  } {
    const canonicalText = CanonicalizationService.canonicalize(content, contentType);
    const buffer = Buffer.from(canonicalText, 'utf-8');

    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    return {
      fingerprint: hash,
      canonicalLength: buffer.length,
      canonicalText,
    };
  }

  /**
   * Computes SHA-256 hash directly from pre-canonicalized string or buffer.
   */
  public static hashCanonical(canonical: string | Buffer): string {
    const buffer = typeof canonical === 'string' ? Buffer.from(canonical, 'utf-8') : canonical;
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
