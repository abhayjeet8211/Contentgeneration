import JSZip from 'jszip';
import { ArchiveValidator } from './ArchiveValidator';
import { SecurityFinding } from '../models/SecurityFinding';

export interface DocumentInspectionResult {
  valid: boolean;
  findings: SecurityFinding[];
  details?: Record<string, unknown>;
}

export class DocumentSecurityValidator {
  public static async inspect(
    buffer: Buffer,
    extension: string
  ): Promise<DocumentInspectionResult> {
    const ext = extension.toLowerCase().replace(/^\./, '');

    if (ext === 'pdf') {
      return this.inspectPdf(buffer);
    }

    if (ext === 'docx' || ext === 'pptx') {
      return this.inspectOfficePackage(buffer, ext);
    }

    return { valid: true, findings: [] };
  }

  /**
   * PDF Inspection (Safe byte & string pattern inspection without execution)
   */
  public static inspectPdf(buffer: Buffer): DocumentInspectionResult {
    const findings: SecurityFinding[] = [];
    const content = buffer.toString('binary');

    // 1. Structural check: %PDF header and %%EOF trailer
    if (!content.startsWith('%PDF-')) {
      findings.push({
        code: 'PDF_MALFORMED_HEADER',
        severity: 'high',
        message: 'PDF document header is malformed.',
      });
    }

    if (!content.includes('%%EOF')) {
      findings.push({
        code: 'PDF_MALFORMED_EOF',
        severity: 'medium',
        message: 'PDF is missing EOF marker, indicating possible corruption or truncation.',
      });
    }

    // 2. Embedded JavaScript detection: /JavaScript or /JS
    if (/\/JavaScript/i.test(content) || /\/JS\b/i.test(content)) {
      findings.push({
        code: 'PDF_EMBEDDED_JAVASCRIPT',
        severity: 'high',
        message: 'PDF contains embedded JavaScript.',
      });
    }

    // 3. Launch actions detection: /Launch
    if (/\/Launch\b/i.test(content)) {
      findings.push({
        code: 'PDF_LAUNCH_ACTION',
        severity: 'high',
        message: 'PDF contains external process launch action (/Launch).',
      });
    }

    // 4. Embedded files detection: /EmbeddedFiles or /EF
    if (/\/EmbeddedFiles/i.test(content) || /\/EF\b/i.test(content)) {
      findings.push({
        code: 'PDF_EMBEDDED_FILES',
        severity: 'medium',
        message: 'PDF contains embedded file attachments (/EmbeddedFiles).',
      });
    }

    // 5. Automatic execution actions: /OpenAction, /AA
    if (/\/OpenAction/i.test(content) || /\/AA\b/i.test(content)) {
      findings.push({
        code: 'PDF_AUTOMATIC_ACTION',
        severity: 'low',
        message: 'PDF defines automatic action triggers upon document open (/OpenAction).',
      });
    }

    // 6. Suspicious URI actions: /URI with script/file targets
    const uriMatches = content.match(/\/URI\s*\(([^)]+)\)/gi);
    if (uriMatches) {
      for (const m of uriMatches) {
        if (/javascript:|data:|file:/i.test(m)) {
          findings.push({
            code: 'PDF_DANGEROUS_URI',
            severity: 'high',
            message: 'PDF contains dangerous URI action schema.',
            details: { uriAction: m },
          });
        }
      }
    }

    const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

    return {
      valid: !hasCriticalOrHigh,
      findings,
    };
  }

  /**
   * Office DOCX / PPTX OpenXML Inspection
   */
  public static async inspectOfficePackage(
    buffer: Buffer,
    ext: string
  ): Promise<DocumentInspectionResult> {
    const findings: SecurityFinding[] = [];

    // 1. Archive bomb and structural inspection
    const archiveResult = await ArchiveValidator.inspectZip(buffer);
    findings.push(...archiveResult.findings);

    if (!archiveResult.valid) {
      return { valid: false, findings };
    }

    try {
      const zip = await JSZip.loadAsync(buffer);
      const fileNames = Object.keys(zip.files);

      // 2. Macro inspection (vbaProject.bin, vbaData.xml)
      const macroFiles = fileNames.filter(
        (name) =>
          /vbaProject\.bin$/i.test(name) ||
          /word\/vbaData\.xml$/i.test(name) ||
          /ppt\/vbaProject\.bin$/i.test(name) ||
          /\.vba$/i.test(name)
      );

      if (macroFiles.length > 0) {
        findings.push({
          code: 'OFFICE_MACROS_DETECTED',
          severity: 'high',
          message: 'Macro-enabled Office documents are not supported.',
          details: { detectedFiles: macroFiles },
        });
      }

      // 3. Embedded executable files within the document archive
      const dangerousExts = ['.exe', '.dll', '.bat', '.cmd', '.ps1', '.sh', '.vbs', '.js', '.scr', '.msi', '.com'];
      const dangerousEntries = fileNames.filter((name) => {
        const lower = name.toLowerCase();
        return dangerousExts.some((ext) => lower.endsWith(ext));
      });

      if (dangerousEntries.length > 0) {
        findings.push({
          code: 'OFFICE_EMBEDDED_EXECUTABLE',
          severity: 'critical',
          message: 'Office document contains embedded executable content.',
          details: { entries: dangerousEntries },
        });
      }

      // 4. Verify OpenXML required core structures
      const hasContentTypes = Boolean(zip.files['[Content_Types].xml']);
      const hasDocStructure =
        ext === 'docx'
          ? fileNames.some((f) => f.startsWith('word/'))
          : fileNames.some((f) => f.startsWith('ppt/'));

      if (!hasContentTypes || !hasDocStructure) {
        findings.push({
          code: 'OFFICE_INVALID_OPENXML_STRUCTURE',
          severity: 'high',
          message: `File does not have a valid ${ext.toUpperCase()} OpenXML package structure.`,
          details: { hasContentTypes, hasDocStructure },
        });
      }

      // 5. Inspect Relationships for external suspicious targets (_rels)
      const relFiles = fileNames.filter((name) => name.endsWith('.rels'));
      for (const relFile of relFiles) {
        try {
          const relXml = await zip.files[relFile].async('string');
          if (/TargetMode="External"/i.test(relXml)) {
            // Check for dangerous protocols or UNC paths in Target="..."
            const targets = relXml.match(/Target="([^"]+)"/gi) || [];
            for (const t of targets) {
              const targetVal = t.replace(/^Target="/i, '').replace(/"$/, '');
              if (
                targetVal.startsWith('\\\\') ||
                /^file:/i.test(targetVal) ||
                /^javascript:/i.test(targetVal)
              ) {
                findings.push({
                  code: 'OFFICE_SUSPICIOUS_EXTERNAL_RELATIONSHIP',
                  severity: 'high',
                  message: `Office document contains suspicious external relationship: ${targetVal}`,
                  details: { relFile, target: targetVal },
                });
              }
            }
          }
        } catch {
          // ignore rel XML parse issues
        }
      }

      const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

      return {
        valid: !hasCriticalOrHigh,
        findings,
      };
    } catch (err: unknown) {
      findings.push({
        code: 'OFFICE_INSPECTION_FAILED',
        severity: 'high',
        message: 'Failed to inspect Office document package.',
        details: { error: err instanceof Error ? err.message : String(err) },
      });
      return { valid: false, findings };
    }
  }
}
