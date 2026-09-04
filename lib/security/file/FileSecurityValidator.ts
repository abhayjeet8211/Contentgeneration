import { FilenameValidator, FilenameValidationResult } from './FilenameValidator';
import { FileSizeValidator, FileSizeValidationResult } from './FileSizeValidator';
import { FileTypeValidator, FileTypeValidationResult } from './FileTypeValidator';
import { FileSignatureValidator, SignatureDetectionResult } from './FileSignatureValidator';
import { DocumentSecurityValidator, DocumentInspectionResult } from './DocumentSecurityValidator';
import { SecurityScanResult, SecurityScanStatus } from '../models/SecurityScanResult';
import { SecurityFinding } from '../models/SecurityFinding';
import { securityConfig } from '../config/SecurityConfig';
import { ContentHashService } from '../hashing/ContentHashService';

export interface ComprehensiveFileScanResult extends SecurityScanResult {
  filenameResult: FilenameValidationResult;
  fileSizeResult: FileSizeValidationResult;
  fileTypeResult: FileTypeValidationResult;
  signatureResult: SignatureDetectionResult;
  documentResult?: DocumentInspectionResult;
  sanitizedFilename: string;
  storageIdentifier: string;
  detectedMimeType: string;
}

export class FileSecurityValidator {
  public static async scanFile(
    buffer: Buffer,
    originalFilename: string,
    declaredMimeType: string
  ): Promise<ComprehensiveFileScanResult> {
    const checksPerformed: string[] = [];
    const allFindings: SecurityFinding[] = [];

    // 1. Filename Validation
    checksPerformed.push('FilenameValidator');
    const filenameResult = FilenameValidator.validate(originalFilename);
    allFindings.push(...filenameResult.findings);

    // 2. File Type & Extension Validation
    checksPerformed.push('FileTypeValidator');
    const fileTypeResult = FileTypeValidator.validate(originalFilename, declaredMimeType);
    allFindings.push(...fileTypeResult.findings);

    // 3. File Size Validation
    checksPerformed.push('FileSizeValidator');
    const fileSizeResult = FileSizeValidator.validate(buffer.length, fileTypeResult.category);
    allFindings.push(...fileSizeResult.findings);

    // 4. File Signature & Magic Bytes Validation
    checksPerformed.push('FileSignatureValidator');
    const signatureResult = FileSignatureValidator.validate(buffer, fileTypeResult.extension);
    allFindings.push(...signatureResult.findings);

    // 5. Document & Archive Inspection (if document/presentation)
    let documentResult: DocumentInspectionResult | undefined;
    if (
      ['pdf', 'docx', 'pptx'].includes(fileTypeResult.extension) &&
      !signatureResult.isExecutable
    ) {
      checksPerformed.push('DocumentSecurityValidator');
      documentResult = await DocumentSecurityValidator.inspect(buffer, fileTypeResult.extension);
      allFindings.push(...documentResult.findings);
    }

    // 6. Calculate SHA-256 Content Hash
    checksPerformed.push('ContentHashService');
    const contentHash = ContentHashService.hashBuffer(buffer);

    // 7. Determine Final Status based on Findings and Security Policy
    let status: SecurityScanStatus = 'passed';

    const hasCritical = allFindings.some((f) => f.severity === 'critical');
    const hasHigh = allFindings.some((f) => f.severity === 'high');
    const hasMedium = allFindings.some((f) => f.severity === 'medium');

    if (hasCritical) {
      status = 'rejected';
    } else if (hasHigh) {
      status = securityConfig.rejectHighSeverity ? 'rejected' : 'warning';
    } else if (hasMedium) {
      status = securityConfig.rejectMediumSeverity ? 'rejected' : 'warning';
    } else if (allFindings.length > 0) {
      status = 'warning';
    }

    const detectedMime = signatureResult.detectedMime || fileTypeResult.declaredMimeType || 'application/octet-stream';

    return {
      status,
      checksPerformed,
      findings: allFindings,
      contentHash,
      hashAlgorithm: 'SHA-256',
      scannerVersion: securityConfig.scannerVersion,
      timestamp: new Date().toISOString(),
      filenameResult,
      fileSizeResult,
      fileTypeResult,
      signatureResult,
      documentResult,
      sanitizedFilename: filenameResult.sanitizedName,
      storageIdentifier: filenameResult.storageIdentifier,
      detectedMimeType: detectedMime,
      metadata: {
        sizeBytes: buffer.length,
        originalFilename,
        extension: fileTypeResult.extension,
        category: fileTypeResult.category,
      },
    };
  }
}
