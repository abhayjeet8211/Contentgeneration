export interface KeyFactItem {
  fact: string;
  citation?: string;
  timestamp?: string;
  page?: number;
  slide?: number;
  confidence?: number;
}

export interface ClaimItem {
  claim: string;
  sourceRef?: string;
  verified: boolean;
}

export interface StatisticItem {
  statistic: string;
  metric: string;
  value: string;
  sourceRef?: string;
}

export interface QuotationItem {
  quote: string;
  speaker?: string;
  timestamp?: string;
}

export interface TimelineItem {
  timeOrDate: string;
  event: string;
}

export interface TranscriptSegmentItem {
  orderIndex: number;
  startTime: number;
  endTime: number;
  text: string;
  speaker?: string;
}

export interface TranscriptData {
  fullText: string;
  language?: string;
  duration?: number;
  segments: TranscriptSegmentItem[];
}

export interface VideoSceneItem {
  sceneNumber: number;
  startTime: number;
  endTime: number;
  visualDescription: string;
  onScreenText?: string;
  cameraFraming?: string;
  motion?: string;
  audioDescription?: string;
}

export interface SlideItem {
  slideNumber: number;
  title: string;
  content?: string;
  bulletPoints?: string[];
  speakerNotes?: string;
  layout?: string;
  visualPrompt?: string;
  sourceReferences?: string[];
}

export interface SourceReferenceItem {
  factOrClaim: string;
  sourceType: 'YOUTUBE_TIMESTAMP' | 'DOCUMENT_PAGE' | 'SLIDE_NUMBER' | 'WEB_SECTION' | 'AUDIO_TIMESTAMP';
  location: string;
  quote?: string;
  speaker?: string;
  confidence?: number;
}

export interface ContentIntelligence {
  title?: string;
  summary: string;
  keyFacts: string[] | KeyFactItem[];
  keyEntities?: string[];
  entities?: string[];
  topics: string[];
  claims?: ClaimItem[];
  dates?: Array<{ date: string; context: string }>;
  locations?: string[];
  organizations?: string[];
  statistics?: StatisticItem[];
  quotations?: QuotationItem[];
  importantStatements?: string[];
  timeline?: TimelineItem[];
  sentiment: string;
  targetAudience: string;
  confidence?: number;
  transcript?: TranscriptData;
  scenes?: VideoSceneItem[];
  extractedSlides?: SlideItem[];
  sourceReferences?: SourceReferenceItem[];
}

export interface GenerationConfig {
  formats: string[]; // LINKEDIN, TWITTER_THREAD, INSTAGRAM, BLOG, EXECUTIVE_SUMMARY, BRIEFING, EMAIL, VIDEO_SCRIPT, VIDEO, PRESENTATION, INFOGRAPHIC, CUSTOM
  customFormatDescription?: string;
  tone: string;
  audience: string;
  language: string;
  purpose: string;
  length: string;
}

export interface StoryboardScene {
  sceneNumber: number;
  startTime: number;
  endTime: number;
  duration: number;
  narration: string;
  visual: string;
  onScreenText?: string;
  cameraFraming?: string;
  transition?: string;
  audio?: string;
  subject?: string;
  environment?: string;
}

export interface SubtitleItem {
  start: number;
  end: number;
  text: string;
}

export interface VideoContentPackage {
  concept: {
    title: string;
    hook: string;
    targetAudience: string;
    objective: string;
    recommendedDuration: string;
    tone: string;
    format: string;
  };
  script: {
    hook: string;
    introduction: string;
    mainSections: Array<{ heading: string; body: string; visualCue?: string }>;
    conclusion: string;
    callToAction: string;
    fullText: string;
  };
  storyboard: StoryboardScene[];
  sceneDescriptions: Array<{
    sceneNumber: number;
    subject: string;
    environment: string;
    composition: string;
    cameraRecommendation: string;
    motion: string;
    supportingGraphics: string;
  }>;
  narration: Array<{
    sceneNumber: number;
    text: string;
    timing: string;
    speakingStyle: string;
    tone: string;
  }>;
  subtitles: SubtitleItem[];
  visualRecommendations: Array<{
    type: 'STOCK_FOOTAGE' | 'CHART' | 'ICON' | 'ANIMATION' | 'SCREENSHOT' | 'AI_PROMPT' | 'DIAGRAM';
    description: string;
    sceneNumber?: number;
  }>;
  musicRecommendations: {
    style: string;
    energy: string;
    mood: string;
    transitions: string;
  };
}

export interface PresentationContentPackage {
  metadata: {
    title: string;
    subtitle: string;
    targetAudience: string;
    recommendedSlideCount: number;
    presentationObjective: string;
  };
  slides: Array<{
    slideNumber: number;
    title: string;
    mainContent: string;
    bulletPoints: string[];
    visualRecommendation: string;
    layoutRecommendation: string;
    sourceReferences: string[];
    speakerNotes: string;
  }>;
  structure: string[];
}

export interface InfographicSectionItem {
  sectionTitle: string;
  sectionType: 'HEADLINE' | 'KEY_STAT' | 'MAIN_INSIGHT' | 'SUPPORTING_DATA' | 'COMPARISON' | 'CONCLUSION' | 'TIMELINE';
  content: string;
  stat?: { value: string; metric: string; sourceRef?: string };
  iconRecommendation?: string;
  visualRecommendation?: string;
}

export interface InfographicContentPackage {
  mainMessage: {
    headline: string;
    subheadline: string;
    coreTakeaway: string;
  };
  keyMessages: string[];
  statistics: Array<{
    metric: string;
    value: string;
    label: string;
    sourceRef: string;
  }>;
  sections: InfographicSectionItem[];
  layoutRecommendations: {
    orientation: 'VERTICAL' | 'HORIZONTAL' | 'GRID';
    sectionHierarchy: string;
    visualWeight: string;
    textPlacement: string;
    chartPlacement: string;
    iconPlacement: string;
  };
  visualRecommendations: {
    icons: string[];
    charts: string[];
    diagrams: string[];
    colorPalette: string[];
    illustrations: string[];
  };
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
  packageData?: VideoContentPackage | PresentationContentPackage | InfographicContentPackage | any;
}

export interface ValidationReport {
  factScore: number;
  formatComplianceScore: number;
  toneAlignmentScore: number;
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
  analyzeSource(rawContent: string, options?: { sourceType?: string; title?: string }): Promise<ContentIntelligence>;
  analyzeYouTube(youtubeUrl: string): Promise<ContentIntelligence>;
  analyzeAudio(audioBuffer: Buffer, mimeType: string, fileName?: string): Promise<ContentIntelligence>;
  analyzeVideo(videoBuffer: Buffer, mimeType: string, fileName?: string): Promise<ContentIntelligence>;
  generateOutputs(
    intelligence: ContentIntelligence,
    rawContent: string,
    config: GenerationConfig
  ): Promise<GeneratedOutputItem[]>;
  generateVideoPackage(intelligence: ContentIntelligence, config: GenerationConfig): Promise<VideoContentPackage>;
  generatePresentationPackage(intelligence: ContentIntelligence, config: GenerationConfig): Promise<PresentationContentPackage>;
  generateInfographicPackage(intelligence: ContentIntelligence, config: GenerationConfig): Promise<InfographicContentPackage>;
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
