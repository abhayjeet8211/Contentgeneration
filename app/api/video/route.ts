import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { z } from 'zod';

const createVideoSchema = z.object({
  projectId: z.string().optional(),
  title: z.string().min(1),
  scriptText: z.string().optional(),
});

export async function GET() {
  try {
    const videos = await prisma.videoProject.findMany({
      include: {
        scenes: { orderBy: { orderIndex: 'asc' } },
        project: { select: { id: true, title: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(videos);
  } catch (err) {
    console.error('Video projects GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch video projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    let userId = user?.id;

    if (!userId) {
      const demoUser = await prisma.user.upsert({
        where: { email: 'demo@content-intel.app' },
        update: {},
        create: {
          email: 'demo@content-intel.app',
          passwordHash: 'demo-hash',
          name: 'Demo Architect',
        },
      });
      userId = demoUser.id;
    }

    const body = await req.json();
    const data = createVideoSchema.parse(body);

    let projectId = data.projectId;
    if (!projectId) {
      const proj = await prisma.project.create({
        data: {
          title: `Video Workspace - ${data.title}`,
          userId,
        },
      });
      projectId = proj.id;
    }

    // Default scenes if generated from script or blank
    const initialScenes = [
      {
        orderIndex: 0,
        duration: 4.0,
        textOverlay: '🚀 Strategic Key Takeaway',
        visualType: 'GRADIENT',
        captionData: 'Stop missing out on critical industry shifts!',
        transition: 'FADE',
      },
      {
        orderIndex: 1,
        duration: 5.0,
        textOverlay: '⚡ Fact #1: Actionable Data',
        visualType: 'GRADIENT',
        captionData: 'Data-driven decision making creates 3x competitive edge.',
        transition: 'SLIDE',
      },
      {
        orderIndex: 2,
        duration: 4.0,
        textOverlay: '🎯 Call To Action',
        visualType: 'GRADIENT',
        captionData: 'Subscribe & follow for daily insights.',
        transition: 'FADE',
      },
    ];

    const videoProject = await prisma.videoProject.create({
      data: {
        projectId,
        title: data.title,
        width: 1080,
        height: 1920, // 9:16 vertical short format
        fps: 30,
        duration: 13.0,
        scenes: {
          create: initialScenes,
        },
      },
      include: {
        scenes: { orderBy: { orderIndex: 'asc' } },
      },
    });

    return NextResponse.json(videoProject);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid video params', details: err.errors }, { status: 400 });
    }
    console.error('Video project creation error:', err);
    return NextResponse.json({ error: 'Failed to create video project' }, { status: 500 });
  }
}
