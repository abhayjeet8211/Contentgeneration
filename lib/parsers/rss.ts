import { XMLParser } from 'fast-xml-parser';
import { RedirectValidator } from '@/lib/security';

export interface PodcastEpisode {
  guid?: string;
  title: string;
  description: string;
  audioUrl: string;
  duration?: string;
  pubDate?: string;
  episodeNumber?: number;
  seasonNumber?: number;
  author?: string;
  transcriptUrl?: string;
}

export interface ParsedPodcastFeed {
  title: string;
  description: string;
  author?: string;
  imageUrl?: string;
  episodes: PodcastEpisode[];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
});

export async function parsePodcastFeed(feedXmlOrUrl: string): Promise<ParsedPodcastFeed> {
  let xmlString = feedXmlOrUrl;

  if (feedXmlOrUrl.startsWith('http://') || feedXmlOrUrl.startsWith('https://')) {
    const safeRes = await RedirectValidator.safeFetch(feedXmlOrUrl, {
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      timeoutMs: 10000,
    });
    if (!safeRes.ok) {
      throw new Error(`Failed to fetch podcast RSS feed safely: ${safeRes.findings[0]?.message || `HTTP ${safeRes.status}`}`);
    }
    xmlString = safeRes.buffer.toString('utf-8');
  }

  const parsed = parser.parse(xmlString);
  const channel = parsed.rss?.channel || parsed.feed || {};

  const podcastTitle = channel.title || 'Untitled Podcast';
  const podcastDescription = channel.description || '';
  const author = channel['itunes:author'] || channel['dc:creator'] || channel.author || '';
  const imageUrl = channel['itunes:image']?.['@_href'] || channel.image?.url || '';

  const rawItems = channel.item || channel.entry || [];
  const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];

  const episodes: PodcastEpisode[] = [];

  for (const item of itemsArray) {
    if (!item) continue;

    // Find audio enclosure
    let audioUrl = '';
    const enclosure = item.enclosure;
    if (enclosure) {
      if (typeof enclosure === 'object' && enclosure['@_url']) {
        audioUrl = enclosure['@_url'];
      }
    }

    // Check media:content if enclosure is not present
    if (!audioUrl && item['media:content']) {
      const media = item['media:content'];
      if (typeof media === 'object' && media['@_url']) {
        audioUrl = media['@_url'];
      }
    }

    // Check itunes:transcript or alternate link
    let transcriptUrl: string | undefined;
    if (item['podcast:transcript'] && item['podcast:transcript']['@_url']) {
      transcriptUrl = item['podcast:transcript']['@_url'];
    }

    const title = item.title || 'Untitled Episode';
    const description = (item.description || item['itunes:summary'] || item['content:encoded'] || '').replace(/<[^>]*>?/gm, ' ').trim();
    const duration = item['itunes:duration'] ? String(item['itunes:duration']) : undefined;
    const pubDate = item.pubDate ? String(item.pubDate) : undefined;
    const episodeNumber = item['itunes:episode'] ? parseInt(item['itunes:episode'], 10) : undefined;

    if (title || audioUrl) {
      episodes.push({
        guid: item.guid?.['#text'] || item.guid || audioUrl,
        title: typeof title === 'string' ? title : String(title['#text'] || 'Episode'),
        description: description.slice(0, 1500),
        audioUrl: audioUrl || '',
        duration,
        pubDate,
        episodeNumber,
        author: item['itunes:author'] || author,
        transcriptUrl,
      });
    }
  }

  return {
    title: typeof podcastTitle === 'string' ? podcastTitle : 'Podcast Show',
    description: typeof podcastDescription === 'string' ? podcastDescription.replace(/<[^>]*>?/gm, ' ').trim() : '',
    author: typeof author === 'string' ? author : undefined,
    imageUrl: typeof imageUrl === 'string' ? imageUrl : undefined,
    episodes,
  };
}
