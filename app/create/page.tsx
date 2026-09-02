'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Sparkles,
  Upload,
  FileText,
  Wand2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sliders,
  Layers,
  Linkedin,
  Twitter,
  Instagram,
  FileSpreadsheet,
  Film,
  Mail,
  HelpCircle,
  Video,
  Presentation,
  BarChart3,
  Globe,
  Youtube,
  Radio,
  Music,
  Check,
  RefreshCw,
  Clock,
  PlayCircle,
} from 'lucide-react';

const SAMPLE_TEXT = `Global Cyber Threat Intelligence & Policy Advisory 2026:
Recent quarterly audits reveal a 42% increase in AI-automated credential stuffing attacks targeting cloud infrastructure across financial services and healthcare sectors. Organizations deploying zero-trust identity verification and continuous behavioral telemetry mitigated 96% of unauthorized intrusion attempts, resulting in an average cost savings of $2.4 million per incident. Executive guidance recommends immediate mandatory multi-factor authentication (MFA) enforcement, routine red-team simulation exercises, and vendor supply chain risk monitoring.`;

interface FormatOption {
  id: string;
  label: string;
  category: 'ADVANCED' | 'SOCIAL' | 'LONG_FORM' | 'PROFESSIONAL';
  description: string;
  icon: React.ReactNode;
}

const AVAILABLE_FORMATS: FormatOption[] = [
  // Advanced Packages
  {
    id: 'VIDEO',
    label: 'Video Content Package',
    category: 'ADVANCED',
    description: 'Complete video package: Script, Storyboard, Scenes, Narration, Subtitles (SRT/VTT), Visual & Music recommendations.',
    icon: <Video className="w-5 h-5 text-amber-500" />,
  },
  {
    id: 'PRESENTATION',
    label: 'Presentation Slide Deck',
    category: 'ADVANCED',
    description: 'Full deck with title, context, findings, slide layouts, speaker notes, and downloadable PPTX export.',
    icon: <Presentation className="w-5 h-5 text-indigo-500" />,
  },
  {
    id: 'INFOGRAPHIC',
    label: 'Infographic Package',
    category: 'ADVANCED',
    description: 'Visual messaging, key statistics with source traceability, section hierarchy, and chart/icon guidance.',
    icon: <BarChart3 className="w-5 h-5 text-emerald-500" />,
  },
  // Social & Comms
  {
    id: 'LINKEDIN',
    label: 'LinkedIn Post',
    category: 'SOCIAL',
    description: 'Professional authority post with hook, formatting, and high-impact hashtags.',
    icon: <Linkedin className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 'TWITTER_THREAD',
    label: 'Twitter/X Thread',
    category: 'SOCIAL',
    description: 'Numbered viral thread breaking down key takeaways and insights.',
    icon: <Twitter className="w-4 h-4 text-sky-500" />,
  },
  {
    id: 'INSTAGRAM',
    label: 'Instagram Caption',
    category: 'SOCIAL',
    description: 'Visual hook caption with structured bullet points and targeted tags.',
    icon: <Instagram className="w-4 h-4 text-pink-500" />,
  },
  {
    id: 'BLOG',
    label: 'Blog Article',
    category: 'LONG_FORM',
    description: 'Comprehensive long-form article with introduction, headings, and conclusion.',
    icon: <FileText className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'EXECUTIVE_SUMMARY',
    label: 'Executive Briefing',
    category: 'PROFESSIONAL',
    description: 'Concise C-suite summary with macro context, key findings, and action items.',
    icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'EMAIL',
    label: 'Email Newsletter',
    category: 'PROFESSIONAL',
    description: 'Engaging subscriber newsletter with subject line and clear call to action.',
    icon: <Mail className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'CUSTOM',
    label: 'Custom Format',
    category: 'PROFESSIONAL',
    description: 'Define your own specialized format with custom system instructions.',
    icon: <Wand2 className="w-4 h-4 text-rose-500" />,
  },
];

