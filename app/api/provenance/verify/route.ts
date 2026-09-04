import { NextResponse } from 'next/server';
import { contentVerificationService } from '@/lib/provenance';
import { z } from 'zod';

const verifySchema = z.object({
  content: z.union([z.string(), z.record(z.unknown())]),
  contentType: z.string().optional().default('text'),
  projectId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid verification request payload',
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const result = await contentVerificationService.verify({
      content: parsed.data.content,
      contentType: parsed.data.contentType,
      callerProjectId: parsed.data.projectId,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Provenance verification API error:', err);
    return NextResponse.json(
      {
        error: 'Verification analysis failed',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
