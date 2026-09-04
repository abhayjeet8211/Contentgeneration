import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getAIProvider } from '@/lib/ai';
import { contentVersionService } from '@/lib/provenance';
import { z } from 'zod';

const rewriteSchema = z.object({
  action: z.enum([
    'CHANGE_TONE',
    'SHORTEN',
    'EXPAND',
    'SIMPLIFY',
    'PROFESSIONALIZE',
    'MAKE_ENGAGING',
    'REGENERATE_SECTION',
  ]),
  targetTone: z.string().optional(),
  targetLength: z.string().optional(),
  customPrompt: z.string().optional(),
  selectedText: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { action, targetTone, targetLength, customPrompt, selectedText } = rewriteSchema.parse(body);

    const contentRecord = await prisma.generatedContent.findUnique({
      where: { id: params.id },
      include: {
        generation: {
          include: {
            source: {
              include: { analysis: true },
            },
          },
        },
      },
    });

    if (!contentRecord) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    const aiProvider = getAIProvider();
    const textToProcess = selectedText || contentRecord.content;

    const rewritten = await aiProvider.rewriteContent({
      content: textToProcess,
      action,
      targetTone,
      targetLength,
      customPrompt,
    });

    const finalContent = selectedText
      ? contentRecord.content.replace(selectedText, rewritten)
      : rewritten;

    // Create a new version with provenance chain
    await contentVersionService.createNewVersion({
      contentId: params.id,
      projectId: contentRecord.generation.projectId,
      contentType: contentRecord.format,
      newBody: finalContent,
      changeSummary: `AI Rewrite: ${action} ${targetTone ? `(${targetTone})` : ''}`,
      creatorType: 'ai',
    });

    const updated = await prisma.generatedContent.update({
      where: { id: params.id },
      data: {
        content: finalContent,
        tone: targetTone || contentRecord.tone,
      },
      include: {
        validation: true,
        fingerprint: true,
        provenanceRecords: { orderBy: { createdAt: 'asc' } },
        versions: { orderBy: { versionNumber: 'desc' } },
      },
    });

    // Re-run validation for updated content
    if (contentRecord.generation?.source?.analysis) {
      const intel = {
        summary: contentRecord.generation.source.analysis.summary,
        keyFacts: JSON.parse(contentRecord.generation.source.analysis.keyFacts || '[]'),
        keyEntities: JSON.parse(contentRecord.generation.source.analysis.keyEntities || '[]'),
        topics: JSON.parse(contentRecord.generation.source.analysis.topics || '[]'),
        sentiment: contentRecord.generation.source.analysis.sentiment || 'Neutral',
        targetAudience: contentRecord.generation.source.analysis.targetAudience || 'General Audience',
      };
      const validationReport = await aiProvider.validateContent(finalContent, intel, contentRecord.format);

      await prisma.validationResult.upsert({
        where: { contentId: params.id },
        update: {
          factScore: validationReport.factScore,
          formatComplianceScore: validationReport.formatComplianceScore,
          toneAlignmentScore: validationReport.toneAlignmentScore,
          issues: JSON.stringify(validationReport.issues),
          claimsChecked: JSON.stringify(validationReport.claimsChecked),
        },
        create: {
          contentId: params.id,
          factScore: validationReport.factScore,
          formatComplianceScore: validationReport.formatComplianceScore,
          toneAlignmentScore: validationReport.toneAlignmentScore,
          issues: JSON.stringify(validationReport.issues),
          claimsChecked: JSON.stringify(validationReport.claimsChecked),
        },
      });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid parameters', details: err.errors }, { status: 400 });
    }
    console.error('Rewrite API error:', err);
    return NextResponse.json({ error: 'AI rewrite failed' }, { status: 500 });
  }
}
