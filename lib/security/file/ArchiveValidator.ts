import JSZip from 'jszip';
import { securityConfig } from '../config/SecurityConfig';
import { SecurityFinding } from '../models/SecurityFinding';

export interface ArchiveInspectionResult {
  valid: boolean;
  totalEntries: number;
  compressedSizeBytes: number;
  uncompressedSizeBytes: number;
  compressionRatio: number;
  entryNames: string[];
  findings: SecurityFinding[];
}

export class ArchiveValidator {
  public static async inspectZip(buffer: Buffer): Promise<ArchiveInspectionResult> {
    const findings: SecurityFinding[] = [];
    const compressedSizeBytes = buffer.length;
    let totalEntries = 0;
    let uncompressedSizeBytes = 0;
    const entryNames: string[] = [];

    try {
      const zip = await JSZip.loadAsync(buffer, { checkCRC32: false });
      const entries = Object.keys(zip.files);
      totalEntries = entries.length;

      // 1. Check max entries
      if (totalEntries > securityConfig.maxArchiveEntries) {
        findings.push({
          code: 'ARCHIVE_TOO_MANY_ENTRIES',
          severity: 'critical',
          message: `Archive entry count (${totalEntries}) exceeds maximum allowed (${securityConfig.maxArchiveEntries}).`,
          details: { totalEntries, maxAllowed: securityConfig.maxArchiveEntries },
        });
      }

      // 2. Iterate metadata headers without unzipping contents
      for (const entryName of entries) {
        entryNames.push(entryName);
        const zipObject = zip.files[entryName];

        // JSZip stores internal uncompressed size in _data.uncompressedSize if available
        // Note: zipObject.dir indicates directory
        const entryUncompressed = (zipObject as any)._data?.uncompressedSize || 0;
        uncompressedSizeBytes += entryUncompressed;

        // Check for Zip Slip / Path Traversal inside zip entry names
        if (
          entryName.includes('../') ||
          entryName.includes('..\\') ||
          entryName.startsWith('/') ||
          entryName.startsWith('\\') ||
          /^[a-zA-Z]:[\\/]/.test(entryName)
        ) {
          findings.push({
            code: 'ARCHIVE_ZIP_SLIP_ATTEMPT',
            severity: 'critical',
            message: `Suspicious path traversal entry in archive: ${entryName}`,
            details: { entryName },
          });
        }
      }

      // 3. Compute compression ratio
      const effectiveCompressed = Math.max(compressedSizeBytes, 1);
      const compressionRatio = uncompressedSizeBytes > 0 ? uncompressedSizeBytes / effectiveCompressed : 1;
      const uncompressedMb = uncompressedSizeBytes / (1024 * 1024);

      // Check max uncompressed size
      if (uncompressedMb > securityConfig.maxUncompressedSizeMb) {
        findings.push({
          code: 'ARCHIVE_UNCOMPRESSED_SIZE_EXCEEDED',
          severity: 'critical',
          message: `Archive uncompressed size (${uncompressedMb.toFixed(1)} MB) exceeds maximum allowed (${securityConfig.maxUncompressedSizeMb} MB).`,
          details: { uncompressedMb, maxAllowedMb: securityConfig.maxUncompressedSizeMb },
        });
      }

      // Check compression ratio (Zip Bomb heuristic)
      if (compressionRatio > securityConfig.maxCompressionRatio && compressedSizeBytes > 1024) {
        findings.push({
          code: 'ARCHIVE_BOMB_DETECTED',
          severity: 'critical',
          message: `Potential decompression bomb detected. Compression ratio (${compressionRatio.toFixed(1)}:1) exceeds limit (${securityConfig.maxCompressionRatio}:1).`,
          details: { compressionRatio, uncompressedSizeBytes, compressedSizeBytes },
        });
      }

      const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

      return {
        valid: !hasCriticalOrHigh,
        totalEntries,
        compressedSizeBytes,
        uncompressedSizeBytes,
        compressionRatio: Number(compressionRatio.toFixed(2)),
        entryNames,
        findings,
      };
    } catch (err: unknown) {
      findings.push({
        code: 'ARCHIVE_CORRUPTED',
        severity: 'high',
        message: 'Failed to inspect archive structure. File may be corrupted or not a valid ZIP format.',
        details: { error: err instanceof Error ? err.message : String(err) },
      });
      return {
        valid: false,
        totalEntries: 0,
        compressedSizeBytes,
        uncompressedSizeBytes: 0,
        compressionRatio: 1,
        entryNames: [],
        findings,
      };
    }
  }
}
