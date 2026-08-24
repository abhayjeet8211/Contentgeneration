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
} from 'lucide-react';

const SAMPLE_TEXT = `Global Cyber Threat Intelligence & Policy Advisory 2026:
Recent quarterly audits reveal a 42% increase in AI-automated credential stuffing attacks targeting cloud infrastructure across financial services and healthcare sectors. Organizations deploying zero-trust identity verification and continuous behavioral telemetry mitigated 96% of unauthorized intrusion attempts, resulting in an average cost savings of $2.4 million per incident. Executive guidance recommends immediate mandatory multi-factor authentication (MFA) enforcement, routine red-team simulation exercises, and vendor supply chain risk monitoring.`;

const AVAILABLE_FORMATS = [
  { id: 'LINKEDIN', label: 'LinkedIn Post', platform: 'LinkedIn', icon: <Linkedin className="w-4 h-4 text-blue-400" /> },
  { id: 'TWITTER_THREAD', label: 'Twitter/X Thread', platform: 'Twitter/X', icon: <Twitter className="w-4 h-4 text-sky-400" /> },
  { id: 'INSTAGRAM', label: 'Instagram Caption', platform: 'Instagram', icon: <Instagram className="w-4 h-4 text-pink-400" /> },
  { id: 'BLOG', label: 'Blog Article', platform: 'Blog', icon: <FileText className="w-4 h-4 text-indigo-400" /> },
  { id: 'EXECUTIVE_SUMMARY', label: 'Executive Briefing', platform: 'Executive', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> },
  { id: 'VIDEO_SCRIPT', label: 'Short Video Script', platform: 'Video', icon: <Film className="w-4 h-4 text-amber-400" /> },
  { id: 'EMAIL', label: 'Email Newsletter', platform: 'Email', icon: <Mail className="w-4 h-4 text-purple-400" /> },
  { id: 'CUSTOM', label: 'Custom Format', platform: 'Custom', icon: <Wand2 className="w-4 h-4 text-rose-400" /> },
];

