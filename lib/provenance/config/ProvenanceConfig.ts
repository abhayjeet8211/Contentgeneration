/**
 * Provenance and Fingerprinting Configuration
 * Centralized settings for canonicalization, SHA-256 fingerprinting, and SimHash similarity.
 */

export interface ProvenanceConfigValues {
  fingerprintAlgorithm: string;
  fingerprintVersion: string;
  similarityAlgorithm: string;
  similarityVersion: string;
  similarityShingleSize: number;
  similarityHighThreshold: number;
  similarityMediumThreshold: number;
  similarityLowThreshold: number;
}

export class ProvenanceConfig {
  private static instance: ProvenanceConfig;
  private config: ProvenanceConfigValues;

  private constructor() {
    this.config = {
      fingerprintAlgorithm: process.env.FINGERPRINT_ALGORITHM || 'SHA-256',
      fingerprintVersion: process.env.FINGERPRINT_VERSION || '1',
      similarityAlgorithm: process.env.SIMILARITY_ALGORITHM || 'SIMHASH',
      similarityVersion: process.env.SIMILARITY_VERSION || '1',
      similarityShingleSize: parseInt(process.env.SIMILARITY_SHINGLE_SIZE || '3', 10),
      similarityHighThreshold: parseFloat(process.env.SIMILARITY_HIGH_THRESHOLD || '0.85'),
      similarityMediumThreshold: parseFloat(process.env.SIMILARITY_MEDIUM_THRESHOLD || '0.65'),
      similarityLowThreshold: parseFloat(process.env.SIMILARITY_LOW_THRESHOLD || '0.40'),
    };
  }

  public static getInstance(): ProvenanceConfig {
    if (!ProvenanceConfig.instance) {
      ProvenanceConfig.instance = new ProvenanceConfig();
    }
    return ProvenanceConfig.instance;
  }

  public get<K extends keyof ProvenanceConfigValues>(key: K): ProvenanceConfigValues[K] {
    return this.config[key];
  }

  public getAll(): ProvenanceConfigValues {
    return { ...this.config };
  }
}

export const provenanceConfig = ProvenanceConfig.getInstance();
