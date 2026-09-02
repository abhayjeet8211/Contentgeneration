import { z } from 'zod';

export type DetectedSourceType =
  | 'YOUTUBE'
  | 'PODCAST'
  | 'DIRECT_AUDIO'
  | 'DIRECT_VIDEO'
  | 'PDF'
  | 'WEBPAGE'
  | 'UNSUPPORTED';

export interface DetectedUrlInfo {
  url: string;
  sourceType: DetectedSourceType;
  label: string;
  valid: boolean;
  metadata?: {
    videoId?: string;
    title?: string;
    duration?: string | number;
    thumbnail?: string;
    channel?: string;
    mimeType?: string;
    episodes?: Array<{
      title: string;
      audioUrl: string;
      duration?: string;
      pubDate?: string;
      description?: string;
    }>;
  };
  error?: string;
}

// SSRF Protection: verify hostname is not localhost, loopback, or private RFC1918 / link-local / cloud metadata IP
export function isSafeUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Disallow loopback / local hostnames
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local')
    ) {
      return false;
    }

    // Disallow IPv4 private ranges
    // 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16 (link local / AWS metadata)
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = hostname.match(ipv4Regex);
    if (match) {
      const octet1 = parseInt(match[1], 10);
      const octet2 = parseInt(match[2], 10);

      if (octet1 === 10) return false;
      if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
      if (octet1 === 192 && octet2 === 168) return false;
      if (octet1 === 169 && octet2 === 254) return false;
      if (octet1 === 127) return false;
      if (octet1 === 0) return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace('www.', '');

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/')[2];
      }
      if (parsed.pathname.startsWith('/v/')) {
        return parsed.pathname.split('/')[2];
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/')[2];
      }
    } else if (host === 'youtu.be') {
      return parsed.pathname.slice(1);
    }
  } catch {}
  return null;
}

export async function detectUrlSource(urlString: string): Promise<DetectedUrlInfo> {
  const cleanUrl = urlString.trim();

  if (!cleanUrl) {
    return {
      url: cleanUrl,
      sourceType: 'UNSUPPORTED',
      label: 'Invalid URL',
      valid: false,
      error: 'URL cannot be empty',
    };
  }

  if (!isSafeUrl(cleanUrl)) {
    return {
      url: cleanUrl,
      sourceType: 'UNSUPPORTED',
      label: 'Blocked URL',
      valid: false,
      error: 'URL violates security policy or points to private/internal network addresses.',
    };
  }

  // 1. Check YouTube
  const ytVideoId = extractYouTubeVideoId(cleanUrl);
  if (ytVideoId) {
    return {
      url: cleanUrl,
      sourceType: 'YOUTUBE',
      label: 'YouTube Video',
      valid: true,
      metadata: {
        videoId: ytVideoId,
        thumbnail: `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg`,
      },
    };
  }

  // 2. Check direct media file extensions
  const lowerUrl = cleanUrl.toLowerCase().split('?')[0];

  if (lowerUrl.endsWith('.mp3') || lowerUrl.endsWith('.wav') || lowerUrl.endsWith('.m4a') || lowerUrl.endsWith('.aac') || lowerUrl.endsWith('.ogg')) {
    return {
      url: cleanUrl,
      sourceType: 'DIRECT_AUDIO',
      label: 'Direct Audio Stream / File',
      valid: true,
      metadata: {
        mimeType: lowerUrl.endsWith('.mp3') ? 'audio/mp3' : lowerUrl.endsWith('.wav') ? 'audio/wav' : 'audio/m4a',
      },
    };
  }

  if (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.mov') || lowerUrl.endsWith('.mkv')) {
    return {
      url: cleanUrl,
      sourceType: 'DIRECT_VIDEO',
      label: 'Direct Video Stream / File',
      valid: true,
      metadata: {
        mimeType: lowerUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4',
      },
    };
  }

  if (lowerUrl.endsWith('.pdf')) {
    return {
      url: cleanUrl,
      sourceType: 'PDF',
      label: 'Online PDF Document',
      valid: true,
      metadata: {
        mimeType: 'application/pdf',
      },
    };
  }

  // 3. Inspect URL content-type via HEAD or light GET to detect RSS podcast vs Web Article
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(cleanUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ContentIntelligence/2.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/rss+xml,*/*;q=0.8',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const contentType = response.headers.get('content-type')?.toLowerCase() || '';

    // Check if XML / RSS Feed
    if (
      contentType.includes('xml') ||
      contentType.includes('rss') ||
      lowerUrl.endsWith('.rss') ||
      lowerUrl.endsWith('.xml') ||
      lowerUrl.includes('/feed') ||
      lowerUrl.includes('/podcast')
    ) {
      const textSample = await response.text();
      if (textSample.includes('<rss') || textSample.includes('<channel') || textSample.includes('<enclosure')) {
        return {
          url: cleanUrl,
          sourceType: 'PODCAST',
          label: 'Podcast RSS Feed',
          valid: true,
          metadata: {
            mimeType: 'application/rss+xml',
          },
        };
      }
    }

    if (contentType.includes('audio/')) {
      return {
        url: cleanUrl,
        sourceType: 'DIRECT_AUDIO',
        label: 'Direct Audio Stream',
        valid: true,
        metadata: { mimeType: contentType },
      };
    }

    if (contentType.includes('video/')) {
      return {
        url: cleanUrl,
        sourceType: 'DIRECT_VIDEO',
        label: 'Direct Video Stream',
        valid: true,
        metadata: { mimeType: contentType },
      };
    }

    // Default to web page / article
    return {
      url: cleanUrl,
      sourceType: 'WEBPAGE',
      label: 'Web Page / Article',
      valid: true,
      metadata: {
        mimeType: 'text/html',
      },
    };
  } catch (err: unknown) {
    return {
      url: cleanUrl,
      sourceType: 'WEBPAGE',
      label: 'Web Page / Article',
      valid: true,
      metadata: { mimeType: 'text/html' },
    };
  }
}
