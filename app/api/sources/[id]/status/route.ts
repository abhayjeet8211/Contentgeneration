import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const source = await prisma.source.findUnique({
      where: { id: params.id },
      include: {
        contentIntelligence: {
          include: {
            transcript: { include: { segments: true } },
            videoAnalysis: { include: { scenes: true } },
            presentationAnalysis: { include: { slides: true } },
            sourceReferences: true,
          },
        },
        generations: {
          include: {
            generatedContents: {
              include: { validation: true },
            },
          },
        },
      },
    });

    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: source.id,
      title: source.title,
      sourceType: source.sourceType,
      processingStatus: source.processingStatus,
      progressStep: source.progressStep,
      errorMessage: source.errorMessage,
      contentIntelligence: source.contentIntelligence,
      generations: source.generations,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch status' },
      { status: 500 }
    );
  }
}
