import {
  AIProvider,
  ContentIntelligence,
  GenerationConfig,
  GeneratedOutputItem,
  ValidationReport,
  RewriteParams,
} from '../provider';

export class MockAIProvider implements AIProvider {
  name = 'Built-in Intelligent Engine (Mock Mode)';

  async analyzeSource(rawContent: string): Promise<ContentIntelligence> {
    const text = rawContent.trim();
    const words = text.split(/\s+/).filter(Boolean);
    const firstParagraph = text.split(/\n\n|\r\n\r\n/)[0] || text.slice(0, 300);

    // Extract potential key entities (capitalized words/phrases)
    const matches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const uniqueEntities = Array.from(new Set(matches)).slice(0, 6);

    const keyFacts = [
      `Source contains approximately ${words.length} words and key contextual metrics.`,
      `Core topic focuses on ${uniqueEntities.slice(0, 2).join(' & ') || 'strategic innovation'}.`,
      `Identified major key themes around ${firstParagraph.slice(0, 60)}...`,
      `Critical findings highlight actionable strategy and operational clarity.`,
    ];

    return {
      summary: `This source document provides comprehensive analysis on ${uniqueEntities.slice(0, 3).join(', ') || 'key industry developments'}. The primary message emphasizes structured execution, data-driven decisions, and impactful adaptation.`,
      keyFacts,
      keyEntities: uniqueEntities.length > 0 ? uniqueEntities : ['Executive Leadership', 'Core Operations', 'AI Architecture'],
      topics: ['Strategy & Innovation', 'Content Operations', 'Digital Transformation', 'Growth Metrics'],
      sentiment: text.toLowerCase().includes('urgent') || text.toLowerCase().includes('risk') ? 'Cautionary / Strategic' : 'Positive & Forward-Looking',
      targetAudience: 'Executives, Content Managers, and Strategic Leaders',
    };
  }

  async generateOutputs(
    intelligence: ContentIntelligence,
    rawContent: string,
    config: GenerationConfig
  ): Promise<GeneratedOutputItem[]> {
    const outputs: GeneratedOutputItem[] = [];

    for (const format of config.formats) {
      outputs.push(this.generateSingleFormat(format, intelligence, config));
    }

    return outputs;
  }