export default function CreateContentPage() {
  const router = useRouter();

  // Input states
  const [sourceType, setSourceType] = useState<'TEXT' | 'FILE' | 'PROMPT'>('TEXT');
  const [sourceTitle, setSourceTitle] = useState('Cyber Threat & AI Operational Advisory');
  const [rawContent, setRawContent] = useState(SAMPLE_TEXT);
  const [fileParsing, setFileParsing] = useState(false);
  const [parsedFileInfo, setParsedFileInfo] = useState<string | null>(null);

  // Configuration states
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    'LINKEDIN',
    'TWITTER_THREAD',
    'EXECUTIVE_SUMMARY',
    'VIDEO_SCRIPT',
  ]);
  const [customFormatDescription, setCustomFormatDescription] = useState('');
  const [tone, setTone] = useState('Authoritative');
  const [audience, setAudience] = useState('Executives & Security Leaders');
  const [language, setLanguage] = useState('English');
  const [purpose, setPurpose] = useState('Actionable Briefing');
  const [length, setLength] = useState('Medium');

  // Pipeline execution state
  const [generating, setGenerating] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string | null>(null);
  const [error, setError] = useState('');

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
      const res = await fetch('/api/sources/parse', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to parse file');

      setRawContent(data.parsed.text);
      setSourceTitle(data.parsed.metadata.fileName || file.name);
      setParsedFileInfo(
        `Parsed ${data.parsed.metadata.fileType} • ${data.parsed.metadata.characterCount} characters (${data.parsed.metadata.wordCount} words)`
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error parsing uploaded file');
    } finally {
      setFileParsing(false);
    }
  };

  const handleGenerate = async () => {
    if (!rawContent || rawContent.trim().length < 10) {
      setError('Please provide sufficient source text or upload a document.');
      return;
    }
    if (selectedFormats.length === 0) {
      setError('Please select at least one output format to generate.');
      return;
    }

    setError('');
    setGenerating(true);

    try {
      setPipelineStep('Step 1/3: Extracting Content Intelligence & Key Facts...');
      await new Promise((r) => setTimeout(r, 600));

      setPipelineStep('Step 2/3: Generating Multi-Format Outputs Simultaneously...');
      await new Promise((r) => setTimeout(r, 800));

      setPipelineStep('Step 3/3: Running AI Factual Verification & Format Audit...');

      const res = await fetch('/api/generation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTitle,
          sourceType,
          rawContent,
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
      setError(err instanceof Error ? err.message : 'Content pipeline failed');
      setGenerating(false);
      setPipelineStep(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-brand-400" />
              Multi-Output Content Studio
            </h1>
            <p className="text-sm text-surface-400 mt-1">
              Provide one source document and transform it into multiple adapted outputs simultaneously.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-accent-cyan bg-accent-cyan/10 px-3.5 py-1.5 rounded-xl border border-accent-cyan/20">
            <CheckCircle2 className="w-4 h-4" /> Provider: Gemini & Intelligent Engine
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Source Input */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-400" /> 1. Provide Source Information
                </h2>
                <div className="flex bg-surface-900 p-1 rounded-xl border border-surface-800">
                  <button
                    onClick={() => setSourceType('TEXT')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      sourceType === 'TEXT' ? 'bg-brand-600 text-white' : 'text-surface-400 hover:text-white'
                    }`}
                  >
                    Raw Text
                  </button>
                  <button
                    onClick={() => setSourceType('FILE')}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      sourceType === 'FILE' ? 'bg-brand-600 text-white' : 'text-surface-400 hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {/* Source Title Input */}
              <div>
                <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider mb-1.5">
                  Source Title / Identifier
                </label>
                <input
                  type="text"
                  value={sourceTitle}
                  onChange={(e) => setSourceTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-900/80 border border-surface-800 text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 text-sm"
                  placeholder="e.g. Q3 Cybersecurity Report"
                />
              </div>

              {/* File Upload Zone */}
              {sourceType === 'FILE' ? (
                <div className="border-2 border-dashed border-surface-700/80 hover:border-brand-500 rounded-2xl p-8 text-center bg-surface-900/40 transition-colors">
                  <Upload className="w-10 h-10 text-brand-400 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-white">Click or drag PDF, DOCX, or TXT file here</p>
                  <p className="text-xs text-surface-400 mt-1">Extracts clean text directly for Content Intelligence</p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="mt-4 block w-full text-xs text-surface-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-600 file:text-white hover:file:bg-brand-500 cursor-pointer"
                  />
                  {fileParsing && <p className="text-xs text-brand-300 mt-3 font-semibold">Parsing document contents...</p>}
                  {parsedFileInfo && (
                    <div className="mt-3 p-2.5 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-medium">
                      ✓ {parsedFileInfo}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-surface-400 uppercase tracking-wider">
                      Source Content / Advisory / Prompt
                    </label>
                    <button
                      onClick={() => {
                        setRawContent(SAMPLE_TEXT);
                        setSourceTitle('Cyber Threat & AI Operational Advisory');
                      }}
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                    >
                      Load Sample Advisory
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    className="w-full p-4 rounded-xl bg-surface-900/90 border border-surface-800 text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 text-xs font-mono leading-relaxed"
                    placeholder="Paste research, article text, advisory, or free-form prompt here..."
                  />
                  <p className="text-[11px] text-surface-500 mt-1 text-right">
                    {rawContent.length} characters • {rawContent.split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Multi-Format Selection & Tone Setup */}
          <div className="lg:col-span-5 space-y-6">
            {/* Format Selection */}
            <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-400" /> 2. Select Output Formats ({selectedFormats.length})
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                {AVAILABLE_FORMATS.map((fmt) => {
                  const isSelected = selectedFormats.includes(fmt.id);
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => toggleFormat(fmt.id)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                          : 'bg-surface-900/60 border-surface-800 text-surface-400 hover:text-white hover:bg-surface-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {fmt.icon}
                        <span className="text-xs font-semibold">{fmt.label}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {selectedFormats.includes('CUSTOM') && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-surface-400 mb-1">
                    Describe Custom Output Format
                  </label>
                  <input
                    type="text"
                    value={customFormatDescription}
                    onChange={(e) => setCustomFormatDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-surface-800 text-white text-xs"
                    placeholder="e.g. 2-page FAQ list for customer support"
                  />
                </div>
              )}
            </div>

            {/* Tone & Audience Config */}
            <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-brand-400" /> 3. Configure Tone & Audience
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-surface-800 text-white text-xs"
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
                  <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">
                    Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-surface-800 text-white text-xs"
                  >
                    <option value="Executives & Security Leaders">Executives & C-Suite</option>
                    <option value="General Industry Public">General Public</option>
                    <option value="Developers & Engineers">Developers / Engineers</option>
                    <option value="Marketing & Growth Teams">Marketers & Growth</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Trigger Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan text-white font-bold text-base hover:brightness-110 shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {generating ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Content Pipeline...</span>
                  </div>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    <span>Generate {selectedFormats.length} Outputs Simultaneously</span>
                  </>
                )}
              </button>

              {generating && pipelineStep && (
                <div className="mt-3 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center text-xs text-brand-300 font-semibold animate-pulse">
                  {pipelineStep}
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
