import path from 'path';
import { SecurityFinding } from '../models/SecurityFinding';
import { SupportedFileCategory } from './FileSizeValidator';

export interface FileTypeValidationResult {
  valid: boolean;
  extension: string;
  category: SupportedFileCategory;
  declaredMimeType: string;
  expectedMimeTypes: string[];
  findings: SecurityFinding[];
}

export const ALLOWED_EXTENSIONS_MAP: Record<string, { category: SupportedFileCategory; mimeTypes: string[] }> = {
  // Documents
  pdf: {
    category: 'DOCUMENT',
    mimeTypes: ['application/pdf', 'application/x-pdf'],
  },
  docx: {
    category: 'DOCUMENT',
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/octet-stream',
      'application/zip',
    ],
  },
  ppt: {
    category: 'DOCUMENT',
    mimeTypes: ['application/vnd.ms-powerpoint', 'application/powerpoint', 'application/octet-stream'],
  },
  pptx: {
    category: 'DOCUMENT',
    mimeTypes: [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint',
      'application/octet-stream',
      'application/zip',
    ],
  },
  txt: {
    category: 'TEXT',
    mimeTypes: ['text/plain', 'text/markdown', 'text/csv', 'application/octet-stream'],
  },

  // Images
  jpg: {
    category: 'IMAGE',
    mimeTypes: ['image/jpeg', 'image/pjpeg'],
  },
  jpeg: {
    category: 'IMAGE',
    mimeTypes: ['image/jpeg', 'image/pjpeg'],
  },
  png: {
    category: 'IMAGE',
    mimeTypes: ['image/png', 'image/x-png'],
  },
  webp: {
    category: 'IMAGE',
    mimeTypes: ['image/webp'],
  },

  // Audio
  mp3: {
    category: 'AUDIO',
    mimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/mpg', 'audio/x-mpeg'],
  },
  wav: {
    category: 'AUDIO',
    mimeTypes: ['audio/wav', 'audio/wave', 'audio/x-wav'],
  },
  m4a: {
    category: 'AUDIO',
    mimeTypes: ['audio/mp4', 'audio/m4a', 'audio/x-m4a'],
  },
  aac: {
    category: 'AUDIO',
    mimeTypes: ['audio/aac', 'audio/x-aac'],
  },
  ogg: {
    category: 'AUDIO',
    mimeTypes: ['audio/ogg', 'application/ogg'],
  },

  // Video
  mp4: {
    category: 'VIDEO',
    mimeTypes: ['video/mp4', 'video/mp4v-es'],
  },
  mov: {
    category: 'VIDEO',
    mimeTypes: ['video/quicktime', 'video/mov'],
  },
  webm: {
    category: 'VIDEO',
    mimeTypes: ['video/webm', 'audio/webm'],
  },
};

export const DENIED_EXTENSIONS = new Set([
  'exe', 'dll', 'bat', 'cmd', 'ps1', 'sh', 'bash', 'vbs', 'js', 'jar', 'msi',
  'scr', 'com', 'pif', 'application', 'gadget', 'hta', 'cpl', 'msc', 'reg',
  'wsf', 'vb', 'cgi', 'pl', 'py', 'php', 'jsp', 'asp', 'aspx', 'iso', 'bin'
]);

export class FileTypeValidator {
  public static validate(filename: string, declaredMimeType: string): FileTypeValidationResult {
    const findings: SecurityFinding[] = [];
    const ext = path.extname(filename).toLowerCase().replace(/^\./, '');
    const normalizedDeclaredMime = (declaredMimeType || 'application/octet-stream').toLowerCase().trim();

    // 1. Check denylist first
    if (DENIED_EXTENSIONS.has(ext)) {
      findings.push({
        code: 'FILE_TYPE_DENIED',
        severity: 'critical',
        message: `Directly denied executable or script extension: .${ext}`,
        details: { extension: ext, declaredMime: normalizedDeclaredMime },
      });
      return {
        valid: false,
        extension: ext,
        category: 'UNKNOWN',
        declaredMimeType: normalizedDeclaredMime,
        expectedMimeTypes: [],
        findings,
      };
    }

    // 2. Check allowlist
    const matched = ALLOWED_EXTENSIONS_MAP[ext];
    if (!matched) {
      findings.push({
        code: 'FILE_TYPE_UNSUPPORTED',
        severity: 'high',
        message: `Unsupported file extension: .${ext || 'unknown'}. Allowed extensions: ${Object.keys(ALLOWED_EXTENSIONS_MAP).join(', ')}`,
        details: { extension: ext, declaredMime: normalizedDeclaredMime },
      });
      return {
        valid: false,
        extension: ext,
        category: 'UNKNOWN',
        declaredMimeType: normalizedDeclaredMime,
        expectedMimeTypes: [],
        findings,
      };
    }

    // 3. MIME type compatibility check
    // If declared MIME type is explicitly an executable type, flag immediately
    const dangerousMimes = [
      'application/x-msdownload',
      'application/x-dosexec',
      'application/x-executable',
      'application/x-sharedlib',
      'application/x-sh',
      'application/x-bat',
      'text/javascript',
      'application/javascript',
    ];

    if (dangerousMimes.some((m) => normalizedDeclaredMime.includes(m))) {
      findings.push({
        code: 'FILE_DANGEROUS_MIME',
        severity: 'critical',
        message: `Declared MIME type is executable or dangerous: ${normalizedDeclaredMime}`,
        details: { declaredMime: normalizedDeclaredMime, extension: ext },
      });
    }

    // Check if declared MIME matches expected list (allow generic octet-stream with warning)
    const isDeclaredExpected = matched.mimeTypes.some((m) => normalizedDeclaredMime.includes(m));
    if (!isDeclaredExpected && normalizedDeclaredMime !== 'application/octet-stream' && normalizedDeclaredMime !== '') {
      findings.push({
        code: 'FILE_MIME_MISMATCH',
        severity: 'medium',
        message: `Declared MIME type (${normalizedDeclaredMime}) does not match expected MIME types for .${ext}: [${matched.mimeTypes.join(', ')}]`,
        details: { declaredMime: normalizedDeclaredMime, expectedMimes: matched.mimeTypes, extension: ext },
      });
    }

    const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

    return {
      valid: !hasCriticalOrHigh,
      extension: ext,
      category: matched.category,
      declaredMimeType: normalizedDeclaredMime,
      expectedMimeTypes: matched.mimeTypes,
      findings,
    };
  }
}
