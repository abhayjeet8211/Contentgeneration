import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const content = await prisma.generatedContent.findUnique({
      where: { id: params.id },
      include: {
        validation: true,
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
        generation: {
          include: {
            source: {
              include: {
                analysis: true,
              },
            },
            project: true,
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (err) {
    console.error('Error fetching content:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, content: newContent, changeSummary } = body;

    const existing = await prisma.generatedContent.findUnique({
      where: { id: params.id },
      include: { versions: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const nextVersionNumber = (existing.versions.length || 0) + 1;

    const updated = await prisma.generatedContent.update({
      where: { id: params.id },
      data: {
        title: title || existing.title,
        content: newContent || existing.content,
        versions: newContent
          ? {
              create: {
                versionNumber: nextVersionNumber,
                body: newContent,
                changeSummary: changeSummary || `Manual Edit (v${nextVersionNumber})`,
              },
            }
          : undefined,
      },
      include: {
        validation: true,
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating content:', err);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
