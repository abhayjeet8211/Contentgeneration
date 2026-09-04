import { SecurityFinding } from '../models/SecurityFinding';

export interface SchemeValidationResult {
  valid: boolean;
  scheme: string;
  parsedUrl?: URL;
  findings: SecurityFinding[];
}

export const ALLOWED_URL_SCHEMES = new Set(['http:', 'https:']);

export class UrlSchemeValidator {
  public static validate(urlString: string): SchemeValidationResult {
    const findings: SecurityFinding[] = [];
    const trimmed = (urlString || '').trim();

    if (!trimmed) {
      findings.push({
        code: 'URL_EMPTY',
        severity: 'critical',
        message: 'URL cannot be empty.',
      });
      return { valid: false, scheme: '', findings };
    }

    let parsed: URL;
    try {
      parsed = new URL(trimmed);
    } catch {
      findings.push({
        code: 'URL_INVALID_FORMAT',
        severity: 'critical',
        message: `Invalid URL format: ${trimmed}`,
        details: { url: trimmed },
      });
      return { valid: false, scheme: '', findings };
    }

    const scheme = parsed.protocol.toLowerCase();

    if (!ALLOWED_URL_SCHEMES.has(scheme)) {
      findings.push({
        code: 'URL_FORBIDDEN_SCHEME',
        severity: 'critical',
        message: `Forbidden URL scheme: "${scheme}". Only http: and https: are allowed.`,
        details: { scheme, url: trimmed },
      });
      return { valid: false, scheme, parsedUrl: parsed, findings };
    }

    return { valid: true, scheme, parsedUrl: parsed, findings };
  }
}
