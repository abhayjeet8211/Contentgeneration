import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { runContentPipeline } from '@/lib/ai/pipeline';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const generationSchema = z.object({
  projectId: z.string().optional(),
  sourceTitle: z.string().min(1),
  sourceType: z.string().default('TEXT'),
  sourceUrl: z.string().optional(),
  mimeType: z.string().optional(),
  rawContent: z.string().min(1, 'Source content must not be empty'),
  extractedContent: z.string().optional(),
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
    const data = generationSchema.parse(body);

    const result = await runContentPipeline({
      userId,
      projectId: data.projectId,
      sourceTitle: data.sourceTitle,
      sourceType: data.sourceType,
      sourceUrl: data.sourceUrl,
      mimeType: data.mimeType,
      rawContent: data.rawContent,
      extractedContent: data.extractedContent,
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
