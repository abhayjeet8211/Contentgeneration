import { prisma } from '../db/prisma';
import { FileSecurityValidator, ComprehensiveFileScanResult } from './file/FileSecurityValidator';
import { UrlSecurityValidator, ComprehensiveUrlScanResult } from './url/UrlSecurityValidator';
import { ContentHashService } from './hashing/ContentHashService';
import { DuplicateDetector, DuplicateDetectionResult } from './duplicate/DuplicateDetector';
import { SecurityScanResult } from './models/SecurityScanResult';
import { SafeFetchOptions, SafeFetchResponse } from './url/RedirectValidator';
import { securityConfig } from './config/SecurityConfig';

export interface SecurityValidationContext {
  userId?: string;
  projectId?: string;
}

export interface FileValidationServiceResult {
  scanResult: ComprehensiveFileScanResult;
  duplicateInfo?: DuplicateDetectionResult;
  accepted: boolean;
  userMessage?: string;
}

export interface UrlValidationServiceResult {
  scanResult: ComprehensiveUrlScanResult;
  accepted: boolean;
  userMessage?: string;
}

export interface TextValidationServiceResult {
  scanResult: SecurityScanResult;
  contentHash: string;
  duplicateInfo?: DuplicateDetectionResult;
  accepted: boolean;
  userMessage?: string;
}

export class SecurityValidationService {
  /**
   * Central Security Gateway for File Uploads
   */
  public static async validateUploadedFile(
    buffer: Buffer,
    originalFilename: string,
    declaredMimeType: string,
    context?: SecurityValidationContext
  ): Promise<FileValidationServiceResult> {
    // 1. Run full modular file security scan
    const scanResult = await FileSecurityValidator.scanFile(
      buffer,
      originalFilename,
      declaredMimeType
    );

    const accepted = scanResult.status !== 'rejected';

    // 2. If accepted, run duplicate detection
    let duplicateInfo: DuplicateDetectionResult | undefined;
    if (accepted && scanResult.contentHash) {
      duplicateInfo = await DuplicateDetector.checkDuplicate({
        contentHash: scanResult.contentHash,
        userId: context?.userId,
        projectId: context?.projectId,
      });
    }

    // 3. Formulate safe user-facing message
    let userMessage: string | undefined;
    if (!accepted) {
      const topFinding = scanResult.findings.find(
        (f) => f.severity === 'critical' || f.severity === 'high'
      );
      userMessage = topFinding?.message || 'The uploaded file failed security validation.';
    } else if (duplicateInfo?.isDuplicate) {
      userMessage = duplicateInfo.message;
    }

    return {
      scanResult,
      duplicateInfo,
      accepted,
      userMessage,
    };
  }

  /**
   * Central Security Gateway for URLs
   */
  public static async validateUrl(
    url: string,
    context?: SecurityValidationContext
  ): Promise<UrlValidationServiceResult> {
    const scanResult = await UrlSecurityValidator.validateUrl(url);
    const accepted = scanResult.status !== 'rejected';

    let userMessage: string | undefined;
    if (!accepted) {
      const topFinding = scanResult.findings.find(
        (f) => f.severity === 'critical' || f.severity === 'high'
      );
      userMessage =
        topFinding?.message || 'The provided URL violates security policy or points to private/internal resources.';
    }

    return {
      scanResult,
      accepted,
      userMessage,
    };
  }

  /**
   * Safe Fetch with redirect protection, timeouts, and size limits
   */
  public static async safeFetchUrl(
    url: string,
    options?: SafeFetchOptions
  ): Promise<SafeFetchResponse> {
    return UrlSecurityValidator.safeFetchUrl(url, options);
  }

  /**
   * Central Security Gateway for Raw Text Inputs
   */
  public static async validateTextInput(
    text: string,
    title: string = 'Untitled Text Source',
    context?: SecurityValidationContext
  ): Promise<TextValidationServiceResult> {
    const checksPerformed = ['TextLengthValidator', 'ContentHashService'];
    const findings = [];
    const contentHash = ContentHashService.hashText(text);

    if (!text || text.trim().length === 0) {
      findings.push({
        code: 'TEXT_EMPTY',
        severity: 'critical' as const,
        message: 'Text content cannot be empty.',
      });
    }

    // Maximum text length check (e.g. 10MB worth of text ~ 10,000,000 chars)
    const maxChars = 10 * 1024 * 1024;
    if (text.length > maxChars) {
      findings.push({
        code: 'TEXT_LENGTH_EXCEEDED',
        severity: 'high' as const,
        message: `Text length exceeds maximum allowed limit of ${maxChars} characters.`,
      });
    }

    const accepted = findings.every((f) => f.severity !== 'critical' && f.severity !== 'high');

    let duplicateInfo: DuplicateDetectionResult | undefined;
    if (accepted && contentHash) {
      duplicateInfo = await DuplicateDetector.checkDuplicate({
        contentHash,
        userId: context?.userId,
        projectId: context?.projectId,
      });
    }

    const scanResult: SecurityScanResult = {
      status: accepted ? (findings.length > 0 ? 'warning' : 'passed') : 'rejected',
      checksPerformed,
      findings,
      contentHash,
      hashAlgorithm: 'SHA-256',
      scannerVersion: securityConfig.scannerVersion,
      timestamp: new Date().toISOString(),
    };

    return {
      scanResult,
      contentHash,
      duplicateInfo,
      accepted,
      userMessage: !accepted ? findings[0]?.message : duplicateInfo?.message,
    };
  }

  /**
   * Persist Security Scan Record in Database
   */
  public static async recordSecurityScan(
    scanResult: SecurityScanResult,
    sourceId?: string
  ) {
    try {
      return await prisma.securityScan.create({
        data: {
          sourceId: sourceId || null,
          status: scanResult.status.toUpperCase(),
          contentHash: scanResult.contentHash || null,
          checksPerformed: JSON.stringify(scanResult.checksPerformed),
          findings: JSON.stringify(scanResult.findings),
          scannerVersion: scanResult.scannerVersion,
        },
      });
    } catch (err) {
      console.error('Failed to persist security scan record in database:', err);
      return null;
    }
  }
}
