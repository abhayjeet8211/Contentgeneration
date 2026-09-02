import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';

export interface ExtractedSlide {
  slideNumber: number;
  title: string;
  body: string;
  bulletPoints: string[];
  notes?: string;
  layout?: string;
}

export interface ParsedPresentation {
  title: string;
  slideCount: number;
  slides: ExtractedSlide[];
  fullText: string;
}

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  trimValues: true,
});

function extractTextFromXml(obj: any): string[] {
  const texts: string[] = [];

  function traverse(node: any) {
    if (!node) return;
    if (typeof node === 'string') {
      if (node.trim()) texts.push(node.trim());
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(traverse);
      return;
    }
    if (typeof node === 'object') {
      // PPTX text nodes are typically inside <a:t>
      if (node['a:t']) {
        const val = node['a:t'];
        if (typeof val === 'string' && val.trim()) {
          texts.push(val.trim());
        } else if (typeof val === 'object' && val['#text']) {
          texts.push(val['#text'].trim());
        }
      }
      for (const key of Object.keys(node)) {
        if (key !== 'a:t') {
          traverse(node[key]);
        }
      }
    }
  }

  traverse(obj);
  return texts;
}

export async function parsePptxBuffer(buffer: Buffer, fileName: string): Promise<ParsedPresentation> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const slides: ExtractedSlide[] = [];

    // Find all slide XML files e.g. ppt/slides/slide1.xml, slide2.xml
    const slideFiles = Object.keys(zip.files).filter((path) =>
      path.match(/^ppt\/slides\/slide\d+\.xml$/i)
    );

    // Sort slide files numerically by slide index
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)![0], 10);
      const numB = parseInt(b.match(/\d+/)![0], 10);
      return numA - numB;
    });

    for (let i = 0; i < slideFiles.length; i++) {
      const filePath = slideFiles[i];
      const slideXmlContent = await zip.files[filePath].async('string');
      const parsedXml = xmlParser.parse(slideXmlContent);

      const textParts = extractTextFromXml(parsedXml);

      let title = `Slide ${i + 1}`;
      const bulletPoints: string[] = [];
      let bodyText = '';

      if (textParts.length > 0) {
        title = textParts[0];
        const remaining = textParts.slice(1);
        bulletPoints.push(...remaining);
        bodyText = remaining.join('\n');
      }

      // Check if there are corresponding notes e.g. ppt/notesSlides/notesSlide1.xml
      let notes = '';
      const notesPath = `ppt/notesSlides/notesSlide${i + 1}.xml`;
      if (zip.files[notesPath]) {
        try {
          const notesXml = await zip.files[notesPath].async('string');
          const parsedNotes = xmlParser.parse(notesXml);
          const notesTexts = extractTextFromXml(parsedNotes);
          notes = notesTexts.join(' ');
        } catch {}
      }

      slides.push({
        slideNumber: i + 1,
        title,
        body: bodyText,
        bulletPoints,
        notes: notes || undefined,
        layout: i === 0 ? 'TITLE_SLIDE' : 'BULLETS_SLIDE',
      });
    }

    const fullText = slides
      .map((s) => `[Slide ${s.slideNumber}: ${s.title}]\n${s.bulletPoints.map((b) => `• ${b}`).join('\n')}${s.notes ? `\nSpeaker Notes: ${s.notes}` : ''}`)
      .join('\n\n');

    return {
      title: slides[0]?.title || fileName.replace(/\.[^/.]+$/, ''),
      slideCount: slides.length,
      slides,
      fullText: fullText || 'Extracted Presentation Slides',
    };
  } catch (err) {
    console.error('PPTX parse error:', err);
    // Graceful fallback
    const raw = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      title: fileName.replace(/\.[^/.]+$/, ''),
      slideCount: 1,
      slides: [
        {
          slideNumber: 1,
          title: fileName.replace(/\.[^/.]+$/, ''),
          body: raw.slice(0, 1000),
          bulletPoints: [raw.slice(0, 300)],
        },
      ],
      fullText: raw.slice(0, 5000),
    };
  }
}
