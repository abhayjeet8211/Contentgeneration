export interface SecurityConfigValues {
  // File size limits in MB
  maxFileSizeMb: number;
  maxDocumentSizeMb: number;
  maxImageSizeMb: number;
  maxAudioSizeMb: number;
  maxVideoSizeMb: number;

  // Archive protection limits
  maxArchiveEntries: number;
  maxUncompressedSizeMb: number;
  maxCompressionRatio: number;

  // URL Security & SSRF limits
  maxUrlRedirects: number;
  urlConnectionTimeoutMs: number;
  urlRequestTimeoutMs: number;
  maxUrlResponseSizeMb: number;

  // Security policy
  scannerVersion: string;
  rejectHighSeverity: boolean;
  rejectMediumSeverity: boolean;
}

function parseEnvNumber(val: string | undefined, defaultVal: number): number {
  if (!val) return defaultVal;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) || parsed <= 0 ? defaultVal : parsed;
}

function parseEnvBoolean(val: string | undefined, defaultVal: boolean): boolean {
  if (!val) return defaultVal;
  const lower = val.trim().toLowerCase();
  return lower === 'true' || lower === '1' || lower === 'yes';
}

export const securityConfig: SecurityConfigValues = {
  maxFileSizeMb: parseEnvNumber(process.env.MAX_FILE_SIZE_MB, 100),
  maxDocumentSizeMb: parseEnvNumber(process.env.MAX_DOCUMENT_SIZE_MB, 25),
  maxImageSizeMb: parseEnvNumber(process.env.MAX_IMAGE_SIZE_MB, 10),
  maxAudioSizeMb: parseEnvNumber(process.env.MAX_AUDIO_SIZE_MB, 100),
  maxVideoSizeMb: parseEnvNumber(process.env.MAX_VIDEO_SIZE_MB, 500),

  maxArchiveEntries: parseEnvNumber(process.env.MAX_ARCHIVE_ENTRIES, 10000),
  maxUncompressedSizeMb: parseEnvNumber(process.env.MAX_UNCOMPRESSED_SIZE_MB, 500),
  maxCompressionRatio: parseEnvNumber(process.env.MAX_COMPRESSION_RATIO, 100),

  maxUrlRedirects: parseEnvNumber(process.env.MAX_URL_REDIRECTS, 5),
  urlConnectionTimeoutMs: parseEnvNumber(process.env.URL_CONNECTION_TIMEOUT_MS, 5000),
  urlRequestTimeoutMs: parseEnvNumber(process.env.URL_REQUEST_TIMEOUT_MS, 30000),
  maxUrlResponseSizeMb: parseEnvNumber(process.env.MAX_URL_RESPONSE_SIZE_MB, 100),

  scannerVersion: process.env.SECURITY_SCANNER_VERSION || '1.0.0',
  rejectHighSeverity: parseEnvBoolean(process.env.SECURITY_REJECT_HIGH_SEVERITY, true),
  rejectMediumSeverity: parseEnvBoolean(process.env.SECURITY_REJECT_MEDIUM_SEVERITY, false),
};
