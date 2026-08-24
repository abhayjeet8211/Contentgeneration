import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getCurrentUser } from '@/lib/auth/session';
import { z } from 'zod';

const DEFAULT_TEMPLATES = [
  {
    name: 'LinkedIn Thought Leadership',
    category: 'LinkedIn',
    description: 'Transform key insights into a high-engagement LinkedIn post with hook, 3 key takeaways, and discussion CTA.',
    format: 'LINKEDIN',
    defaultTone: 'Authoritative',
    defaultAudience: 'Executives & Industry Leaders',
    templatePrompt: 'Extract top strategic findings and structure into a high-engagement LinkedIn post.',
    isSystem: true,
  },
  {
    name: 'Executive Briefing Memo',
    category: 'Professional',
    description: 'Structure source documents into a concise 1-page C-suite briefing memo with metrics and recommendations.',
    format: 'EXECUTIVE_SUMMARY',
    defaultTone: 'Professional',
    defaultAudience: 'C-Suite & Board Members',
    templatePrompt: 'Synthesize facts, key metrics, and strategic recommendations for executive review.',
    isSystem: true,
  },
  {
    name: 'Viral Twitter/X Thread',
    category: 'Social Media',
    description: 'Convert long-form research into a 5-tweet compelling storytelling thread.',
    format: 'TWITTER_THREAD',
    defaultTone: 'Engaging',
    defaultAudience: 'General Tech & Business Audience',
    templatePrompt: 'Break down complex research into digestible numbered tweets with punchy hooks.',
    isSystem: true,
  },
  {
    name: 'Short-Form Video Script',
    category: 'Video',
    description: '60-second vertical video script with visual hook, timestamps, speaker voiceover, and CTA.',
    format: 'VIDEO_SCRIPT',
    defaultTone: 'Dynamic',
    defaultAudience: 'Social Video Viewers',
    templatePrompt: 'Create a scene-by-scene script optimized for 9:16 vertical video platforms.',
    isSystem: true,
  },
  {
    name: 'Comprehensive Blog Deep-Dive',
    category: 'Marketing',
    description: 'Full SEO-ready structured article complete with H2/H3 headings, key facts, and conclusions.',
    format: 'BLOG',
    defaultTone: 'Informative',
    defaultAudience: 'Search & Industry Readers',
    templatePrompt: 'Generate a multi-section blog post covering background context, core data, and strategic takeaways.',
    isSystem: true,
  },
  {
    name: 'Instagram Visual Digest',
    category: 'Social Media',
    description: 'High-contrast bulleted caption draft with carousel text overlays and hashtag group.',
    format: 'INSTAGRAM',
    defaultTone: 'Creative & Energetic',
    defaultAudience: 'Visual Platform Followers',
    templatePrompt: 'Format insights for carousel slide text overlays and engagement-focused caption.',
    isSystem: true,
  },
];

const templateSchema = z.object({
  name: z.string().min(1),
  category: z.string().default('General'),
  description: z.string().min(1),
  format: z.string().default('CUSTOM'),
  defaultTone: z.string().default('Professional'),
  defaultAudience: z.string().default('General'),
  templatePrompt: z.string().min(1),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    let dbTemplates = await prisma.template.findMany({
      where: user ? { OR: [{ isSystem: true }, { userId: user.id }] } : { isSystem: true },
      orderBy: { createdAt: 'desc' },
    });

    // If system templates aren't seeded in DB yet, return the defaults
    if (dbTemplates.length === 0) {
      return NextResponse.json(DEFAULT_TEMPLATES);
    }

    return NextResponse.json(dbTemplates);
  } catch (err) {
    console.error('Templates GET error:', err);
    return NextResponse.json(DEFAULT_TEMPLATES);
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
    const data = templateSchema.parse(body);

    const template = await prisma.template.create({
      data: {
        name: data.name,
        category: data.category,
        description: data.description,
        format: data.format,
        defaultTone: data.defaultTone,
        defaultAudience: data.defaultAudience,
        templatePrompt: data.templatePrompt,
        isSystem: false,
        userId,
      },
    });

    return NextResponse.json(template);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: err.errors }, { status: 400 });
    }
    console.error('Template POST error:', err);
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 });
  }
}
