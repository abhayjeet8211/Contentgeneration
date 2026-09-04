import { NextResponse } from 'next/server';
import { parseDocumentBuffer } from '@/lib/parsers/document';
import { saveUploadedFile } from '@/lib/storage';
import { SecurityValidationService } from '@/lib/security';
import { getCurrentUser } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const projectId = (formData.get('projectId') as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const user = await getCurrentUser().catch(() => null);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Central Security Gateway Validation
    const securityResult = await SecurityValidationService.validateUploadedFile(
      buffer,
      file.name,
      file.type || 'application/octet-stream',
      {
        userId: user?.id,
        projectId,
      }
    );

    // If rejected, halt pipeline immediately and return structured error
    if (!securityResult.accepted) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SECURITY_VALIDATION_FAILED',
            message: securityResult.userMessage || 'The uploaded file failed security validation.',
            findings: securityResult.scanResult.findings.map((f) => ({
              code: f.code,
              severity: f.severity,
              message: f.message,
            })),
          },
        },
        { status: 400 }
      );
    }

    // 2. Save using sanitized filename & detected MIME type
    const safeFilename = securityResult.scanResult.sanitizedFilename;
    const safeMime = securityResult.scanResult.detectedMimeType;
    const stored = await saveUploadedFile(buffer, safeFilename, safeMime);

    // 3. Parse text and metadata
    const parsed = await parseDocumentBuffer(buffer, safeFilename, safeMime);

    return NextResponse.json({
      success: true,
      fileUrl: stored.url,
      fileName: safeFilename,
      originalFileName: file.name,
      fileSize: file.size,
      mimeType: safeMime,
      contentHash: securityResult.scanResult.contentHash,
      securityStatus: securityResult.scanResult.status,
      duplicateInfo: securityResult.duplicateInfo,
      parsed,
    });
  } catch (err: unknown) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
