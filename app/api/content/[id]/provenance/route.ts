import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const content = await prisma.generatedContent.findUnique({
      where: { id: params.id },
      include: {
        fingerprint: true,
        provenanceRecords: {
          orderBy: { createdAt: 'asc' },
        },
        versions: {
          orderBy: { versionNumber: 'asc' },
          select: {
            id: true,
            versionNumber: true,
            fingerprint: true,
            parentFingerprint: true,
            simHash: true,
            changeSummary: true,
            createdAt: true,
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content asset not found' }, { status: 404 });
    }

    return NextResponse.json({
      contentId: content.id,
      title: content.title,
      format: content.format,
      currentFingerprint: content.fingerprint,
      provenanceRecords: content.provenanceRecords,
      versions: content.versions,
    });
  } catch (err) {
    console.error('Error fetching provenance details:', err);
    return NextResponse.json({ error: 'Failed to retrieve provenance details' }, { status: 500 });
  }
}
