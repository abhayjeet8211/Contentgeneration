import { SecurityFinding } from '../models/SecurityFinding';

export interface SignatureDetectionResult {
  detectedType?: string;
  detectedMime?: string;
  isExecutable: boolean;
  valid: boolean;
  findings: SecurityFinding[];
}

export class FileSignatureValidator {
  public static validate(buffer: Buffer, expectedExtension: string): SignatureDetectionResult {
    const findings: SecurityFinding[] = [];
    const ext = expectedExtension.toLowerCase().replace(/^\./, '');

    if (!buffer || buffer.length === 0) {
      findings.push({
        code: 'BUFFER_EMPTY',
        severity: 'high',
        message: 'Cannot validate signatures on an empty buffer.',
      });
      return { isExecutable: false, valid: false, findings };
    }

    // 1. Check for Executable Headers across ALL files (Critical Malware / Masquerading Check)
    if (this.isExecutableSignature(buffer)) {
      findings.push({
        code: 'FILE_SIGNATURE_EXECUTABLE',
        severity: 'critical',
        message: `File contains executable binary signature (PE/ELF/Mach-O/Script) disguised as .${ext}`,
        details: {
          expectedExtension: ext,
          headerHex: buffer.subarray(0, 8).toString('hex'),
        },
      });
      return {
        detectedType: 'EXECUTABLE',
        detectedMime: 'application/x-executable',
        isExecutable: true,
        valid: false,
        findings,
      };
    }

    // 2. Validate expected format signatures
    let detectedType: string | undefined;
    let detectedMime: string | undefined;
    let matched = false;

    switch (ext) {
      case 'pdf': {
        // PDF magic bytes: %PDF- (hex: 25 50 44 46)
        if (buffer.length >= 5 && buffer.subarray(0, 5).toString('ascii').startsWith('%PDF-')) {
          matched = true;
          detectedType = 'PDF';
          detectedMime = 'application/pdf';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_PDF',
            severity: 'high',
            message: 'File does not start with valid PDF magic bytes (%PDF-).',
            details: { header: buffer.subarray(0, 8).toString('hex') },
          });
        }
        break;
      }

