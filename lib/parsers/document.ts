import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedDocument {
  text: string;
  metadata: {
    pageCount?: number;
    characterCount: number;
    wordCount: number;
    fileType: string;
    fileName: string;
  };
}

export async function parseDocumentBuffer(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ParsedDocument> {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

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
      // Fallback text extraction if pdf-parse encounters format quirks
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
