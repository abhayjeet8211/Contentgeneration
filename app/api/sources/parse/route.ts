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

    // Save locally
    const storedFile = await saveUploadedFile(buffer, file.name, file.type);

    // Extract text content
    const parsed = await parseDocumentBuffer(buffer, file.name, file.type);

    return NextResponse.json({
      parsed,
      fileUrl: storedFile.url,
    });
  } catch (err: unknown) {
    console.error('File parsing route error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'File parsing failed' },
      { status: 500 }
    );
  }
}
