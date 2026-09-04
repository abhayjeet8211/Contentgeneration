/**
 * TokenShinglingService
 * Deconstructs normalized text into n-gram token shingles for similarity calculation.
 */

import { provenanceConfig } from '../config/ProvenanceConfig';

export class TokenShinglingService {
  /**
   * Tokenizes text into normalized word tokens.
   */
  public static tokenize(text: string): string[] {
    if (!text) return [];

    // Lowercase and extract alphanumeric word sequences
    const matches = text.toLowerCase().match(/[\p{L}\p{N}]+/gu);
    return matches || [];
  }

  /**
   * Generates n-gram shingles from tokens.
   */
  public static generateShingles(tokens: string[], shingleSize?: number): string[] {
    const size = shingleSize || provenanceConfig.get('similarityShingleSize') || 3;

    if (tokens.length === 0) {
      return [];
    }

    if (tokens.length <= size) {
      // If fewer tokens than shingle size, return the entire sequence as a single shingle
      return [tokens.join(' ')];
    }

    const shingles: string[] = [];
    for (let i = 0; i <= tokens.length - size; i++) {
      shingles.push(tokens.slice(i, i + size).join(' '));
    }

    return shingles;
  }

  /**
   * Directly extracts shingles from a text string.
   */
  public static shinglesFromText(text: string, shingleSize?: number): string[] {
    const tokens = this.tokenize(text);
    return this.generateShingles(tokens, shingleSize);
  }
}