  private generateSingleFormat(
    format: string,
    intel: ContentIntelligence,
    config: GenerationConfig
  ): GeneratedOutputItem {
    const tone = config.tone || 'Professional';
    const audience = config.audience || 'General Industry Audience';

    switch (format) {
      case 'LINKEDIN':
        return {
          format: 'LINKEDIN',
          platform: 'LinkedIn',
          title: `🚀 Executive Takeaways: ${intel.keyEntities[0] || 'Strategic Breakthroughs'}`,
          content: `💡 **Key Insight for Leaders**\n\n${intel.summary}\n\nHere are 3 critical takeaways from the latest intelligence report:\n\n1️⃣ **Strategic Shift:** ${intel.keyFacts[0]}\n2️⃣ **Operational Impact:** ${intel.keyFacts[1]}\n3️⃣ **Future Outlook:** ${intel.keyFacts[2] || intel.keyFacts[0]}\n\nHow is your team adapting to this shift? Share your thoughts below! 👇\n\n#Leadership #Strategy #Innovation #ContentIntelligence`,
          captions: [
            'Empowering teams with actionable intelligence.',
            '3 game-changing takeaways from our latest analysis.',
            'Why strategic adaptability matters today more than ever.',
          ],
          hashtags: ['#LinkedInPost', '#ExecutiveSummary', '#ThoughtLeadership', '#Innovation'],
          tone,
          audience,
        };

      case 'TWITTER_THREAD':
        return {
          format: 'TWITTER_THREAD',
          platform: 'Twitter/X Thread',
          title: `🧵 Thread: 5 Essential Lessons on ${intel.topics[0] || 'Modern Strategy'}`,
          content: `1/5 🚀 We analyzed the latest findings on ${intel.keyEntities[0] || 'industry innovation'}. Here's what you need to know 🧵👇\n\n2/5 📌 **The Core Problem & Context:**\n${intel.summary.slice(0, 220)}...\n\n3/5 ⚡ **Fact #1:**\n${intel.keyFacts[0]}\n\n4/5 🔍 **Fact #2:**\n${intel.keyFacts[1]}\n\n5/5 🎯 **Actionable Conclusion:**\nAdapting fast beats waiting for perfection. If this thread was insightful, RT the first tweet and follow for more daily breakdowns! ♻️`,
          captions: [
            'Short thread breaking down key intelligence.',
            'Everything you need to know in under 2 minutes.',
          ],
          hashtags: ['#TwitterThread', '#Insights', '#TechTrends', '#Breakdown'],
          tone,
          audience,
        };

      case 'INSTAGRAM':
        return {
          format: 'INSTAGRAM',
          platform: 'Instagram',
          title: `✨ High-Impact Digest: ${intel.topics[0] || 'Future Trends'}`,
          content: `✨ **GAME CHANGER ALERT** ✨\n\n${intel.summary}\n\nSwipe to check out the top key facts you can't afford to ignore! 📲\n\nKey Highlights:\n🔹 ${intel.keyFacts[0]}\n🔹 ${intel.keyFacts[1]}\n\nTag a colleague who needs to see this! 👇\n\n.\n.\n.#InstagramCaption #ContentCreation #GrowthMindset #DailyInspiration`,
          captions: [
            'Transforming raw complexity into visual clarity. ✨',
            'Save this post for your next strategy session! 📌',
          ],
          hashtags: ['#InstagramCaption', '#ContentStrategy', '#VisualNotes', '#GrowthHacks'],
          tone,
          audience,
        };

      case 'BLOG':
        return {
          format: 'BLOG',
          platform: 'Blog Article',
          title: `The Complete Guide to ${intel.topics[0] || 'Strategic Content Operations'}`,
          content: `# The Complete Guide to ${intel.topics[0] || 'Strategic Content Operations'}\n\n*Target Audience: ${audience} | Tone: ${tone}*\n\n## Introduction\n\n${intel.summary}\n\nIn today's fast-moving environment, organizations must convert raw informational inputs into actionable multi-platform narratives seamlessly.\n\n---\n\n## Core Analytical Findings\n\n${intel.keyFacts.map((fact, idx) => `### Key Insight ${idx + 1}\n\n${fact}\n\nAnalyzing this aspect reveals why proactive positioning creates sustainable competitive advantage across channels.`).join('\n\n')}\n\n---\n\n## Key Entities & Stakeholders\n\n${intel.keyEntities.map((ent) => `- **${ent}:** Primary contributor to organizational strategy and rollout.`).join('\n')}\n\n---\n\n## Conclusion & Next Steps\n\nBy leveraging structured content intelligence, decision-makers achieve consistent messaging while lowering production friction.`,
          captions: ['Full deep-dive article available now.', 'Comprehensive strategic guide for modern teams.'],
          hashtags: ['#BlogArticle', '#DeepDive', '#ContentIntelligence', '#StrategyGuide'],
          tone,
          audience,
        };

      case 'EXECUTIVE_SUMMARY':
        return {
          format: 'EXECUTIVE_SUMMARY',
          platform: 'Executive Briefing',
          title: `EXECUTIVE BRIEFING: ${intel.keyEntities[0] || 'Strategic Overview'}`,
          content: `## EXECUTIVE BRIEFING REPORT\n\n**CONFIDENTIAL & ACTIONABLE**\n\n**Subject:** ${intel.summary.slice(0, 100)}\n**Target Audience:** ${audience}\n**Tone:** ${tone}\n\n### 1. Executive Summary\n${intel.summary}\n\n### 2. Key Metrics & Facts\n${intel.keyFacts.map((f) => `- ${f}`).join('\n')}\n\n### 3. Critical Stakeholders\n${intel.keyEntities.join(', ')}\n\n### 4. Strategic Recommendation\nProceed with structured multi-channel rollouts while maintaining factual audit trails.`,
          captions: ['Briefing memo for C-suite alignment.', 'Executive overview of source intelligence.'],
          hashtags: ['#ExecutiveBriefing', '#CorporateStrategy', '#DecisionMaking'],
          tone,
          audience,
        };

      case 'VIDEO_SCRIPT':
        return {
          format: 'VIDEO_SCRIPT',
          platform: 'Short-Form Video Script',
          title: `🎬 60-Second Video Script: ${intel.topics[0] || 'Industry Secrets'}`,
          content: `🎬 **VIDEO SCRIPT (Format: 9:16 Vertical / Short-Form)**\n\n**[00:00 - 00:05] HOOK (Visual: Dynamic Text Overlay)**\n*Speaker:* "Stop missing out on this game-changing industry shift!"\n\n**[00:05 - 00:20] CONTEXT (Visual: Rapid Scene Cut / Screen Capture)**\n*Speaker:* "${intel.summary.slice(0, 140)}..."\n\n**[00:20 - 00:45] KEY PROOF (Visual: Bullet points graphic)**\n*Speaker:* "Here are 2 facts you need to know right now. First: ${intel.keyFacts[0]}. Second: ${intel.keyFacts[1]}."\n\n**[00:45 - 00:60] CALL TO ACTION (Visual: On-screen subscribe button)**\n*Speaker:* "Drop a comment with your thoughts and hit follow for more updates!"`,
          captions: ['60-second viral script template.', 'Scene-by-scene script breakdown.'],
          hashtags: ['#ReelsScript', '#TikTokScript', '#Shorts', '#VideoContent'],
          tone,
          audience,
        };

      default:
        return {
          format: format || 'CUSTOM',
          platform: 'Custom Format',
          title: `Custom Output: ${intel.topics[0] || 'Content Synthesis'}`,
          content: `### Custom Synthesized Content\n\n**Summary:**\n${intel.summary}\n\n**Key Takeaways:**\n${intel.keyFacts.map((f) => `- ${f}`).join('\n')}\n\n**Audience Focus:** ${audience}`,
          captions: ['Custom synthesized format output.'],
          hashtags: ['#CustomFormat', '#ContentIntelligence'],
          tone,
          audience,
        };
    }
  }

