import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { parsePptxBuffer, ParsedPresentation } from './pptx';

export interface ParsedDocument {
  text: string;
  metadata: {
    pageCount?: number;
    slideCount?: number;
    characterCount: number;
    wordCount: number;
    fileType: string;
    fileName: string;
    presentationData?: ParsedPresentation;
  };
}

export async function parseDocumentBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ParsedDocument> {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // 1. PDF
  if (mimeType === 'application/pdf' || extension === 'pdf') {
    try {
      const data = await pdfParse(buffer);
      const cleanText = data.text.replace(/\r\n/g, '\n').trim();
      return {
        text: cleanText,
        metadata: {
          pageCount: data.numpages,
          characterCount: cleanText.length,
          wordCount: cleanText.split(/\s+/).filter(Boolean).length,
          fileType: 'PDF',
          fileName,
        },
      };
    } catch (err) {
      console.error('PDF parsing error:', err);
      const rawString = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ');
      return {
        text: rawString.trim() || 'Extracted PDF content.',
        metadata: {
          characterCount: rawString.length,
          wordCount: rawString.split(/\s+/).filter(Boolean).length,
          fileType: 'PDF',
          fileName,
        },
      };
    }
  }

  // 2. DOCX
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === 'docx'
  ) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      const cleanText = result.value.trim();
      return {
        text: cleanText,
        metadata: {
          characterCount: cleanText.length,
          wordCount: cleanText.split(/\s+/).filter(Boolean).length,
          fileType: 'DOCX',
          fileName,
        },
      };
    } catch (err) {
      console.error('DOCX parsing error:', err);
      throw new Error('Failed to parse DOCX document.');
    }
  }

  // 3. PPT / PPTX
  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    mimeType === 'application/vnd.ms-powerpoint' ||
    extension === 'pptx' ||
    extension === 'ppt'
  ) {
    try {
      const parsedPpt = await parsePptxBuffer(buffer, fileName);
      return {
        text: parsedPpt.fullText,
        metadata: {
          slideCount: parsedPpt.slideCount,
          characterCount: parsedPpt.fullText.length,
          wordCount: parsedPpt.fullText.split(/\s+/).filter(Boolean).length,
          fileType: 'PPTX',
          fileName,
          presentationData: parsedPpt,
        },
      };
    } catch (err) {
      console.error('PPTX parse error:', err);
      throw new Error('Failed to parse PPTX presentation.');
    }
  }

  // 4. Audio files (MP3, WAV, M4A, AAC, OGG)
  if (
    mimeType.startsWith('audio/') ||
    ['mp3', 'wav', 'm4a', 'aac', 'ogg', 'flac'].includes(extension)
  ) {
    return {
      text: `[Audio Media File: ${fileName}]`,
      metadata: {
        characterCount: 0,
        wordCount: 0,
        fileType: extension.toUpperCase() || 'AUDIO',
        fileName,
      },
    };
  }

  // 5. Video files (MP4, MOV, WEBM)
  if (
    mimeType.startsWith('video/') ||
    ['mp4', 'mov', 'webm', 'mkv', 'avi'].includes(extension)
  ) {
    return {
      text: `[Video Media File: ${fileName}]`,
      metadata: {
        characterCount: 0,
        wordCount: 0,
        fileType: extension.toUpperCase() || 'VIDEO',
        fileName,
      },
    };
  }

  // 6. Image files (JPG, PNG, WEBP)
  if (
    mimeType.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(extension)
  ) {
    return {
      text: `[Image File: ${fileName}]`,
      metadata: {
        characterCount: 0,
        wordCount: 0,
        fileType: extension.toUpperCase() || 'IMAGE',
        fileName,
      },
    };
  }

  // Fallback to plain text parsing (.txt, .md, .csv, etc)
  const text = buffer.toString('utf-8').trim();
  return {
    text,
    metadata: {
      characterCount: text.length,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      fileType: extension.toUpperCase() || 'TXT',
      fileName,
    },
  };
}
