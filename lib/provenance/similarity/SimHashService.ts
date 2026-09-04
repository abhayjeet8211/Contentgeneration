/**
 * SimHashService
 * Generates 64-bit locality-sensitive hashes (SimHash) from token shingles.
 * Calculates Hamming distance for modified / related content detection.
 */

import crypto from 'crypto';
import { TokenShinglingService } from './TokenShinglingService';

export class SimHashService {
  /**
   * Hashes a shingle string to a 64-bit BigInt using SHA-256.
   */
  private static hash64(token: string): bigint {
    const hash = crypto.createHash('sha256').update(token).digest();
    return hash.readBigUInt64BE(0);
  }

  /**
   * Generates a 64-bit SimHash string (16-char hex) from token shingles.
   */
  public static calculateSimHashFromShingles(shingles: string[]): string {
    if (shingles.length === 0) {
      return '0000000000000000';
    }

    // 64-dimensional accumulator vector
    const vector = new Array<number>(64).fill(0);

    for (const shingle of shingles) {
      const hash = this.hash64(shingle);
      for (let i = 0; i < 64; i++) {
        const bitMask = 1n << BigInt(i);
        if ((hash & bitMask) !== 0n) {
          vector[i] += 1;
        } else {
          vector[i] -= 1;
        }
      }
    }

    // Convert vector to 64-bit integer
    let simhash = 0n;
    for (let i = 0; i < 64; i++) {
      if (vector[i] > 0) {
        simhash |= 1n << BigInt(i);
      }
    }

    return simhash.toString(16).padStart(16, '0');
  }

  /**
   * Generates SimHash directly from normalized text.
   */
  public static calculateSimHash(text: string, shingleSize?: number): string {
    const shingles = TokenShinglingService.shinglesFromText(text, shingleSize);
    return this.calculateSimHashFromShingles(shingles);
  }

  /**
   * Computes the Hamming distance (number of differing bits) between two 16-hex SimHashes.
   * Result is an integer between 0 (identical) and 64 (completely opposite).
   */
  public static hammingDistance(simHash1: string, simHash2: string): number {
    try {
      const val1 = BigInt('0x' + simHash1);
      const val2 = BigInt('0x' + simHash2);
      const xor = val1 ^ val2;

      // Popcount
      let count = 0;
      let temp = xor;
      while (temp > 0n) {
        if ((temp & 1n) === 1n) {
          count++;
        }
        temp >>= 1n;
      }
      return count;
    } catch {
      return 64;
    }
  }
}
