import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { contentVersionService } from '@/lib/provenance';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const content = await prisma.generatedContent.findUnique({
      where: { id: params.id },
      include: {
        validation: true,
        fingerprint: true,
        provenanceRecords: {
          orderBy: { createdAt: 'asc' },
        },
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
      include: {
        versions: true,
        generation: true,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    // If new content is provided, create a version and record provenance chain
    if (newContent && newContent !== existing.content) {
      await contentVersionService.createNewVersion({
        contentId: params.id,
        projectId: existing.generation.projectId,
        contentType: existing.format,
        newBody: newContent,
        changeSummary: changeSummary || 'Manual Edit',
        creatorType: 'user',
      });
    }

    const updated = await prisma.generatedContent.update({
      where: { id: params.id },
      data: {
        title: title || existing.title,
        content: newContent || existing.content,
      },
      include: {
        validation: true,
        fingerprint: true,
        provenanceRecords: { orderBy: { createdAt: 'asc' } },
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Error updating content:', err);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

