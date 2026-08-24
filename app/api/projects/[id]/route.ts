import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        sources: {
          include: { analysis: true },
          orderBy: { createdAt: 'desc' },
        },
        generations: {
          include: {
            generatedContents: {
              include: { validation: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        mediaAssets: true,
        videoProjects: {
          include: { scenes: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error('Project detail error:', err);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Project delete error:', err);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
