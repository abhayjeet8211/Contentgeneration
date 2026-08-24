import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const video = await prisma.videoProject.findUnique({
      where: { id: params.id },
      include: {
        scenes: { orderBy: { orderIndex: 'asc' } },
        project: true,
      },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video project not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (err) {
    console.error('Single video GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch video project' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, scenes, width, height } = body;

    // Transaction to update scenes safely
    if (scenes && Array.isArray(scenes)) {
      await prisma.$transaction(async (tx) => {
        // Remove old scenes
        await tx.videoScene.deleteMany({ where: { videoProjectId: params.id } });

        // Insert updated scenes
        for (let i = 0; i < scenes.length; i++) {
          const s = scenes[i];
          await tx.videoScene.create({
            data: {
              videoProjectId: params.id,
              orderIndex: i,
              duration: s.duration || 4.0,
              textOverlay: s.textOverlay || '',
              visualType: s.visualType || 'GRADIENT',
              visualUrl: s.visualUrl || null,
              audioUrl: s.audioUrl || null,
              captionData: s.captionData || '',
              transition: s.transition || 'FADE',
            },
          });
        }
      });
    }

    const totalDuration = scenes
      ? scenes.reduce((acc: number, sc: { duration?: number }) => acc + (sc.duration || 4.0), 0)
      : undefined;

    const updated = await prisma.videoProject.update({
      where: { id: params.id },
      data: {
        title: title || undefined,
        width: width || undefined,
        height: height || undefined,
        duration: totalDuration || undefined,
      },
      include: {
        scenes: { orderBy: { orderIndex: 'asc' } },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Video project update error:', err);
    return NextResponse.json({ error: 'Failed to update video project' }, { status: 500 });
  }
}
