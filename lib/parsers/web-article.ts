import { isSafeUrl } from './url-detector';

export interface ParsedWebArticle {
  title: string;
  author?: string;
  publicationDate?: string;
  leadParagraph?: string;
  content: string;
  wordCount: number;
  headings: string[];
}

export async function parseWebArticle(url: string): Promise<ParsedWebArticle> {
  if (!isSafeUrl(url)) {
    throw new Error('Blocked: URL target is not allowed under security policy.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!res.ok) {
    throw new Error(`Failed to fetch web article: HTTP ${res.status}`);
  }

  const html = await res.text();

  // Extract Title
  let title = '';
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Extract OpenGraph / Meta title if better
  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  if (ogTitleMatch) {
    title = ogTitleMatch[1].trim();
  }

  // Extract Author
  let author: string | undefined;
  const authorMatch = html.match(/<meta\s+name=["']author["']\s+content=["']([^"']+)["']/i);
  if (authorMatch) {
    author = authorMatch[1].trim();
  }

  // Remove scripts, styles, svg, header, nav, footer, aside, noscript
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
    .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, ' ')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ');

  // Extract headings
  const headings: string[] = [];
  const headingMatches = cleaned.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi);
  for (const m of headingMatches) {
    const text = m[1].replace(/<[^>]+>/g, ' ').trim();
    if (text && text.length > 3) {
      headings.push(text);
    }
  }

  // Extract paragraphs
  const paragraphs: string[] = [];
  const pMatches = cleaned.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const m of pMatches) {
    const pText = m[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();

    if (pText.length > 25 && !pText.toLowerCase().includes('copyright') && !pText.toLowerCase().includes('cookie policy')) {
      paragraphs.push(pText);
    }
  }

  const content = paragraphs.join('\n\n');
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    title: title || 'Web Article',
    author,
    leadParagraph: paragraphs[0],
    content: content || 'Could not extract clean text from web article.',
    wordCount,
    headings,
  };
}
