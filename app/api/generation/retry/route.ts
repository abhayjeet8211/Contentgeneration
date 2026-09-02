import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAIProvider } from '@/lib/ai';
import { ContentIntelligence, GenerationConfig } from '@/lib/ai/provider';
import { z } from 'zod';

const retrySchema = z.object({
  contentId: z.string(),
  format: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contentId, format } = retrySchema.parse(body);

    const targetContent = await prisma.generatedContent.findUnique({
      where: { id: contentId },
      include: {
        generation: {
          include: {
            source: {
              include: {
                contentIntelligence: true,
              },
            },
          },
        },
      },
    });

    if (!targetContent || !targetContent.generation?.source?.contentIntelligence) {
      return NextResponse.json({ error: 'Generated content or intelligence not found' }, { status: 404 });
    }

    const intelDb = targetContent.generation.source.contentIntelligence;
    const aiProvider = getAIProvider();

    // Reconstruct ContentIntelligence object from DB
    const intelligence: ContentIntelligence = {
      title: intelDb.title || 'Intelligence',
      summary: intelDb.summary,
      keyFacts: intelDb.keyFacts ? JSON.parse(intelDb.keyFacts) : [],
      keyEntities: intelDb.entities ? JSON.parse(intelDb.entities) : [],
      topics: intelDb.topics ? JSON.parse(intelDb.topics) : [],
      statistics: intelDb.statistics ? JSON.parse(intelDb.statistics) : [],
      quotations: intelDb.quotations ? JSON.parse(intelDb.quotations) : [],
      sentiment: intelDb.sentiment || 'Neutral',
      targetAudience: intelDb.targetAudience || 'General Audience',
    };

    const config: GenerationConfig = {
      formats: [format],
      tone: targetContent.tone || 'Professional',
      audience: targetContent.audience || 'General Audience',
      language: 'English',
      purpose: 'Informative',
      length: 'Medium',
    };

    const outputs = await aiProvider.generateOutputs(intelligence, intelDb.summary, config);
    const item = outputs[0];

    if (!item) {
      throw new Error('Failed to generate output format');
    }

    const validation = await aiProvider.validateContent(item.content, intelligence, item.format);
    const captionsHashtags = await aiProvider.generateCaptionsHashtags(item.content, item.platform);

    const updated = await prisma.generatedContent.update({
      where: { id: contentId },
      data: {
        title: item.title,
        content: item.content,
        packageData: item.packageData ? JSON.stringify(item.packageData) : null,
        captions: JSON.stringify(item.captions || captionsHashtags.captions),
        hashtags: JSON.stringify(item.hashtags || captionsHashtags.hashtags),
        versions: {
          create: {
            versionNumber: 2,
            body: item.content,
            changeSummary: 'Retry Generation',
          },
        },
        validation: {
          upsert: {
            create: {
              factScore: validation.factScore,
              formatComplianceScore: validation.formatComplianceScore,
              toneAlignmentScore: validation.toneAlignmentScore,
              issues: JSON.stringify(validation.issues),
              claimsChecked: JSON.stringify(validation.claimsChecked),
            },
            update: {
              factScore: validation.factScore,
              formatComplianceScore: validation.formatComplianceScore,
              toneAlignmentScore: validation.toneAlignmentScore,
              issues: JSON.stringify(validation.issues),
              claimsChecked: JSON.stringify(validation.claimsChecked),
            },
          },
        },
      },
      include: {
        validation: true,
        versions: true,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (err: unknown) {
    console.error('Retry generation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Retry failed' },
      { status: 500 }
    );
  }
}
