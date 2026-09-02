import { NextResponse } from 'next/server';
import { parseDocumentBuffer } from '@/lib/parsers/document';
import { saveUploadedFile } from '@/lib/storage';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to local upload storage
    const stored = await saveUploadedFile(buffer, file.name, file.type || 'application/octet-stream');

    // Parse text and metadata
    const parsed = await parseDocumentBuffer(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      fileUrl: stored.url,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
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
