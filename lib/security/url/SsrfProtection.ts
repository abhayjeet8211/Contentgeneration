import dns from 'dns/promises';
import net from 'net';
import { SecurityFinding } from '../models/SecurityFinding';
import { HostValidator } from './HostValidator';
import { IpRangeValidator } from './IpRangeValidator';

export interface DnsSsrfResult {
  valid: boolean;
  hostname: string;
  resolvedIps: string[];
  findings: SecurityFinding[];
}

export class SsrfProtection {
  public static async validateHostnameDns(hostname: string): Promise<DnsSsrfResult> {
    const findings: SecurityFinding[] = [];

    // 1. Initial Hostname validation
    const hostResult = HostValidator.validate(hostname);
    findings.push(...hostResult.findings);

    if (!hostResult.valid) {
      return {
        valid: false,
        hostname,
        resolvedIps: hostResult.isDirectIp ? [hostname] : [],
        findings,
      };
    }

    // If it was already a valid public direct IP, no DNS resolution needed
    if (hostResult.isDirectIp) {
      return {
        valid: true,
        hostname,
        resolvedIps: [hostname],
        findings,
      };
    }

    // 2. Perform DNS resolution to check resolved IP addresses
    const resolvedIps: string[] = [];

    try {
      // Lookup both IPv4 and IPv6 addresses
      const lookups = await dns.lookup(hostname, { all: true });

      for (const entry of lookups) {
        resolvedIps.push(entry.address);
        const ipCheck = IpRangeValidator.isPrivateOrReservedIp(entry.address);

        if (ipCheck.isPrivateOrReserved) {
          findings.push({
            code: 'SSRF_RESOLVED_PRIVATE_IP',
            severity: 'critical',
            message: `SSRF Blocked: Hostname "${hostname}" resolves to private/reserved IP: ${entry.address} (${ipCheck.reason})`,
            details: {
              hostname,
              resolvedIp: entry.address,
              reason: ipCheck.reason,
            },
          });
        }
      }

      if (resolvedIps.length === 0) {
        findings.push({
          code: 'SSRF_DNS_NO_RECORDS',
          severity: 'high',
          message: `DNS resolution returned no records for hostname: ${hostname}`,
          details: { hostname },
        });
      }
    } catch (err: unknown) {
      findings.push({
        code: 'SSRF_DNS_RESOLUTION_FAILED',
        severity: 'high',
        message: `DNS lookup failed for hostname "${hostname}": ${err instanceof Error ? err.message : String(err)}`,
        details: { hostname, error: String(err) },
      });
    }

    const hasCriticalOrHigh = findings.some((f) => f.severity === 'critical' || f.severity === 'high');

    return {
      valid: !hasCriticalOrHigh,
      hostname,
      resolvedIps,
      findings,
    };
  }
}
