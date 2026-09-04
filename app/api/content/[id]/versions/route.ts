import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const versions = await prisma.contentVersion.findMany({
      where: { contentId: params.id },
      orderBy: { versionNumber: 'desc' },
      select: {
        id: true,
        versionNumber: true,
        body: true,
        changeSummary: true,
        fingerprint: true,
        parentFingerprint: true,
        simHash: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      contentId: params.id,
      totalVersions: versions.length,
      versions,
    });
  } catch (err) {
    console.error('Error fetching version history:', err);
    return NextResponse.json({ error: 'Failed to retrieve version history' }, { status: 500 });
  }
}
