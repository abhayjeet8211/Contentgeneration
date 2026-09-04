/**
 * StructuredContentCanonicalizer
 * Produces deterministic canonical JSON representations of structured data.
 * 
 * Rules:
 * 1. Deep alphabetical key sorting
 * 2. Stable JSON serialization
 * 3. Text values within objects are normalized using TextCanonicalizer
 * 4. Key order does not affect the output string
 */

import { TextCanonicalizer } from './TextCanonicalizer';

export class StructuredContentCanonicalizer {
  /**
   * Recursively normalizes an arbitrary value:
   * - Objects: keys sorted alphabetically, values normalized recursively
   * - Strings: text-canonicalized (NFC, whitespace collapsed)
   * - Arrays: elements normalized in order
   * - Primitives: preserved
   */
  public static normalizeValue(value: unknown, excludeKeys: string[] = []): unknown {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === 'string') {
      return TextCanonicalizer.canonicalize(value);
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeValue(item, excludeKeys));
    }

    if (typeof value === 'object') {
      const sortedObj: Record<string, unknown> = {};
      const keys = Object.keys(value as Record<string, unknown>)
        .filter((k) => !excludeKeys.includes(k))
        .sort();

      for (const key of keys) {
        sortedObj[key] = this.normalizeValue((value as Record<string, unknown>)[key], excludeKeys);
      }
      return sortedObj;
    }

    return value;
  }

  /**
   * Deterministically serializes any structured object to canonical JSON string.
   */
  public static canonicalize(obj: unknown, excludeKeys: string[] = []): string {
    const normalized = this.normalizeValue(obj, excludeKeys);
    return JSON.stringify(normalized);
  }

  public static canonicalizeToBuffer(obj: unknown, excludeKeys: string[] = []): Buffer {
    const canonicalJson = this.canonicalize(obj, excludeKeys);
    return Buffer.from(canonicalJson, 'utf-8');
  }
}
