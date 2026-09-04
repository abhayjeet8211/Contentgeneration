import net from 'net';

export interface IpValidationResult {
  isPrivateOrReserved: boolean;
  ip: string;
  version: 4 | 6 | null;
  reason?: string;
}

export class IpRangeValidator {
  public static isPrivateOrReservedIp(ipString: string): IpValidationResult {
    const cleanIp = (ipString || '').trim();
    const version = net.isIP(cleanIp) as 0 | 4 | 6;

    if (version === 0) {
      return {
        isPrivateOrReserved: true,
        ip: cleanIp,
        version: null,
        reason: 'Invalid IP address syntax',
      };
    }

    if (version === 4) {
      return this.checkIpv4(cleanIp);
    }

    return this.checkIpv6(cleanIp);
  }

  private static checkIpv4(ip: string): IpValidationResult {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Malformed IPv4 octets' };
    }

    const [o1, o2, o3, o4] = parts;

    // 0.0.0.0/8 - Broadcast / "This host on this network"
    if (o1 === 0) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Current network (0.0.0.0/8)' };
    }

    // 127.0.0.0/8 - Loopback
    if (o1 === 127) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Loopback address (127.0.0.0/8)' };
    }

    // 10.0.0.0/8 - Private Class A
    if (o1 === 10) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Private RFC1918 Class A (10.0.0.0/8)' };
    }

    // 172.16.0.0/12 - Private Class B (172.16.0.0 to 172.31.255.255)
    if (o1 === 172 && o2 >= 16 && o2 <= 31) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Private RFC1918 Class B (172.16.0.0/12)' };
    }

    // 192.168.0.0/16 - Private Class C
    if (o1 === 192 && o2 === 168) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Private RFC1918 Class C (192.168.0.0/16)' };
    }

    // 169.254.0.0/16 - Link-Local / Cloud Metadata (AWS, GCP, Azure 169.254.169.254)
    if (o1 === 169 && o2 === 254) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Link-local / Cloud Metadata (169.254.0.0/16)' };
    }

    // 100.64.0.0/10 - Carrier Grade NAT (100.64.0.0 - 100.127.255.255)
    if (o1 === 100 && o2 >= 64 && o2 <= 127) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Carrier-grade NAT (100.64.0.0/10)' };
    }

    // 192.0.0.0/24 - IETF Protocol Assignments
    if (o1 === 192 && o2 === 0 && o3 === 0) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'IETF Protocol Assignments (192.0.0.0/24)' };
    }

    // 198.18.0.0/15 - Benchmark tests (198.18.0.0 - 198.19.255.255)
    if (o1 === 198 && (o2 === 18 || o2 === 19)) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Benchmark testing range (198.18.0.0/15)' };
    }

    // 224.0.0.0/4 - Multicast
    if (o1 >= 224 && o1 <= 239) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Multicast range (224.0.0.0/4)' };
    }

    // 240.0.0.0/4 - Reserved
    if (o1 >= 240) {
      return { isPrivateOrReserved: true, ip, version: 4, reason: 'Reserved range (240.0.0.0/4)' };
    }

    return { isPrivateOrReserved: false, ip, version: 4 };
  }

  private static checkIpv6(ip: string): IpValidationResult {
    const lower = ip.toLowerCase();

    // Check for IPv4-mapped IPv6 address (::ffff:127.0.0.1 or ::ffff:7f00:1)
    if (lower.startsWith('::ffff:')) {
      const ipv4Part = lower.replace('::ffff:', '');
      if (net.isIPv4(ipv4Part)) {
        const v4Res = this.checkIpv4(ipv4Part);
        if (v4Res.isPrivateOrReserved) {
          return { isPrivateOrReserved: true, ip, version: 6, reason: `IPv4-mapped ${v4Res.reason}` };
        }
      }
    }

    // ::1 - Loopback
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') {
      return { isPrivateOrReserved: true, ip, version: 6, reason: 'IPv6 Loopback (::1)' };
    }

    // :: - Unspecified
    if (lower === '::' || lower === '0:0:0:0:0:0:0:0') {
      return { isPrivateOrReserved: true, ip, version: 6, reason: 'IPv6 Unspecified address (::)' };
    }

    // fe80::/10 - Link-Local
    if (/^fe[89ab]/i.test(lower)) {
      return { isPrivateOrReserved: true, ip, version: 6, reason: 'IPv6 Link-Local (fe80::/10)' };
    }

    // fc00::/7 - Unique Local Address (fc00:: to fdff::)
    if (/^f[cd]/i.test(lower)) {
      return { isPrivateOrReserved: true, ip, version: 6, reason: 'IPv6 Unique Local Address (fc00::/7)' };
    }

    // ff00::/8 - Multicast
    if (lower.startsWith('ff')) {
      return { isPrivateOrReserved: true, ip, version: 6, reason: 'IPv6 Multicast (ff00::/8)' };
    }

    return { isPrivateOrReserved: false, ip, version: 6 };
  }
}