  async rewriteContent(params: RewriteParams): Promise<string> {
    const text = params.content;
    switch (params.action) {
      case 'SHORTEN':
        return text.split('\n\n').slice(0, 2).join('\n\n') + '\n\n*(Condensed for clarity)*';
      case 'EXPAND':
        return (
          text +
          '\n\n**Additional Context:**\nFurther analysis emphasizes that structured adaptation preserves core narrative fidelity while broadening reach across diverse consumer touchpoints.'
        );
      case 'SIMPLIFY':
        return text
          .replace(/\b(implement|utilize|leverage|facilitate)\b/gi, 'use')
          .replace(/\b(consequently|subsequently)\b/gi, 'so');
      case 'PROFESSIONALIZE':
        return `**Executive Summary Note:**\n${text.replace(/guys|hey|check out/gi, 'valued stakeholders')}`;
      case 'MAKE_ENGAGING':
        return `🔥 **Must-Read Insight:**\n\n${text}\n\n👉 *What is your perspective on this strategic evolution?*`;
      case 'CHANGE_TONE':
        return `*[Tone updated to ${params.targetTone || 'Refined'}]*\n\n${text}`;
      default:
        return text;
    }
  }

  async validateContent(
    generatedContent: string,
    sourceIntelligence: ContentIntelligence,
    format: string
  ): Promise<ValidationReport> {
    return {
      factScore: 96,
      formatComplianceScore: 98,
      toneAlignmentScore: 94,
      issues: [
        { type: 'SUCCESS', message: 'Factual claims match source document facts 100%.' },
        { type: 'SUCCESS', message: `Format structure complies with standard ${format} guidelines.` },
        { type: 'INFO', message: 'Readability score ideal for target audience.' },
      ],
      claimsChecked: sourceIntelligence.keyFacts,
    };
  }

  async generateCaptionsHashtags(
    content: string,
    platform: string
  ): Promise<{ captions: string[]; hashtags: string[] }> {
    return {
      captions: [
        `Essential insights on ${platform}: ${content.slice(0, 90)}...`,
        'Check out these key takeaways and recommendations.',
        'Why strategic intelligence gives your team an edge.',
      ],
      hashtags: ['#ContentIntelligence', '#Growth', '#Strategy', '#Innovation', '#Tech2026'],
    };
  }
}
