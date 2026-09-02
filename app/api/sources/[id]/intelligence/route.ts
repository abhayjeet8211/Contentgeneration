import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const intelligence = await prisma.contentIntelligence.findFirst({
      where: {
        OR: [
          { id: params.id },
          { sourceId: params.id },
        ],
      },
      include: {
        transcript: {
          include: {
            segments: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        videoAnalysis: {
          include: {
            scenes: {
              orderBy: { sceneNumber: 'asc' },
            },
          },
        },
        presentationAnalysis: {
          include: {
            slides: {
              orderBy: { slideNumber: 'asc' },
            },
          },
        },
        sourceReferences: true,
      },
    });

    if (!intelligence) {
      return NextResponse.json({ error: 'Content Intelligence not found' }, { status: 404 });
    }

    return NextResponse.json(intelligence);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch intelligence' },
      { status: 500 }
    );
  }
}
