export interface ContentIntelligence {
  summary: string;
  keyFacts: string[];
  keyEntities: string[];
  topics: string[];
  sentiment: string;
  targetAudience: string;
}

export interface GenerationConfig {
  formats: string[]; // LINKEDIN, TWITTER_THREAD, INSTAGRAM, BLOG, EXECUTIVE_SUMMARY, BRIEFING, EMAIL, VIDEO_SCRIPT, CUSTOM
  customFormatDescription?: string;
  tone: string; // Professional, Engaging, Authoritative, Casual, Persuasive, Academic
  audience: string; // Executives, General Public, Tech Enthusiasts, Marketers, Developers
  language: string; // English, Spanish, French, German, etc.
  purpose: string; // Informative, Promotional, Educational, Thought Leadership, Announcement
  length: string; // Short, Medium, Comprehensive
}

export interface GeneratedOutputItem {
  format: string;
  platform: string;
  title: string;
  content: string;
  captions?: string[];
  hashtags?: string[];
  tone: string;
  audience: string;
}

export interface ValidationReport {
  factScore: number; // 0-100
  formatComplianceScore: number; // 0-100
  toneAlignmentScore: number; // 0-100
  issues: {
    type: 'WARNING' | 'INFO' | 'SUCCESS';
    message: string;
  }[];
  claimsChecked: string[];
}

export interface RewriteParams {
  content: string;
  action: 'CHANGE_TONE' | 'SHORTEN' | 'EXPAND' | 'SIMPLIFY' | 'PROFESSIONALIZE' | 'MAKE_ENGAGING' | 'REGENERATE_SECTION';
  targetTone?: string;
  targetLength?: string;
  customPrompt?: string;
}

export interface AIProvider {
  name: string;
  analyzeSource(rawContent: string): Promise<ContentIntelligence>;
  generateOutputs(
    intelligence: ContentIntelligence,
    rawContent: string,
    config: GenerationConfig
  ): Promise<GeneratedOutputItem[]>;
  rewriteContent(params: RewriteParams): Promise<string>;
  validateContent(
    generatedContent: string,
    sourceIntelligence: ContentIntelligence,
    format: string
  ): Promise<ValidationReport>;
  generateCaptionsHashtags(
    content: string,
    platform: string
  ): Promise<{ captions: string[]; hashtags: string[] }>;
}
