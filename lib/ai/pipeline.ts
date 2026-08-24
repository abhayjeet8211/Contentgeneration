import { prisma } from '@/lib/db/prisma';
import { getAIProvider } from './index';
import { GenerationConfig } from './provider';

export interface ExecutePipelineParams {
  userId: string;
  projectId?: string;
  sourceTitle: string;
  sourceType: 'TEXT' | 'FILE' | 'PROMPT';
  rawContent: string;
  config: GenerationConfig;
}

export async function runContentPipeline(params: ExecutePipelineParams) {
  const aiProvider = getAIProvider();

  // 1. Ensure project exists or create default
  let projectId = params.projectId;
  if (!projectId) {
    const project = await prisma.project.create({
      data: {
        title: `${params.sourceTitle.slice(0, 30)} - Workspace`,
        description: 'Auto-created content workspace',
        userId: params.userId,
      },
    });
    projectId = project.id;
  }

  // 2. Save source document
  const source = await prisma.source.create({
    data: {
      title: params.sourceTitle,
      sourceType: params.sourceType,
      rawContent: params.rawContent,
      projectId,
      metadata: JSON.stringify({ characterCount: params.rawContent.length }),
    },
  });

  // 3. Step 1 & 2: Perform Content Intelligence analysis (Facts, Summary, Entities, Topics)
  const intelligence = await aiProvider.analyzeSource(params.rawContent);

  const analysis = await prisma.contentAnalysis.create({
    data: {
      sourceId: source.id,
      summary: intelligence.summary,
      keyFacts: JSON.stringify(intelligence.keyFacts),
      keyEntities: JSON.stringify(intelligence.keyEntities),
      topics: JSON.stringify(intelligence.topics),
      sentiment: intelligence.sentiment,
      targetAudience: intelligence.targetAudience,
    },
  });

  // 4. Step 3: Multi-output Generation
  const rawOutputs = await aiProvider.generateOutputs(intelligence, params.rawContent, params.config);

  // Create main Generation record
  const generation = await prisma.generation.create({
    data: {
      title: `Multi-Output: ${params.sourceTitle}`,
      projectId,
      sourceId: source.id,
      status: 'COMPLETED',
      metadata: JSON.stringify(params.config),
    },
  });

  const createdOutputs = [];

  // 5. Step 4: Validate each output and save to DB
  for (const item of rawOutputs) {
    const validation = await aiProvider.validateContent(item.content, intelligence, item.format);
    const captionsHashtags = await aiProvider.generateCaptionsHashtags(item.content, item.platform);

    const generatedContent = await prisma.generatedContent.create({
      data: {
        generationId: generation.id,
        format: item.format,
        platform: item.platform,
        title: item.title,
        content: item.content,
        tone: item.tone,
        audience: item.audience,
        captions: JSON.stringify(item.captions || captionsHashtags.captions),
        hashtags: JSON.stringify(item.hashtags || captionsHashtags.hashtags),
        versions: {
          create: {
            versionNumber: 1,
            body: item.content,
            changeSummary: 'Initial AI Generation',
          },
        },
        validation: {
          create: {
            factScore: validation.factScore,
            formatComplianceScore: validation.formatComplianceScore,
            toneAlignmentScore: validation.toneAlignmentScore,
            issues: JSON.stringify(validation.issues),
            claimsChecked: JSON.stringify(validation.claimsChecked),
          },
        },
      },
      include: {
        validation: true,
        versions: true,
      },
    });

    createdOutputs.push(generatedContent);
  }

  return {
    projectId,
    sourceId: source.id,
    analysis,
    generationId: generation.id,
    outputs: createdOutputs,
    providerName: aiProvider.name,
  };
}
