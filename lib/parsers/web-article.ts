import { isSafeUrl } from './url-detector';
import { RedirectValidator } from '@/lib/security';

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
  const safeRes = await RedirectValidator.safeFetch(url, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    timeoutMs: 10000,
  });

  if (!safeRes.ok) {
    throw new Error(`Failed to fetch web article safely: ${safeRes.findings[0]?.message || `HTTP ${safeRes.status}`}`);
  }

  const html = safeRes.buffer.toString('utf-8');

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
