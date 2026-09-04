import path from 'path';
import crypto from 'crypto';
import { SecurityFinding } from '../models/SecurityFinding';

export interface FilenameValidationResult {
  valid: boolean;
  sanitizedName: string;
  storageIdentifier: string;
  findings: SecurityFinding[];
}

const WINDOWS_RESERVED_NAMES = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i;
const DANGEROUS_EXTENSIONS = new Set([
  'exe', 'dll', 'bat', 'cmd', 'ps1', 'sh', 'vbs', 'js', 'jar', 'msi', 'scr',
  'com', 'pif', 'application', 'gadget', 'hta', 'cpl', 'msc', 'reg', 'wsf', 'vb'
]);

export class FilenameValidator {
  private static readonly MAX_FILENAME_LENGTH = 255;

  public static validate(filename: string): FilenameValidationResult {
    const findings: SecurityFinding[] = [];
    const trimmed = (filename || '').trim();

    if (!trimmed) {
      findings.push({
        code: 'FILENAME_EMPTY',
        severity: 'critical',
        message: 'Filename cannot be empty.',
      });
      return {
        valid: false,
        sanitizedName: 'unnamed_file',
        storageIdentifier: `source_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
        findings,
      };
    }

    // 1. Check for Null Bytes (%00 or \0)
    if (trimmed.includes('\0') || /%00/i.test(trimmed) || /\\0/i.test(trimmed)) {
      findings.push({
        code: 'FILENAME_NULL_BYTE',
        severity: 'critical',
        message: 'Null byte injection detected in filename.',
        details: { filename: trimmed },
      });
    }

    // 2. Check for Directory / Path Traversal attempts
    if (
      trimmed.includes('../') ||
      trimmed.includes('..\\') ||
      trimmed.startsWith('/') ||
      trimmed.startsWith('\\') ||
      /^[a-zA-Z]:[\\/]/.test(trimmed) ||
      trimmed.includes('..')
    ) {
      findings.push({
        code: 'FILENAME_PATH_TRAVERSAL',
        severity: 'critical',
        message: 'Directory traversal sequence detected in filename.',
        details: { filename: trimmed },
      });
    }

    // 3. Check for excessive filename length
    if (trimmed.length > this.MAX_FILENAME_LENGTH) {
      findings.push({
        code: 'FILENAME_LENGTH_EXCEEDED',
        severity: 'high',
        message: `Filename length (${trimmed.length}) exceeds maximum permitted length of ${this.MAX_FILENAME_LENGTH} characters.`,
        details: { length: trimmed.length, maxLength: this.MAX_FILENAME_LENGTH },
      });
    }

    // 4. Check for Windows reserved names
    const basenameOnly = path.basename(trimmed);
    if (WINDOWS_RESERVED_NAMES.test(basenameOnly)) {
      findings.push({
        code: 'FILENAME_RESERVED_NAME',
        severity: 'high',
        message: `Filename uses reserved system device name: ${basenameOnly}`,
        details: { name: basenameOnly },
      });
    }

    // 5. Check for control characters or non-printable characters
    if (/[\x00-\x1F\x7F]/.test(trimmed)) {
      findings.push({
        code: 'FILENAME_CONTROL_CHARS',
        severity: 'high',
        message: 'Filename contains forbidden control characters.',
      });
    }

    // 6. Check for multiple extensions / double extension attack
    // e.g. "report.pdf.exe", "image.jpg.js", "invoice.doc.bat"
    const parts = basenameOnly.split('.').filter(Boolean);
    if (parts.length > 2) {
      const finalExt = parts[parts.length - 1].toLowerCase();
      const secondaryExt = parts[parts.length - 2].toLowerCase();

      if (DANGEROUS_EXTENSIONS.has(finalExt)) {
        findings.push({
          code: 'FILENAME_EXECUTABLE_DOUBLE_EXTENSION',
          severity: 'critical',
          message: `Dangerous executable extension in multi-extension file: .${finalExt}`,
          details: { finalExt, secondaryExt },
        });
      } else if (DANGEROUS_EXTENSIONS.has(secondaryExt)) {
        findings.push({
          code: 'FILENAME_SUSPICIOUS_DOUBLE_EXTENSION',
          severity: 'high',
          message: `Suspicious secondary executable extension detected: .${secondaryExt}`,
          details: { finalExt, secondaryExt },
        });
      } else {
        findings.push({
          code: 'FILENAME_MULTIPLE_EXTENSIONS',
          severity: 'low',
          message: `Filename contains multiple extension periods: ${basenameOnly}`,
          details: { parts },
        });
      }
    }

    // Sanitize base name
    const rawExt = path.extname(basenameOnly);
    const cleanExt = rawExt.toLowerCase().replace(/[^a-z0-9_.]/g, '');
    const cleanBase = path
      .basename(basenameOnly, rawExt)
      .replace(/[^a-zA-Z0-9_\-]/g, '_')
      .slice(0, 80);

    const safeBaseName = cleanBase ? `${cleanBase}${cleanExt}` : `source_${Date.now()}${cleanExt}`;
    const uniqueHash = crypto.randomBytes(8).toString('hex');
    const storageIdentifier = `${cleanBase || 'file'}_${Date.now()}_${uniqueHash}${cleanExt}`;

    const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

    return {
      valid: !hasCriticalOrHigh,
      sanitizedName: safeBaseName,
      storageIdentifier,
      findings,
    };
  }
}
