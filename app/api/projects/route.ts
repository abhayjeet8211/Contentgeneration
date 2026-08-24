import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { z } from 'zod';

const createProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    const userId = user?.id;

    const projects = await prisma.project.findMany({
      where: userId ? { userId } : {},
      orderBy: { updatedAt: 'desc' },
      include: {
        sources: { select: { id: true, title: true, sourceType: true, createdAt: true } },
        generations: {
          include: {
            generatedContents: { select: { id: true, format: true, title: true, platform: true } },
          },
        },
        videoProjects: { select: { id: true, title: true, duration: true } },
      },
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error('Projects GET error:', err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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
    const data = createProjectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description || '',
        category: data.category || 'General',
        userId,
      },
    });

    return NextResponse.json(project);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: err.errors }, { status: 400 });
    }
    console.error('Projects POST error:', err);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
