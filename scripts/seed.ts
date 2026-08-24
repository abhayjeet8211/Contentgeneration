import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data into database...');

  // Create demo user
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  const demoUser = await prisma.user.upsert({
    where: { email: 'architect@content-intel.app' },
    update: {},
    create: {
      email: 'architect@content-intel.app',
      passwordHash,
      name: 'Senior Architect',
    },
  });

  // Create sample project
  const project = await prisma.project.create({
    data: {
      title: 'Global Cyber Threat Intelligence & AI Advisory',
      description: 'Multi-platform content adaptation for executive advisories and security research.',
      userId: demoUser.id,
      category: 'Research Advisory',
    },
  });

  // Create sample source
  const source = await prisma.source.create({
    data: {
      title: 'Cyber Threat Advisory Q3 2026',
      sourceType: 'TEXT',
      rawContent: `AI Research & Operational Intelligence Advisory 2026:\nSpecialized generative AI workflows reduce content production cycles by 75% while maintaining 98%+ factual consistency across research papers and policy reports. Organizations deploying zero-trust identity verification mitigated 96% of intrusion attempts, saving $2.4M on average per incident.`,
      projectId: project.id,
    },
  });

  // Create analysis
  await prisma.contentAnalysis.create({
    data: {
      sourceId: source.id,
      summary: 'Specialized AI content operations reduce production cycle time by 75% while maintaining 98%+ factual accuracy across channels.',
      keyFacts: JSON.stringify([
        '75% reduction in production cycle time',
        '98%+ factual consistency across platforms',
        '96% of intrusion attempts mitigated with zero-trust verification',
        'Average cost savings of $2.4M per incident',
      ]),
      keyEntities: JSON.stringify(['Financial Services', 'Healthcare', 'Zero-Trust Framework']),
      topics: JSON.stringify(['Cybersecurity', 'AI Content Operations', 'Zero-Trust Architecture']),
      sentiment: 'Cautionary & Actionable',
      targetAudience: 'C-Suite Executives & Security Directors',
    },
  });

  // Create generation
  const generation = await prisma.generation.create({
    data: {
      title: 'Multi-Output: Cyber Threat Advisory Q3 2026',
      projectId: project.id,
      sourceId: source.id,
      status: 'COMPLETED',
    },
  });

  // Create generated content outputs
  const linkedIn = await prisma.generatedContent.create({
    data: {
      generationId: generation.id,
      format: 'LINKEDIN',
      platform: 'LinkedIn',
      title: '💡 Executive Summary: Cyber Threat & AI Content Shift',
      content: `💡 **The Content Operations Shift for C-Suite Leaders**\n\nManual writing workflows are fast becoming obsolete. Specialized AI content intelligence is changing how research reports turn into multi-channel narratives.\n\nKey takeaways from our latest benchmark:\n• **75% reduction** in production cycle time.\n• **98%+ factual consistency** maintained across platforms.\n• **Single-source intelligence** eliminates redundant research.\n\nHow is your executive team adapting content strategy this quarter? Share below! 👇\n\n#Leadership #ContentIntelligence #AI #Productivity`,
      tone: 'Authoritative',
      audience: 'Executives',
      captions: JSON.stringify(['Empowering teams with actionable intelligence.', '3 game-changing takeaways from our analysis.']),
      hashtags: JSON.stringify(['#LinkedInPost', '#ExecutiveSummary', '#ThoughtLeadership', '#Innovation']),
      validation: {
        create: {
          factScore: 98,
          formatComplianceScore: 99,
          toneAlignmentScore: 94,
          issues: JSON.stringify([{ type: 'SUCCESS', message: 'Factual consistency verified.' }]),
          claimsChecked: JSON.stringify(['75% reduction in production cycle time', '98%+ factual consistency']),
        },
      },
      versions: {
        create: {
          versionNumber: 1,
          body: 'Initial AI Generation',
          changeSummary: 'Original Output',
        },
      },
    },
  });

  // Create sample video project
  await prisma.videoProject.create({
    data: {
      projectId: project.id,
      title: '60s Short-Form Video: AI Threat Intelligence Breakdown',
      width: 1080,
      height: 1920,
      fps: 30,
      duration: 13.0,
      scenes: {
        create: [
          {
            orderIndex: 0,
            duration: 4.0,
            textOverlay: '🚀 75% Faster Content Operations',
            visualType: 'GRADIENT',
            captionData: 'Stop spending 10 hours writing for 5 platforms manually!',
            transition: 'FADE',
          },
          {
            orderIndex: 1,
            duration: 5.0,
            textOverlay: '⚡ Fact #1: 98% Fact Consistency',
            visualType: 'GRADIENT',
            captionData: 'One research source auto-generates all channel narratives.',
            transition: 'SLIDE',
          },
          {
            orderIndex: 2,
            duration: 4.0,
            textOverlay: '🎯 Try OmniContent AI Today',
            visualType: 'GRADIENT',
            captionData: 'Subscribe & follow for daily content intelligence tips.',
            transition: 'FADE',
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
