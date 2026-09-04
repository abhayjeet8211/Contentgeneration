import { securityConfig } from '../config/SecurityConfig';
import { SecurityFinding } from '../models/SecurityFinding';
import { UrlSchemeValidator } from './UrlSchemeValidator';
import { SsrfProtection } from './SsrfProtection';
import { FileSignatureValidator } from '../file/FileSignatureValidator';

export interface SafeFetchResponse {
  ok: boolean;
  status: number;
  finalUrl: string;
  contentType: string;
  buffer: Buffer;
  headers: Record<string, string>;
  findings: SecurityFinding[];
  redirectChain: string[];
}

export interface SafeFetchOptions {
  method?: 'GET' | 'HEAD';
  headers?: Record<string, string>;
  expectedMimeTypePrefix?: string;
  maxRedirects?: number;
  timeoutMs?: number;
}

export class RedirectValidator {
  public static async safeFetch(
    initialUrl: string,
    options: SafeFetchOptions = {}
  ): Promise<SafeFetchResponse> {
    const findings: SecurityFinding[] = [];
    const redirectChain: string[] = [initialUrl];
    const maxRedirects = options.maxRedirects ?? securityConfig.maxUrlRedirects;
    const timeoutMs = options.timeoutMs ?? securityConfig.urlRequestTimeoutMs;
    const maxBytes = securityConfig.maxUrlResponseSizeMb * 1024 * 1024;

    let currentUrl = initialUrl;
    let redirectCount = 0;

    while (true) {
      // 1. Validate Scheme
      const schemeResult = UrlSchemeValidator.validate(currentUrl);
      if (!schemeResult.valid || !schemeResult.parsedUrl) {
        findings.push(...schemeResult.findings);
        return {
          ok: false,
          status: 400,
          finalUrl: currentUrl,
          contentType: '',
          buffer: Buffer.alloc(0),
          headers: {},
          findings,
          redirectChain,
        };
      }

      // 2. SSRF & DNS Validation
      const hostname = schemeResult.parsedUrl.hostname;
      const dnsResult = await SsrfProtection.validateHostnameDns(hostname);
      if (!dnsResult.valid) {
        findings.push(...dnsResult.findings);
        return {
          ok: false,
          status: 400,
          finalUrl: currentUrl,
          contentType: '',
          buffer: Buffer.alloc(0),
          headers: {},
          findings,
          redirectChain,
        };
      }

      // 3. Perform Fetch with Timeout and Manual Redirect
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      let response: Response;
      try {
        response = await fetch(currentUrl, {
          method: options.method || 'GET',
          redirect: 'manual', // DO NOT blindly follow redirects!
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 ContentIntelligence/2.0',
            ...options.headers,
          },
          signal: controller.signal,
        });
      } catch (err: unknown) {
        clearTimeout(timer);
        findings.push({
          code: 'FETCH_NETWORK_ERROR',
          severity: 'high',
          message: `Network fetch failed for URL "${currentUrl}": ${err instanceof Error ? err.message : String(err)}`,
          details: { url: currentUrl, error: String(err) },
        });
        return {
          ok: false,
          status: 502,
          finalUrl: currentUrl,
          contentType: '',
          buffer: Buffer.alloc(0),
          headers: {},
          findings,
          redirectChain,
        };
      } finally {
        clearTimeout(timer);
      }

      // 4. Check for HTTP Redirects (301, 302, 303, 307, 308)
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        redirectCount++;
        if (redirectCount > maxRedirects) {
          findings.push({
            code: 'FETCH_REDIRECT_LIMIT_EXCEEDED',
            severity: 'high',
            message: `Too many redirects. Exceeded limit of ${maxRedirects} redirects.`,
            details: { redirectCount, maxRedirects, redirectChain },
          });
          return {
            ok: false,
            status: 310,
            finalUrl: currentUrl,
            contentType: '',
            buffer: Buffer.alloc(0),
            headers: {},
            findings,
            redirectChain,
          };
        }

        const locationHeader = response.headers.get('location');
        if (!locationHeader) {
          findings.push({
            code: 'FETCH_REDIRECT_NO_LOCATION',
            severity: 'high',
            message: `Redirect HTTP ${response.status} missing Location header.`,
          });
          return {
            ok: false,
            status: response.status,
            finalUrl: currentUrl,
            contentType: '',
            buffer: Buffer.alloc(0),
            headers: {},
            findings,
            redirectChain,
          };
        }

        // Resolve redirect URL target relative to current URL
        try {
          const nextUrl = new URL(locationHeader, currentUrl).toString();
          redirectChain.push(nextUrl);
          currentUrl = nextUrl;
          // Loop continues to re-validate scheme, DNS, and SSRF for the redirect target
          continue;
        } catch {
          findings.push({
            code: 'FETCH_REDIRECT_INVALID_TARGET',
            severity: 'critical',
            message: `Invalid redirect URL target: ${locationHeader}`,
          });
          return {
            ok: false,
            status: 400,
            finalUrl: currentUrl,
            contentType: '',
            buffer: Buffer.alloc(0),
            headers: {},
            findings,
            redirectChain,
          };
        }
      }

