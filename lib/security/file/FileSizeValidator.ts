import { securityConfig } from '../config/SecurityConfig';
import { SecurityFinding } from '../models/SecurityFinding';

export type SupportedFileCategory = 'DOCUMENT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'TEXT' | 'UNKNOWN';

export interface FileSizeValidationResult {
  valid: boolean;
  sizeBytes: number;
  sizeMb: number;
  maxAllowedMb: number;
  findings: SecurityFinding[];
}

export class FileSizeValidator {
  public static getMaxAllowedMb(category: SupportedFileCategory): number {
    switch (category) {
      case 'DOCUMENT':
      case 'TEXT':
        return securityConfig.maxDocumentSizeMb;
      case 'IMAGE':
        return securityConfig.maxImageSizeMb;
      case 'AUDIO':
        return securityConfig.maxAudioSizeMb;
      case 'VIDEO':
        return securityConfig.maxVideoSizeMb;
      default:
        return securityConfig.maxFileSizeMb;
    }
  }

  public static validate(sizeBytes: number, category: SupportedFileCategory): FileSizeValidationResult {
    const findings: SecurityFinding[] = [];
    const sizeMb = sizeBytes / (1024 * 1024);
    const maxAllowedMb = this.getMaxAllowedMb(category);
    const maxAllowedBytes = maxAllowedMb * 1024 * 1024;

    if (sizeBytes <= 0) {
      findings.push({
        code: 'FILE_EMPTY',
        severity: 'high',
        message: 'Uploaded file is empty (0 bytes).',
        details: { sizeBytes },
      });
      return {
        valid: false,
        sizeBytes,
        sizeMb: 0,
        maxAllowedMb,
        findings,
      };
    }

    if (sizeBytes > maxAllowedBytes) {
      findings.push({
        code: 'FILE_SIZE_EXCEEDED',
        severity: 'high',
        message: `File exceeds the maximum allowed size for this content type (${category}). Maximum allowed size: ${maxAllowedMb} MB. Provided size: ${sizeMb.toFixed(2)} MB.`,
        details: {
          sizeBytes,
          sizeMb: Number(sizeMb.toFixed(2)),
          maxAllowedMb,
          maxAllowedBytes,
          category,
        },
      });
      return {
        valid: false,
        sizeBytes,
        sizeMb: Number(sizeMb.toFixed(2)),
        maxAllowedMb,
        findings,
      };
    }

    return {
      valid: true,
      sizeBytes,
      sizeMb: Number(sizeMb.toFixed(2)),
      maxAllowedMb,
      findings,
    };
  }
}
