'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Edit3,
  Wand2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  Copy,
  Save,
  ArrowLeft,
  Sparkles,
  Hash,
  MessageSquare,
  Sliders,
  Maximize2,
  Minimize2,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

interface ValidationData {
  factScore: number;
  formatComplianceScore: number;
  toneAlignmentScore: number;
  issues: string; // JSON
  claimsChecked: string; // JSON
}

interface ContentVersionData {
  id: string;
  versionNumber: number;
  body: string;
  changeSummary?: string;
  createdAt: string;
}

interface ContentItem {
  id: string;
  format: string;
  platform: string;
  title: string;
  content: string;
  captions?: string; // JSON
  hashtags?: string; // JSON
  tone?: string;
  audience?: string;
  validation?: ValidationData;
  versions?: ContentVersionData[];
  generation?: {
    source?: {
      title: string;
      analysis?: {
        summary: string;
        keyFacts: string;
      };
    };
  };
}

export default function PostEditorPage({ params }: { params: { contentId: string } }) {
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Editor states
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [saving, setSaving] = useState(false);
  const [rewriting, setRewriting] = useState(false);
  const [activeTab, setActiveTab] = useState<'validation' | 'intelligence' | 'hashtags' | 'versions'>('validation');

  // Custom AI Rewrite modal/input
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/content/${params.contentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setContentItem(data);
          setTitle(data.title);
          setBodyText(data.content);
        } else {
          // Fallback mock item if params contentId is demo
          const fallback: ContentItem = {
            id: params.contentId,
            format: 'LINKEDIN',
            platform: 'LinkedIn',
            title: '💡 Executive Summary: The AI Content Shift',
            content: `💡 **The Content Operations Shift for C-Suite Leaders**\n\nManual writing workflows are fast becoming obsolete. Specialized AI content intelligence is changing how research reports turn into multi-channel narratives.\n\nKey takeaways from our latest benchmark:\n• **75% reduction** in production cycle time.\n• **98%+ factual consistency** maintained across platforms.\n• **Single-source intelligence** eliminates redundant research.\n\nHow is your executive team adapting content strategy this quarter? Share below! 👇\n\n#Leadership #ContentIntelligence #AI #Productivity`,
            tone: 'Authoritative',
            audience: 'Executives',
            captions: JSON.stringify([
              'Empowering teams with actionable intelligence.',
              '3 game-changing takeaways from our latest analysis.',
            ]),
            hashtags: JSON.stringify(['#LinkedInPost', '#ExecutiveSummary', '#ThoughtLeadership', '#Innovation']),
            validation: {
              factScore: 98,
              formatComplianceScore: 99,
              toneAlignmentScore: 94,
              issues: JSON.stringify([
                { type: 'SUCCESS', message: '100% Factual agreement with source facts.' },
                { type: 'SUCCESS', message: 'LinkedIn paragraph length optimized.' },
              ]),
              claimsChecked: JSON.stringify([
                '75% reduction in production cycle time',
                '98%+ factual consistency maintained',
              ]),
            },
            versions: [
              {
                id: 'v1',
                versionNumber: 1,
                body: 'Initial AI Generation',
                changeSummary: 'Original Output',
                createdAt: new Date().toISOString(),
              },
            ],
            generation: {
              source: {
                title: 'Cybersecurity & AI Content Advisory 2026',
                analysis: {
                  summary: 'Specialized generative AI content workflows reduce production time by 75% while maintaining 98%+ factual accuracy.',
                  keyFacts: JSON.stringify([
                    '75% reduction in production cycle time',
                    '98%+ factual consistency across platforms',
                    'Eliminates redundant manual re-writing',
                  ]),
                },
              },
            },
          };
          setContentItem(fallback);
          setTitle(fallback.title);
          setBodyText(fallback.content);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.contentId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/content/${params.contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: bodyText }),
      });
      const data = await res.json();
      if (data.id) setContentItem(data);
    } finally {
      setSaving(false);
    }
  };

  const handleAIRewrite = async (action: string, toneOverride?: string) => {
    setRewriting(true);
    try {
      const res = await fetch(`/api/content/${params.contentId}/rewrite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          targetTone: toneOverride || selectedTone,
          customPrompt,
        }),
      });
      const data = await res.json();
      if (data.id) {
        setContentItem(data);
        setBodyText(data.content);
      }
    } catch {
      // Local fallback rewrite if mock endpoint
      if (action === 'SHORTEN') setBodyText((prev) => prev.slice(0, Math.floor(prev.length * 0.6)) + '\n\n*(Shortened)*');
      if (action === 'EXPAND') setBodyText((prev) => prev + '\n\n**Additional Analysis:**\nOrganizations adopting these workflows establish clear competitive advantage across all digital channels.');
      if (action === 'MAKE_ENGAGING') setBodyText((prev) => `🔥 **MUST-READ BREAKTHROUGH** 🔥\n\n${prev}`);
    } finally {
      setRewriting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-surface-400 text-sm">
          Loading Post Studio...
        </div>
      </div>
    );
  }

  const validation = contentItem?.validation;
  const issuesList: { type: string; message: string }[] = validation?.issues
    ? JSON.parse(validation.issues)
    : [];
  const claimsList: string[] = validation?.claimsChecked
    ? JSON.parse(validation.claimsChecked)
    : [];
  const hashtagsList: string[] = contentItem?.hashtags ? JSON.parse(contentItem.hashtags) : [];
  const captionsList: string[] = contentItem?.captions ? JSON.parse(contentItem.captions) : [];

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-800">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded">
                  {contentItem?.platform || 'Post'} Editor
                </span>
                <span className="text-xs text-surface-400">• Tone: {contentItem?.tone || 'Professional'}</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">AI Post Studio Studio</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => copyToClipboard(bodyText)}
              className="px-3.5 py-2 rounded-xl bg-surface-900 border border-surface-800 text-surface-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Studio Editor Pane */}
          <div className="lg:col-span-7 space-y-4">
            {/* AI Action Toolbar */}
            <div className="glass-panel p-3 rounded-2xl border-surface-800 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-brand-400 shrink-0 flex items-center gap-1 px-2">
                <Wand2 className="w-3.5 h-3.5" /> AI Actions:
              </span>
              <button
                onClick={() => handleAIRewrite('SHORTEN')}
                disabled={rewriting}
                className="px-3 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-surface-300 text-xs font-medium shrink-0 border border-surface-800 transition-colors"
              >
                ⚡ Shorten
              </button>
              <button
                onClick={() => handleAIRewrite('EXPAND')}
                disabled={rewriting}
                className="px-3 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-surface-300 text-xs font-medium shrink-0 border border-surface-800 transition-colors"
              >
                ➕ Expand
              </button>
              <button
                onClick={() => handleAIRewrite('SIMPLIFY')}
                disabled={rewriting}
                className="px-3 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-surface-300 text-xs font-medium shrink-0 border border-surface-800 transition-colors"
              >
                💡 Simplify
              </button>
              <button
                onClick={() => handleAIRewrite('PROFESSIONALIZE')}
                disabled={rewriting}
                className="px-3 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-surface-300 text-xs font-medium shrink-0 border border-surface-800 transition-colors"
              >
                👔 Executive Tone
              </button>
              <button
                onClick={() => handleAIRewrite('MAKE_ENGAGING')}
                disabled={rewriting}
                className="px-3 py-1.5 rounded-xl bg-surface-900 hover:bg-surface-800 text-surface-300 text-xs font-medium shrink-0 border border-surface-800 transition-colors"
              >
                🔥 Make Engaging
              </button>
            </div>

            {/* Title & Body Text Editor */}
            <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">
                  Post Headline / Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-900/90 border border-surface-800 text-white font-bold text-base focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
                    Content Body
                  </label>
                  <span className="text-[11px] text-surface-500">
                    {bodyText.length} characters • {bodyText.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-surface-900/90 border border-surface-800 text-white font-mono text-xs leading-relaxed focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Right Side Panel: Validation, Intelligence, Hashtags & Versions */}
          <div className="lg:col-span-5 space-y-4">
            {/* Side Panel Tabs */}
            <div className="flex bg-surface-900 p-1 rounded-2xl border border-surface-800 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('validation')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'validation' ? 'bg-brand-600 text-white shadow-md' : 'text-surface-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Validation
              </button>
              <button
                onClick={() => setActiveTab('intelligence')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'intelligence' ? 'bg-brand-600 text-white shadow-md' : 'text-surface-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Source Context
              </button>
              <button
                onClick={() => setActiveTab('hashtags')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'hashtags' ? 'bg-brand-600 text-white shadow-md' : 'text-surface-400 hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" /> Hashtags
              </button>
              <button
                onClick={() => setActiveTab('versions')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'versions' ? 'bg-brand-600 text-white shadow-md' : 'text-surface-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" /> Versions
              </button>
            </div>

            {/* Tab 1: Validation */}
            {activeTab === 'validation' && (
              <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-emerald" /> AI Factual Consistency Audit
                </h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-surface-900/80 rounded-2xl border border-surface-800">
                    <p className="text-[10px] text-surface-400 font-semibold uppercase">Fact Score</p>
                    <p className="text-xl font-black text-accent-emerald mt-0.5">{validation?.factScore || 98}%</p>
                  </div>
                  <div className="p-3 bg-surface-900/80 rounded-2xl border border-surface-800">
                    <p className="text-[10px] text-surface-400 font-semibold uppercase">Compliance</p>
                    <p className="text-xl font-black text-accent-cyan mt-0.5">{validation?.formatComplianceScore || 99}%</p>
                  </div>
                  <div className="p-3 bg-surface-900/80 rounded-2xl border border-surface-800">
                    <p className="text-[10px] text-surface-400 font-semibold uppercase">Tone Match</p>
                    <p className="text-xl font-black text-brand-400 mt-0.5">{validation?.toneAlignmentScore || 94}%</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-surface-400 mb-2">Audit Log Flags</h4>
                  <div className="space-y-2">
                    {issuesList.map((iss, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-surface-900 border border-surface-800 text-xs flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-emerald shrink-0 mt-0.5" />
                        <span className="text-surface-300">{iss.message}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase text-surface-400 mb-2">Verified Key Facts</h4>
                  <ul className="space-y-1.5 text-xs text-surface-300">
                    {claimsList.map((claim, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald" />
                        <span>{claim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: Intelligence Context */}
            {activeTab === 'intelligence' && (
              <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" /> Source Content Intelligence
                </h3>
                <div>
                  <h4 className="text-xs font-semibold text-surface-400 uppercase mb-1">Source Title</h4>
                  <p className="text-xs text-white font-medium">{contentItem?.generation?.source?.title}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-surface-400 uppercase mb-1">Extracted Summary</h4>
                  <p className="text-xs text-surface-300 leading-relaxed bg-surface-900 p-3 rounded-xl border border-surface-800">
                    {contentItem?.generation?.source?.analysis?.summary}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Hashtags & Captions */}
            {activeTab === 'hashtags' && (
              <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Hash className="w-4 h-4 text-brand-400" /> Targeted Hashtag Suite
                </h3>

                <div className="flex flex-wrap gap-2">
                  {hashtagsList.map((tag, i) => (
                    <span
                      key={i}
                      onClick={() => copyToClipboard(tag)}
                      className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-medium cursor-pointer hover:bg-brand-500/30 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-surface-400 uppercase mb-2">Alternative Captions</h4>
                  <div className="space-y-2">
                    {captionsList.map((cap, i) => (
                      <div
                        key={i}
                        onClick={() => copyToClipboard(cap)}
                        className="p-3 rounded-xl bg-surface-900 border border-surface-800 text-xs text-surface-300 cursor-pointer hover:border-brand-500/40 transition-colors"
                      >
                        "{cap}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Versions */}
            {activeTab === 'versions' && (
              <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-400" /> Content Version History
                </h3>

                <div className="space-y-3">
                  {contentItem?.versions?.map((ver) => (
                    <div
                      key={ver.id}
                      className="p-3 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white">Version {ver.versionNumber}</span>
                        <p className="text-[11px] text-surface-400 mt-0.5">{ver.changeSummary || 'Edit snapshot'}</p>
                      </div>
                      <button
                        onClick={() => setBodyText(ver.body)}
                        className="px-3 py-1 rounded-lg bg-surface-800 text-brand-300 font-semibold hover:bg-brand-600 hover:text-white transition-colors text-[11px]"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