      case 'png': {
        // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
        const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        if (buffer.length >= 8 && buffer.subarray(0, 8).equals(pngHeader)) {
          matched = true;
          detectedType = 'PNG';
          detectedMime = 'image/png';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_PNG',
            severity: 'high',
            message: 'File does not start with valid PNG magic bytes.',
          });
        }
        break;
      }

      case 'jpg':
      case 'jpeg': {
        // JPEG magic bytes: FF D8 FF
        if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
          matched = true;
          detectedType = 'JPEG';
          detectedMime = 'image/jpeg';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_JPEG',
            severity: 'high',
            message: 'File does not start with valid JPEG magic bytes (FF D8 FF).',
          });
        }
        break;
      }

      case 'webp': {
        // RIFF....WEBP
        if (
          buffer.length >= 12 &&
          buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
          buffer.subarray(8, 12).toString('ascii') === 'WEBP'
        ) {
          matched = true;
          detectedType = 'WEBP';
          detectedMime = 'image/webp';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_WEBP',
            severity: 'high',
            message: 'File does not start with valid WebP magic header (RIFF....WEBP).',
          });
        }
        break;
      }

      case 'docx':
      case 'pptx': {
        // ZIP magic bytes: PK\x03\x04 (hex: 50 4B 03 04)
        if (
          buffer.length >= 4 &&
          buffer[0] === 0x50 &&
          buffer[1] === 0x4b &&
          (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
          (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
        ) {
          matched = true;
          detectedType = ext.toUpperCase();
          detectedMime =
            ext === 'docx'
              ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
              : 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_ZIP_OFFICE',
            severity: 'high',
            message: `File is expected to be a valid ZIP-based Office OpenXML package (${ext.toUpperCase()}) but lacks PK zip header.`,
          });
        }
        break;
      }

      case 'ppt': {
        // Legacy binary PPT (OLE Compound File Header: D0 CF 11 E0 A1 B1 1A E1) or PK
        if (
          buffer.length >= 8 &&
          buffer[0] === 0xd0 &&
          buffer[1] === 0xcf &&
          buffer[2] === 0x11 &&
          buffer[3] === 0xe0
        ) {
          matched = true;
          detectedType = 'PPT';
          detectedMime = 'application/vnd.ms-powerpoint';
        } else if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
          matched = true;
          detectedType = 'PPTX';
          detectedMime = 'application/vnd.ms-powerpoint';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_PPT',
            severity: 'medium',
            message: 'PPT file does not match legacy OLE2 or ZIP container header.',
          });
        }
        break;
      }

      case 'mp3': {
        // ID3 header (49 44 33) or MPEG sync frame (FF FB / FF F3 / FF F2 / FF E3)
        if (
          (buffer.length >= 3 && buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33) ||
          (buffer.length >= 2 && buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0)
        ) {
          matched = true;
          detectedType = 'MP3';
          detectedMime = 'audio/mpeg';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_MP3',
            severity: 'medium',
            message: 'File does not have a recognizable MP3 ID3 header or sync frame.',
          });
        }
        break;
      }

      case 'wav': {
        // RIFF....WAVE
        if (
          buffer.length >= 12 &&
          buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
          buffer.subarray(8, 12).toString('ascii') === 'WAVE'
        ) {
          matched = true;
          detectedType = 'WAV';
          detectedMime = 'audio/wav';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_WAV',
            severity: 'high',
            message: 'File does not start with valid WAV magic header (RIFF....WAVE).',
          });
        }
        break;
      }

      case 'ogg': {
        // OggS (4F 67 67 53)
        if (buffer.length >= 4 && buffer.subarray(0, 4).toString('ascii') === 'OggS') {
          matched = true;
          detectedType = 'OGG';
          detectedMime = 'audio/ogg';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_OGG',
            severity: 'high',
            message: 'File does not start with valid OGG container header (OggS).',
          });
        }
        break;
      }

      case 'mp4':
      case 'm4a':
      case 'mov': {
        // ISO Base Media File Format box signatures
        // Typically offset 4..7 contains 'ftyp' or offset 0..3 contains 'moov' / 'mdat'
        let hasMp4Box = false;
        if (buffer.length >= 8) {
          const boxType = buffer.subarray(4, 8).toString('ascii');
          if (['ftyp', 'moov', 'mdat', 'wide'].includes(boxType)) {
            hasMp4Box = true;
          }
        }
        if (hasMp4Box) {
          matched = true;
          detectedType = ext.toUpperCase();
          detectedMime = ext === 'm4a' ? 'audio/mp4' : 'video/mp4';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_MP4',
            severity: 'medium',
            message: `File does not have expected MP4/MOV ISO box header (ftyp).`,
          });
        }
        break;
      }

      case 'webm': {
        // EBML header: 1A 45 DF A3
        if (
          buffer.length >= 4 &&
          buffer[0] === 0x1a &&
          buffer[1] === 0x45 &&
          buffer[2] === 0xdf &&
          buffer[3] === 0xa3
        ) {
          matched = true;
          detectedType = 'WEBM';
          detectedMime = 'video/webm';
        } else {
          findings.push({
            code: 'FILE_SIGNATURE_MISMATCH_WEBM',
            severity: 'high',
            message: 'File does not start with valid WebM/MKV EBML header (1A 45 DF A3).',
          });
        }
        break;
      }

      case 'txt': {
        // Plain text validation: check for null bytes or control characters that indicate binary
        const sample = buffer.subarray(0, Math.min(buffer.length, 4096));
        let nullByteCount = 0;
        for (let i = 0; i < sample.length; i++) {
          if (sample[i] === 0) nullByteCount++;
        }
        if (nullByteCount > 0) {
          findings.push({
            code: 'FILE_SIGNATURE_BINARY_TXT',
            severity: 'high',
            message: 'File labeled as plain text contains null bytes, indicating binary data.',
          });
        } else {
          matched = true;
          detectedType = 'TXT';
          detectedMime = 'text/plain';
        }
        break;
      }

      default: {
        // Any other type
        matched = true;
        detectedType = ext.toUpperCase();
      }
    }

    const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

    return {
      detectedType,
      detectedMime,
      isExecutable: false,
      valid: matched && !hasCriticalOrHigh,
      findings,
    };
  }

  private static isExecutableSignature(buffer: Buffer): boolean {
    if (buffer.length < 2) return false;

    // 1. Windows PE / DOS MZ header: 'MZ' (4D 5A)
    if (buffer[0] === 0x4d && buffer[1] === 0x5a) {
      return true;
    }

    // 2. Linux ELF header: 7F 45 4C 46 (\x7fELF)
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x7f &&
      buffer[1] === 0x45 &&
      buffer[2] === 0x4c &&
      buffer[3] === 0x46
    ) {
      return true;
    }

    // 3. macOS Mach-O headers:
    // FE ED FA CE, FEEDFACF, CEFAEDFE, CFFAEDFE, CAFEBABE
    if (buffer.length >= 4) {
      const b0 = buffer[0];
      const b1 = buffer[1];
      const b2 = buffer[2];
      const b3 = buffer[3];

      if (
        (b0 === 0xfe && b1 === 0xed && b2 === 0xfa && (b3 === 0xce || b3 === 0xcf)) ||
        (b0 === 0xce && b1 === 0xfa && b2 === 0xed && b3 === 0xfe) ||
        (b0 === 0xcf && b1 === 0xfa && b2 === 0xed && b3 === 0xfe) ||
        (b0 === 0xca && b1 === 0xfe && b2 === 0xba && b3 === 0xbe)
      ) {
        return true;
      }
    }

    // 4. Shell Script hashbang: #! (23 21)
    if (buffer.length >= 2 && buffer[0] === 0x23 && buffer[1] === 0x21) {
      return true;
    }

    return false;
  }
}
