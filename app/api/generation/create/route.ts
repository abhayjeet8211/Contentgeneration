import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { runContentPipeline } from '@/lib/ai/pipeline';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const generationSchema = z.object({
  projectId: z.string().optional(),
  sourceTitle: z.string().min(1),
  sourceType: z.enum(['TEXT', 'FILE', 'PROMPT']),
  rawContent: z.string().min(10, 'Source content must be at least 10 characters'),
  formats: z.array(z.string()).min(1, 'Select at least one output format'),
  customFormatDescription: z.string().optional(),
  tone: z.string().default('Professional'),
  audience: z.string().default('General Audience'),
  language: z.string().default('English'),
  purpose: z.string().default('Informative'),
  length: z.string().default('Medium'),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    // Allow guest demo execution if no user logged in by generating under demo system user or requiring auth
    let userId = user?.id;

    if (!userId) {
      // Find or create demo user for unauthenticated browser sessions
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
    const data = generationSchema.parse(body);

    const result = await runContentPipeline({
      userId,
      projectId: data.projectId,
      sourceTitle: data.sourceTitle,
      sourceType: data.sourceType,
      rawContent: data.rawContent,
      config: {
        formats: data.formats,
        customFormatDescription: data.customFormatDescription,
        tone: data.tone,
        audience: data.audience,
        language: data.language,
        purpose: data.purpose,
        length: data.length,
      },
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    console.error('Generation pipeline error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation pipeline failed' },
      { status: 500 }
    );
  }
}
