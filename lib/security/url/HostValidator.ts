import net from 'net';
import { SecurityFinding } from '../models/SecurityFinding';
import { IpRangeValidator } from './IpRangeValidator';

export interface HostValidationResult {
  valid: boolean;
  hostname: string;
  isDirectIp: boolean;
  findings: SecurityFinding[];
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'broadcasthost',
  'local',
  'ip6-localhost',
  'ip6-loopback',
]);

export class HostValidator {
  public static validate(hostname: string): HostValidationResult {
    const findings: SecurityFinding[] = [];
    const cleanHost = (hostname || '').toLowerCase().trim().replace(/^\[|\]$/g, ''); // strip IPv6 brackets

    if (!cleanHost) {
      findings.push({
        code: 'HOST_EMPTY',
        severity: 'critical',
        message: 'Hostname cannot be empty.',
      });
      return { valid: false, hostname: cleanHost, isDirectIp: false, findings };
    }

    // 1. Direct blocklist check
    if (
      BLOCKED_HOSTNAMES.has(cleanHost) ||
      cleanHost.endsWith('.localhost') ||
      cleanHost.endsWith('.local') ||
      cleanHost.endsWith('.internal') ||
      cleanHost.endsWith('.corp') ||
      cleanHost.endsWith('.home') ||
      cleanHost.endsWith('.lan')
    ) {
      findings.push({
        code: 'HOST_LOCAL_OR_INTERNAL',
        severity: 'critical',
        message: `Internal, loopback, or local domain blocked: ${cleanHost}`,
        details: { hostname: cleanHost },
      });
      return { valid: false, hostname: cleanHost, isDirectIp: false, findings };
    }

    // 2. Check if hostname is an encoded numeric IP (e.g. decimal dword 2130706433 or octal 0177.0.0.1)
    if (/^\d+$/.test(cleanHost)) {
      // Decimal integer representation of IP
      const dword = parseInt(cleanHost, 10);
      const ip = [
        (dword >>> 24) & 255,
        (dword >>> 16) & 255,
        (dword >>> 8) & 255,
        dword & 255,
      ].join('.');

      const ipCheck = IpRangeValidator.isPrivateOrReservedIp(ip);
      if (ipCheck.isPrivateOrReserved) {
        findings.push({
          code: 'HOST_ENCODED_PRIVATE_IP',
          severity: 'critical',
          message: `Encoded numeric IP evaluates to private/loopback address: ${ip}`,
          details: { encoded: cleanHost, decoded: ip, reason: ipCheck.reason },
        });
      }
      return { valid: !ipCheck.isPrivateOrReserved, hostname: cleanHost, isDirectIp: true, findings };
    }

    // 3. Direct IP Address Validation
    const ipVersion = net.isIP(cleanHost);
    if (ipVersion !== 0) {
      const ipCheck = IpRangeValidator.isPrivateOrReservedIp(cleanHost);
      if (ipCheck.isPrivateOrReserved) {
        findings.push({
          code: 'HOST_PRIVATE_IP',
          severity: 'critical',
          message: `Direct private or loopback IP address blocked: ${cleanHost} (${ipCheck.reason})`,
          details: { ip: cleanHost, reason: ipCheck.reason },
        });
        return { valid: false, hostname: cleanHost, isDirectIp: true, findings };
      }
      return { valid: true, hostname: cleanHost, isDirectIp: true, findings };
    }

    // 4. Validate hostname syntax
    if (!/^[a-zA-Z0-9.-]+$/.test(cleanHost)) {
      findings.push({
        code: 'HOST_INVALID_CHARACTERS',
        severity: 'critical',
        message: `Hostname contains invalid characters: ${cleanHost}`,
      });
      return { valid: false, hostname: cleanHost, isDirectIp: false, findings };
    }

    return { valid: true, hostname: cleanHost, isDirectIp: false, findings };
  }
}
