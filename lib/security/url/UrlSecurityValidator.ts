import { UrlSchemeValidator } from './UrlSchemeValidator';
import { SsrfProtection } from './SsrfProtection';
import { RedirectValidator, SafeFetchOptions, SafeFetchResponse } from './RedirectValidator';
import { SecurityScanResult, SecurityScanStatus } from '../models/SecurityScanResult';
import { SecurityFinding } from '../models/SecurityFinding';
import { securityConfig } from '../config/SecurityConfig';
import { ContentHashService } from '../hashing/ContentHashService';

export interface ComprehensiveUrlScanResult extends SecurityScanResult {
  valid: boolean;
  url: string;
  scheme: string;
  hostname: string;
  resolvedIps: string[];
}

export class UrlSecurityValidator {
  public static async validateUrl(urlString: string): Promise<ComprehensiveUrlScanResult> {
    const checksPerformed: string[] = [];
    const allFindings: SecurityFinding[] = [];

    // 1. Scheme Validation
    checksPerformed.push('UrlSchemeValidator');
    const schemeResult = UrlSchemeValidator.validate(urlString);
    allFindings.push(...schemeResult.findings);

    if (!schemeResult.valid || !schemeResult.parsedUrl) {
      return {
        status: 'rejected',
        valid: false,
        checksPerformed,
        findings: allFindings,
        url: urlString,
        scheme: schemeResult.scheme || 'unknown',
        hostname: '',
        resolvedIps: [],
        scannerVersion: securityConfig.scannerVersion,
        timestamp: new Date().toISOString(),
      };
    }

    const hostname = schemeResult.parsedUrl.hostname;

    // 2. Host & SSRF DNS Validation
    checksPerformed.push('SsrfProtection');
    const ssrfResult = await SsrfProtection.validateHostnameDns(hostname);
    allFindings.push(...ssrfResult.findings);

    // 3. Content hash of the URL string itself (for initial identifier)
    checksPerformed.push('ContentHashService');
    const contentHash = ContentHashService.hashText(urlString);

    // 4. Determine status
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

    return {
      status,
      valid: status !== 'rejected',
      checksPerformed,
      findings: allFindings,
      contentHash,
      hashAlgorithm: 'SHA-256',
      url: urlString,
      scheme: schemeResult.scheme,
      hostname,
      resolvedIps: ssrfResult.resolvedIps,
      scannerVersion: securityConfig.scannerVersion,
      timestamp: new Date().toISOString(),
    };
  }

  public static async safeFetchUrl(
    url: string,
    options?: SafeFetchOptions
  ): Promise<SafeFetchResponse> {
    return RedirectValidator.safeFetch(url, options);
  }
}