export default function CreateContentPage() {
  const router = useRouter();

  // Input Mode: 'TEXT' | 'UPLOAD' | 'URL'
  const [inputMode, setInputMode] = useState<'TEXT' | 'UPLOAD' | 'URL'>('TEXT');

  // Text inputs
  const [sourceTitle, setSourceTitle] = useState('Cyber Threat & AI Operational Advisory');
  const [rawContent, setRawContent] = useState(SAMPLE_TEXT);

  // File Upload inputs
  const [fileParsing, setFileParsing] = useState(false);
  const [parsedFileInfo, setParsedFileInfo] = useState<string | null>(null);
  const [uploadedSourceType, setUploadedSourceType] = useState('FILE');

  // URL Ingestion inputs
  const [urlInput, setUrlInput] = useState('');
  const [detectingUrl, setDetectingUrl] = useState(false);
  const [detectedData, setDetectedData] = useState<any>(null);
  const [selectedPodcastEpisode, setSelectedPodcastEpisode] = useState<any>(null);

  // Selected Formats & Config
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    'VIDEO',
    'PRESENTATION',
    'INFOGRAPHIC',
    'LINKEDIN',
  ]);
  const [customFormatDescription, setCustomFormatDescription] = useState('');
  const [tone, setTone] = useState('Authoritative');
  const [audience, setAudience] = useState('Executives & Security Leaders');
  const [language, setLanguage] = useState('English');
  const [purpose, setPurpose] = useState('Actionable Briefing');
  const [length, setLength] = useState('Medium');

  // Pipeline Execution State
  const [generating, setGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState('');

  const PIPELINE_STEPS = [
    'Validating & Ingesting Multimodal Source...',
    'Extracting Facts, Claims, Timestamps & Content Intelligence...',
    'Synthesizing Structured Knowledge Representation...',
    'Generating Selected Content Packages in Parallel...',
    'Verifying Source Consistency & Traceability Citations...',
  ];

  const toggleFormat = (id: string) => {
    setSelectedFormats((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileParsing(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/sources/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to process uploaded file');

      setRawContent(data.parsed.text);
      setSourceTitle(data.parsed.metadata.fileName || file.name);
      setUploadedSourceType(data.parsed.metadata.fileType || 'FILE');

      if (data.parsed.metadata.presentationData) {
        setParsedFileInfo(
          `Parsed Presentation • ${data.parsed.metadata.slideCount} Slides extracted with notes and bullet points`
        );
      } else {
        setParsedFileInfo(
          `Parsed ${data.parsed.metadata.fileType} • ${data.parsed.metadata.characterCount} characters (${data.parsed.metadata.wordCount} words)`
        );
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error uploading and parsing file');
    } finally {
      setFileParsing(false);
    }
  };

  const handleUrlDetect = async (urlToTest: string) => {
    if (!urlToTest || !urlToTest.startsWith('http')) {
      setDetectedData(null);
      return;
    }

    setDetectingUrl(true);
    setError('');

    try {
      const res = await fetch('/api/sources/url/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Could not recognize URL');
      }

      setDetectedData(data);
      if (data.metadata?.title) {
        setSourceTitle(data.metadata.title);
      } else if (data.sourceType === 'YOUTUBE') {
        setSourceTitle(`YouTube Video: ${data.metadata?.videoId || urlToTest}`);
      }

      if (data.metadata?.episodes?.length > 0) {
        setSelectedPodcastEpisode(data.metadata.episodes[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to inspect URL');
      setDetectedData(null);
    } finally {
      setDetectingUrl(false);
    }
  };

  const handleGenerate = async () => {
    let finalSourceType = 'TEXT';
    let finalRawContent = rawContent;
    let finalSourceUrl: string | undefined;

    if (inputMode === 'TEXT') {
      finalSourceType = 'TEXT';
      if (!rawContent || rawContent.trim().length < 10) {
        setError('Please provide sufficient source text.');
        return;
      }
    } else if (inputMode === 'UPLOAD') {
      finalSourceType = uploadedSourceType;
      if (!rawContent || rawContent.trim().length < 5) {
        setError('Please upload a valid document or media file.');
        return;
      }
    } else if (inputMode === 'URL') {
      if (!urlInput || !detectedData) {
        setError('Please enter and detect a supported URL (YouTube, Podcast RSS, or Web Page).');
        return;
      }
      finalSourceType = detectedData.sourceType;
      finalSourceUrl = selectedPodcastEpisode?.audioUrl || urlInput;
      finalRawContent = `[Source URL: ${urlInput}]\nTitle: ${sourceTitle}\nType: ${detectedData.label}\n${selectedPodcastEpisode ? `Episode: ${selectedPodcastEpisode.title}\n${selectedPodcastEpisode.description}` : ''}`;
    }

    if (selectedFormats.length === 0) {
      setError('Please select at least one output package to generate.');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      for (let i = 0; i < PIPELINE_STEPS.length - 1; i++) {
        setCurrentStepIndex(i);
        await new Promise((r) => setTimeout(r, 600));
      }
      setCurrentStepIndex(PIPELINE_STEPS.length - 1);

      const res = await fetch('/api/generation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTitle,
          sourceType: finalSourceType,
          sourceUrl: finalSourceUrl,
          rawContent: finalRawContent,
          formats: selectedFormats,
          customFormatDescription,
          tone,
          audience,
          language,
          purpose,
          length,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Generation failed');

      router.push(`/projects/${data.projectId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Content pipeline execution failed');
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              <span>Multimodal Intelligence Studio</span>
              <span>•</span>
              <span>Phase 2 Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-brand-600" />
              Transform Any Source into Multiple Outputs
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              One verified source (Documents, YouTube, Podcasts, Audio/Video, PPTX) powers Videos, Slide Decks, Infographics & Social Posts simultaneously.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-sky-600" />
            Gemini Multimodal AI & Knowledge Graph
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-600" /> 1. Select Source Input Method
                </h2>

                {/* 3-Tab Source Switcher */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                  <button
                    onClick={() => setInputMode('TEXT')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      inputMode === 'TEXT' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> Text / Prompt
                  </button>
                  <button
                    onClick={() => setInputMode('UPLOAD')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      inputMode === 'UPLOAD' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                  <button
                    onClick={() => setInputMode('URL')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                      inputMode === 'URL' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" /> Media URL
                  </button>
                </div>
              </div>

              {/* Source Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Source Title / Identifier
                </label>
                <input
                  type="text"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 text-sm transition-colors"
                  placeholder="e.g. Q3 Strategic Advisory & Threat Intelligence"
                />
              </div>

              {/* TAB 1: RAW TEXT / PROMPT */}
              {inputMode === 'TEXT' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Source Content / Advisory Text
                    </label>
                    <button
                      onClick={() => {
                        setRawContent(SAMPLE_TEXT);
                        setSourceTitle('Cyber Threat & AI Operational Advisory');
                      }}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Load Sample Advisory
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 text-xs font-mono leading-relaxed transition-colors"
                    placeholder="Paste research, article text, advisory, transcript, or free-form prompt here..."
                  />
                  <p className="text-[11px] text-slate-400 text-right">
                    {rawContent.length} characters • {rawContent.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
              )}

              {/* TAB 2: FILE UPLOAD (PDF, DOCX, PPT, PPTX, MP3, MP4, IMAGES) */}
              {inputMode === 'UPLOAD' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-3xl p-8 text-center bg-slate-50/60 transition-colors">
                    <Upload className="w-12 h-12 text-brand-600 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-900">
                      Drag & Drop or Browse Files
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supported: PDF, DOCX, PPT, PPTX, TXT, Images, Audio (MP3/WAV/M4A), Video (MP4/MOV)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.ppt,.pptx,.txt,.mp3,.wav,.m4a,.aac,.ogg,.mp4,.mov,.webm,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="mt-4 block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-600 file:text-white hover:file:bg-brand-700 cursor-pointer"
                    />
                    {fileParsing && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-brand-600">
                        <span className="w-3.5 h-3.5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                        <span>Extracting multimodal data...</span>
                      </div>
                    )}
                    {parsedFileInfo && (
                      <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{parsedFileInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA URL INGESTION (YOUTUBE, PODCAST RSS, WEB ARTICLE) */}
              {inputMode === 'URL' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Paste Public Media or Web URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                          handleUrlDetect(e.target.value);
                        }}
                        placeholder="https://youtube.com/watch?v=... or https://podcast.com/rss"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 text-sm font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleUrlDetect(urlInput)}
                        disabled={detectingUrl}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50"
                      >
                        {detectingUrl ? 'Detecting...' : 'Inspect URL'}
                      </button>
                    </div>
                  </div>

                  {/* Sample Quick Links */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Try sample:</span>
                    <button
                      type="button"
                      onClick={() => {
                        const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
                        setUrlInput(url);
                        handleUrlDetect(url);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    >
                      YouTube Video
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = 'https://feeds.simplecast.com/54nAGcIl';
                        setUrlInput(url);
                        handleUrlDetect(url);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    >
                      Podcast RSS Feed
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const url = 'https://en.wikipedia.org/wiki/Artificial_intelligence';
                        setUrlInput(url);
                        handleUrlDetect(url);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                    >
                      Web Article
                    </button>
                  </div>

                  {/* URL Detection Status Badge */}
                  {detectedData && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {detectedData.sourceType === 'YOUTUBE' && <Youtube className="w-5 h-5 text-red-400" />}
                          {detectedData.sourceType === 'PODCAST' && <Radio className="w-5 h-5 text-purple-400" />}
                          {detectedData.sourceType === 'WEBPAGE' && <Globe className="w-5 h-5 text-emerald-400" />}
                          {['DIRECT_AUDIO', 'DIRECT_VIDEO'].includes(detectedData.sourceType) && <PlayCircle className="w-5 h-5 text-sky-400" />}
                          <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                            Detected: {detectedData.label}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready to Analyze
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <p className="font-semibold text-white text-sm line-clamp-1">{sourceTitle}</p>
                        {detectedData.metadata?.channel && (
                          <p className="text-slate-400">Channel / Publisher: {detectedData.metadata.channel}</p>
                        )}
                        <p className="text-slate-400 text-[11px]">
                          Gemini will process timestamps, transcript segments, and multimodal context.
                        </p>
                      </div>

                      {/* Podcast Episode Selector if RSS Feed */}
                      {detectedData.sourceType === 'PODCAST' && detectedData.metadata?.episodes?.length > 0 && (
                        <div className="pt-2 border-t border-white/10 space-y-2">
                          <label className="block text-[11px] font-bold text-purple-300 uppercase">
                            Select Podcast Episode ({detectedData.metadata.episodes.length} found):
                          </label>
                          <select
                            value={selectedPodcastEpisode?.title || ''}
                            onChange={(e) => {
                              const found = detectedData.metadata.episodes.find(
                                (ep: any) => ep.title === e.target.value
                              );
                              if (found) {
                                setSelectedPodcastEpisode(found);
                                setSourceTitle(found.title);
                              }
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                          >
                            {detectedData.metadata.episodes.map((ep: any, idx: number) => (
                              <option key={idx} value={ep.title}>
                                {ep.title} {ep.duration ? `(${ep.duration})` : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Advanced Format Selector & Configuration */}
          <div className="lg:col-span-5 space-y-6">
            {/* Format Selection Panel */}
            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white space-y-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" /> 2. Select Output Packages ({selectedFormats.length})
                </h2>
              </div>

              {/* Advanced Packages Section */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ★ Advanced Content Packages
                </span>
                <div className="space-y-2">
                  {AVAILABLE_FORMATS.filter((f) => f.category === 'ADVANCED').map((fmt) => {
                    const isSelected = selectedFormats.includes(fmt.id);
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => toggleFormat(fmt.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-brand-50 to-indigo-50/60 border-brand-300 text-brand-950 shadow-sm ring-1 ring-brand-400/40'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-white shadow-xs shrink-0 mt-0.5">
                            {fmt.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{fmt.label}</div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                              {fmt.description}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1 shrink-0">
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-brand-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Social & Standard Formats Section */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Social, Comms & Executive Formats
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_FORMATS.filter((f) => f.category !== 'ADVANCED').map((fmt) => {
                    const isSelected = selectedFormats.includes(fmt.id);
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => toggleFormat(fmt.id)}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-brand-50 border-brand-300 text-brand-900 font-bold shadow-xs'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {fmt.icon}
                          <span className="text-xs">{fmt.label}</span>
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedFormats.includes('CUSTOM') && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Describe Custom Output Format
                  </label>
                  <input
                    type="text"
                    value={customFormatDescription}
                    onChange={(e) => setCustomFormatDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. 2-page FAQ list with compliance recommendations"
                  />
                </div>
              )}
            </div>

            {/* Tone & Audience Config */}
            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white space-y-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-600" /> 3. Strategic Adaptation
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Authoritative">Authoritative</option>
                    <option value="Professional">Professional</option>
                    <option value="Engaging">Engaging & Energetic</option>
                    <option value="Academic">Academic / Research</option>
                    <option value="Persuasive">Persuasive Sales</option>
                    <option value="Casual">Casual & Conversational</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                  >
                    <option value="Executives & Security Leaders">Executives & C-Suite</option>
                    <option value="General Industry Public">General Public</option>
                    <option value="Developers & Engineers">Developers / Engineers</option>
                    <option value="Marketing & Growth Teams">Marketers & Growth</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white font-bold text-base hover:brightness-105 shadow-xl shadow-brand-600/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {generating ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Multimodal Pipeline...</span>
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate {selectedFormats.length} Packages Simultaneously</span>
                  </>
                )}
              </button>

              {generating && (
                <div className="mt-3 p-3.5 rounded-2xl bg-brand-50 border border-brand-200 text-center text-xs text-brand-900 font-semibold space-y-1 animate-pulse">
                  <p>{PIPELINE_STEPS[currentStepIndex]}</p>
                  <p className="text-[10px] text-brand-600 font-normal">
                    Step {currentStepIndex + 1} of {PIPELINE_STEPS.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
