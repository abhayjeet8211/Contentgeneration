import { NextResponse } from 'next/server';
import { detectUrlSource } from '@/lib/parsers/url-detector';
import { parsePodcastFeed } from '@/lib/parsers/rss';
import { parseWebArticle } from '@/lib/parsers/web-article';
import { z } from 'zod';

const requestSchema = z.object({
  url: z.string().url('Please enter a valid URL (http/https)'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = requestSchema.parse(body);

    const detection = await detectUrlSource(url);

    if (!detection.valid) {
      return NextResponse.json({
        valid: false,
        error: detection.error || 'Unsupported or blocked URL target',
      }, { status: 400 });
    }

    // Enrich detection with RSS episode list if PODCAST
    if (detection.sourceType === 'PODCAST') {
      try {
        const feed = await parsePodcastFeed(url);
        detection.metadata = {
          ...detection.metadata,
          title: feed.title,
          channel: feed.author,
          thumbnail: feed.imageUrl,
          episodes: feed.episodes.map((ep) => ({
            title: ep.title,
            audioUrl: ep.audioUrl,
            duration: ep.duration,
            pubDate: ep.pubDate,
            description: ep.description.slice(0, 250),
          })),
        };
      } catch (err: unknown) {
        console.warn('Podcast feed preview fetch failed, continuing with basic URL:', err);
      }
    }

    // Enrich detection with web article title if WEBPAGE
    if (detection.sourceType === 'WEBPAGE') {
      try {
        const article = await parseWebArticle(url);
        detection.metadata = {
          ...detection.metadata,
          title: article.title,
          channel: article.author,
        };
      } catch (err) {
        console.warn('Web article preview fetch failed:', err);
      }
    }

    return NextResponse.json(detection);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0]?.message || 'Invalid URL' }, { status: 400 });
    }
    return NextResponse.json({ error: err instanceof Error ? err.message : 'URL detection failed' }, { status: 500 });
  }
}
