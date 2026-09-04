/**
 * CanonicalizationService
 * Unified canonicalization gateway that routes content to the appropriate canonicalizer.
 */

import { TextCanonicalizer } from '../canonicalization/TextCanonicalizer';
import { StructuredContentCanonicalizer } from '../canonicalization/StructuredContentCanonicalizer';
import { PackageCanonicalizer } from '../canonicalization/PackageCanonicalizer';

export class CanonicalizationService {
  /**
   * Deterministically canonicalizes content into a string representation.
   */
  public static canonicalize(content: unknown, contentType: string = 'text'): string {
    if (content === null || content === undefined) {
      return '';
    }

    const type = contentType.toUpperCase();

    // 1. Deep package formats
    if (type === 'VIDEO' || type === 'VIDEO_PACKAGE') {
      return PackageCanonicalizer.canonicalizeVideoPackage(content);
    }

    if (type === 'PRESENTATION' || type === 'PRESENTATION_PACKAGE') {
      return PackageCanonicalizer.canonicalizePresentationPackage(content);
    }

    if (type === 'INFOGRAPHIC' || type === 'INFOGRAPHIC_PACKAGE') {
      return PackageCanonicalizer.canonicalizeInfographicPackage(content);
    }

    // 2. Structured JSON/Object
    if (typeof content === 'object') {
      return StructuredContentCanonicalizer.canonicalize(content);
    }

    // 3. String content (can be raw text or JSON string)
    if (typeof content === 'string') {
      // Check if it's JSON structured content
      const trimmed = content.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          const parsed = JSON.parse(trimmed);
          if (type === 'VIDEO') return PackageCanonicalizer.canonicalizeVideoPackage(parsed);
          if (type === 'PRESENTATION') return PackageCanonicalizer.canonicalizePresentationPackage(parsed);
          if (type === 'INFOGRAPHIC') return PackageCanonicalizer.canonicalizeInfographicPackage(parsed);
          return StructuredContentCanonicalizer.canonicalize(parsed);
        } catch {
          // Fall back to text canonicalizer if invalid JSON
        }
      }

      return TextCanonicalizer.canonicalize(content);
    }

    return TextCanonicalizer.canonicalize(String(content));
  }

  /**
   * Canonicalizes content and returns a UTF-8 Buffer for hashing.
   */
  public static canonicalizeToBuffer(content: unknown, contentType: string = 'text'): Buffer {
    const canonicalString = this.canonicalize(content, contentType);
    return Buffer.from(canonicalString, 'utf-8');
  }
}
