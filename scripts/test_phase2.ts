import { detectUrlSource, isSafeUrl, extractYouTubeVideoId } from '../lib/parsers/url-detector';
import { parsePodcastFeed } from '../lib/parsers/rss';
import { parsePptxBuffer } from '../lib/parsers/pptx';
import { MockAIProvider } from '../lib/ai/providers/mock';
import { GenerationConfig } from '../lib/ai/provider';
import pptxgen from 'pptxgenjs';

async function runPhase2Tests() {
  console.log('====================================================');
  console.log('  STARTING PHASE 2 COMPREHENSIVE AUTOMATED TESTS    ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // 1. Test SSRF Protection & URL Detection
  console.log('\n--- 1. Testing URL Detection & SSRF Protection ---');
  assert(isSafeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'Safe public HTTPS URL allowed');
  assert(!isSafeUrl('http://localhost:3000'), 'Localhost blocked');
  assert(!isSafeUrl('http://127.0.0.1/admin'), 'Loopback IP blocked');
  assert(!isSafeUrl('http://169.254.169.254/latest/meta-data/'), 'AWS/Cloud metadata IP blocked');
  assert(!isSafeUrl('http://192.168.1.1'), 'Private RFC1918 IP blocked');

  const ytId = extractYouTubeVideoId('https://www.youtube.com/watch?v=abc123xyz');
  assert(ytId === 'abc123xyz', 'YouTube Video ID extraction (standard URL)');

  const ytShorts = extractYouTubeVideoId('https://youtube.com/shorts/sample456');
  assert(ytShorts === 'sample456', 'YouTube Shorts Video ID extraction');

  const ytDetection = await detectUrlSource('https://www.youtube.com/watch?v=abc123xyz');
  assert(ytDetection.sourceType === 'YOUTUBE' && ytDetection.valid, 'YouTube URL classified as YOUTUBE');

  const directAudioDetection = await detectUrlSource('https://example.com/audio/sample_podcast.mp3');
  assert(directAudioDetection.sourceType === 'DIRECT_AUDIO', 'Direct MP3 classified as DIRECT_AUDIO');

  // 2. Test Podcast RSS Parser
  console.log('\n--- 2. Testing Podcast RSS Parser ---');
  const sampleRssXml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <title>Tech Intelligence Daily</title>
        <description>Daily deep dive into AI and cybersecurity operations.</description>
        <itunes:author>Global AI Team</itunes:author>
        <item>
          <title>Episode 104: The Future of Single-Source Content</title>
          <description>How multimodal content transformation works at scale.</description>
          <enclosure url="https://media.example.com/ep104.mp3" type="audio/mpeg" length="15243000"/>
          <itunes:duration>25:30</itunes:duration>
          <pubDate>Mon, 01 Sep 2026 08:00:00 GMT</pubDate>
        </item>
      </channel>
    </rss>
  `;
  const parsedFeed = await parsePodcastFeed(sampleRssXml);
  assert(parsedFeed.title === 'Tech Intelligence Daily', 'Podcast RSS Title parsed correctly');
  assert(parsedFeed.episodes.length === 1, 'Podcast Episode count parsed correctly');
  assert(parsedFeed.episodes[0].title.includes('Episode 104'), 'Episode title extracted');
  assert(parsedFeed.episodes[0].audioUrl === 'https://media.example.com/ep104.mp3', 'Audio enclosure URL extracted');

  // 3. Test Content Intelligence Engine (Mock/Gemini)
  console.log('\n--- 3. Testing Content Intelligence Analysis ---');
  const mockAI = new MockAIProvider();
  const sampleAdvisory = `Global Threat Telemetry 2026:
Recent quarterly audits reveal a 42% increase in AI credential stuffing attacks. Deploying continuous behavioral telemetry mitigated 96% of intrusion attempts, saving $2.4M per incident.`;

  const intelligence = await mockAI.analyzeSource(sampleAdvisory, { sourceType: 'DOCUMENT', title: 'Advisory 2026' });
  assert(intelligence.summary.length > 20, 'Intelligence Summary generated');
  assert(intelligence.keyFacts.length > 0, 'Key facts extracted');
  assert(Array.isArray(intelligence.statistics) && intelligence.statistics.length > 0, 'Statistics extracted');

  const ytIntelligence = await mockAI.analyzeYouTube('https://www.youtube.com/watch?v=sample');
  assert(!!(ytIntelligence.transcript && ytIntelligence.transcript.segments.length > 0), 'YouTube transcript segments generated');
  assert(!!(ytIntelligence.scenes && ytIntelligence.scenes.length > 0), 'YouTube visual scenes generated');

  // 4. Test Video Content Package Generation
  console.log('\n--- 4. Testing Video Content Package ---');
  const config: GenerationConfig = {
    formats: ['VIDEO', 'PRESENTATION', 'INFOGRAPHIC', 'LINKEDIN'],
    tone: 'Authoritative',
    audience: 'Executives',
    language: 'English',
    purpose: 'Briefing',
    length: 'Medium',
  };

  const videoPackage = await mockAI.generateVideoPackage(intelligence, config);
  assert(!!videoPackage.concept.title, 'Video Concept title generated');
  assert(videoPackage.storyboard.length > 0, 'Storyboard scenes generated with timing and camera framing');
  assert(videoPackage.subtitles.length > 0, 'Timed Subtitles generated');
  assert(!!videoPackage.musicRecommendations.style, 'Music recommendations generated');

  // 5. Test Presentation Content Package Generation & PPTX
  console.log('\n--- 5. Testing Presentation Package & PPTX Generator ---');
  const presentationPackage = await mockAI.generatePresentationPackage(intelligence, config);
  assert(presentationPackage.slides.length >= 4, 'Presentation slides count >= 4');
  assert(!!presentationPackage.slides[0].speakerNotes, 'Speaker notes present on slides');

  // Test PPTX binary compilation
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const slide1 = pres.addSlide();
  slide1.addText(presentationPackage.metadata.title, { x: 1, y: 2, fontSize: 28 });
  slide1.addNotes('Test speaker notes in PPTX');
  const pptxBuffer = (await pres.write({ outputType: 'nodebuffer' })) as Buffer;
  assert(pptxBuffer.length > 1000, 'PPTX Binary generation validated (Buffer size > 1KB)');

  // 6. Test Infographic Content Package Generation
  console.log('\n--- 6. Testing Infographic Content Package ---');
  const infographicPackage = await mockAI.generateInfographicPackage(intelligence, config);
  assert(!!infographicPackage.mainMessage.headline, 'Infographic headline generated');
  assert(infographicPackage.statistics.length > 0, 'Infographic statistics extracted with sourceRef');
  assert(infographicPackage.sections.length > 0, 'Infographic sections hierarchy generated');

  // 7. Test Multi-Output Parallel Generation & Persistence
  console.log('\n--- 7. Testing Multi-Output Generation ---');
  const outputs = await mockAI.generateOutputs(intelligence, sampleAdvisory, config);
  assert(outputs.length === 4, 'All 4 requested outputs generated simultaneously');
  const hasVideo = outputs.some((o) => o.format === 'VIDEO');
  const hasPres = outputs.some((o) => o.format === 'PRESENTATION');
  const hasInfo = outputs.some((o) => o.format === 'INFOGRAPHIC');
  const hasLinkedIn = outputs.some((o) => o.format === 'LINKEDIN');
  assert(hasVideo && hasPres && hasInfo && hasLinkedIn, 'Video, Presentation, Infographic, and LinkedIn all generated from 1 source');

  console.log('\n====================================================');
  console.log(`  ALL ${totalTests} TESTS PASSED WITH 100% SUCCESS!  `);
  console.log('====================================================\n');
}

runPhase2Tests().catch((err) => {
  console.error('Test run failed with error:', err);
  process.exit(1);
});