      // 5. Normal response reached: Inspect response headers and size
      const rawContentType = response.headers.get('content-type') || 'application/octet-stream';
      const contentLengthHeader = response.headers.get('content-length');

      if (contentLengthHeader) {
        const declaredSize = parseInt(contentLengthHeader, 10);
        if (!isNaN(declaredSize) && declaredSize > maxBytes) {
          findings.push({
            code: 'FETCH_RESPONSE_SIZE_EXCEEDED',
            severity: 'high',
            message: `URL response size (${(declaredSize / (1024 * 1024)).toFixed(1)} MB) exceeds allowed limit of ${securityConfig.maxUrlResponseSizeMb} MB.`,
            details: { declaredSize, maxAllowedBytes: maxBytes },
          });
          return {
            ok: false,
            status: 413,
            finalUrl: currentUrl,
            contentType: rawContentType,
            buffer: Buffer.alloc(0),
            headers: Object.fromEntries(response.headers.entries()),
            findings,
            redirectChain,
          };
        }
      }

      // 6. Read response body chunks safely with byte limit guard
      const chunks: Uint8Array[] = [];
      let totalBytesRead = 0;

      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            totalBytesRead += value.length;
            if (totalBytesRead > maxBytes) {
              findings.push({
                code: 'FETCH_STREAM_SIZE_EXCEEDED',
                severity: 'high',
                message: `Streamed URL response exceeded maximum allowed limit of ${securityConfig.maxUrlResponseSizeMb} MB.`,
                details: { totalBytesRead, maxAllowedBytes: maxBytes },
              });
              await reader.cancel();
              return {
                ok: false,
                status: 413,
                finalUrl: currentUrl,
                contentType: rawContentType,
                buffer: Buffer.alloc(0),
                headers: Object.fromEntries(response.headers.entries()),
                findings,
                redirectChain,
              };
            }
            chunks.push(value);
          }
        }
      }

      const bodyBuffer = Buffer.concat(chunks);

      // 7. Validate response bytes: Check if returned content is an executable disguised as HTML/PDF
      if (bodyBuffer.length > 0) {
        const sigResult = FileSignatureValidator.validate(bodyBuffer, 'bin');
        if (sigResult.isExecutable) {
          findings.push({
            code: 'URL_RESPONSE_EXECUTABLE_CONTENT',
            severity: 'critical',
            message: 'URL returned executable binary content, which is prohibited.',
          });
        }
      }

      const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

      return {
        ok: response.ok && !hasCriticalOrHigh,
        status: response.status,
        finalUrl: currentUrl,
        contentType: rawContentType,
        buffer: bodyBuffer,
        headers: Object.fromEntries(response.headers.entries()),
        findings,
        redirectChain,
      };
    }
  }
}
