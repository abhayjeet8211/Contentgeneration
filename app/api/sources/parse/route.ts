import { NextResponse } from 'next/server';
import { parseDocumentBuffer } from '@/lib/parsers/document';
import { saveUploadedFile } from '@/lib/storage';
import { SecurityValidationService } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Security validation gateway
    const securityResult = await SecurityValidationService.validateUploadedFile(
      buffer,
      file.name,
      file.type || 'application/octet-stream'
    );

    if (!securityResult.accepted) {
      return NextResponse.json(
        {
          success: false,
          error: securityResult.userMessage || 'Security validation failed.',
          findings: securityResult.scanResult.findings,
        },
        { status: 400 }
      );
    }

    const safeFilename = securityResult.scanResult.sanitizedFilename;
    const safeMime = securityResult.scanResult.detectedMimeType;

    // Save locally
    const storedFile = await saveUploadedFile(buffer, safeFilename, safeMime);

    // Extract text content
    const parsed = await parseDocumentBuffer(buffer, safeFilename, safeMime);
    return NextResponse.json({
      success: true,
      parsed,
      fileUrl: storedFile.url,
      contentHash: securityResult.scanResult.contentHash,
      securityStatus: securityResult.scanResult.status,
    });
  } catch (err: unknown) {
    console.error('File parsing route error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'File parsing failed' },
      { status: 500 }
    );
  }
}
