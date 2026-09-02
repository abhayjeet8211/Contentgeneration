'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Layers,
  FileText,
  Video,
  Share2,
  ShieldCheck,
  Cpu,
  Linkedin,
  Twitter,
  Instagram,
  FileSpreadsheet,
  Film,
  ListFilter,
  Wand2,
  Clock,
  LayoutTemplate,
} from 'lucide-react';

const DEMO_SOURCE = `AI Research & Operational Intelligence Advisory:
The rise of specialized generative AI workflows is shifting content operations from manual writing to multi-channel narrative synthesis. Teams adopting structured content extraction report 75% reduction in production cycle times while maintaining 98%+ factual consistency with source research papers and policy reports.`;

const DEMO_OUTPUTS: Record<string, { icon: React.ReactNode; title: string; content: string; tag: string }> = {
  LinkedIn: {
    icon: <Linkedin className="w-5 h-5 text-blue-400" />,
    title: 'LinkedIn Post Draft',
    tag: 'Professional Narrative',
    content: `💡 **The Content Operations Shift for C-Suite Leaders**\n\nManual writing workflows are fast becoming obsolete. Specialized AI content intelligence is changing how research reports and policy papers turn into multi-channel narratives.\n\nKey takeaways from our latest benchmark:\n• **75% reduction** in production cycle time.\n• **98%+ factual consistency** maintained across platforms.\n• **Single-source intelligence** eliminates redundant research.\n\nHow is your executive team adapting content strategy this quarter? Share below! 👇\n\n#Leadership #ContentIntelligence #AI #Productivity`,
  },
  Twitter: {
    icon: <Twitter className="w-5 h-5 text-sky-400" />,
    title: 'Twitter / X Thread (1/4)',
    tag: 'Viral Thread Format',
    content: `1/4 🧵 Research breakdown: Manual content adaptation is costing teams hundreds of hours every month.\n\nHere's how AI Content Intelligence solves it 🧵👇\n\n2/4 ⚡ Benchmark findings show a **75% decrease in cycle time** when using 1-source intelligence extraction.\n\n3/4 🛡️ Most importantly: Factual consistency stays above **98%**, stopping hallucination at the source.\n\n4/4 🎯 Bottom line: Understand the source once, adapt everywhere simultaneously. Follow for more daily AI breakthroughs! ♻️`,
  },
  Instagram: {
    icon: <Instagram className="w-5 h-5 text-pink-400" />,
    title: 'Instagram Carousel Caption',
    tag: 'Visual Digest',
    content: `✨ **THE FUTURE OF CONTENT IS HERE** ✨\n\nSay goodbye to writing every post from scratch! 🚀\n\nSwipe left to see how 1 research source turns into 6+ platform outputs in seconds! 📲\n\n🔥 Big Stats:\n🔹 75% Faster Production\n🔹 98% Factual Precision\n\nSave this post for your next campaign planning session! 📌\n\n.#ContentStrategy #AITools #DigitalMarketing #GrowthHacks`,
  },
  Briefing: {
    icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />,
    title: 'Executive Briefing Memo',
    tag: 'C-Suite Memo',
    content: `## EXECUTIVE MEMORANDUM\n\n**TO:** Executive Leadership Team\n**SUBJECT:** Content Operations AI Synthesis ROI\n\n### Executive Summary\nImplementation of structured content intelligence engines achieves a 75% reduction in content production latency while preserving a 98%+ factual verification audit trail.\n\n### Strategic Takeaways\n1. Centralized Source Processing eliminates independent reinterpretation.\n2. Automated Multi-Output generation guarantees tone alignment.`,
  },
  VideoScript: {
    icon: <Film className="w-5 h-5 text-amber-400" />,
    title: 'Short-Form Video Script',
    tag: '9:16 Scene Breakdown',
    content: `🎬 **SCENE 1 (0-5s):**\n*Visual:* Dynamic text overlay "75% Faster Content Production"\n*Voiceover:* "Stop spending 10 hours writing for 5 different platforms!"\n\n🎬 **SCENE 2 (5-15s):**\n*Visual:* Screen recording of OmniContent AI Pipeline\n*Voiceover:* "One single research report now auto-generates your LinkedIn, Twitter, and Video scripts instantly with zero fact loss."`,
  },
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('LinkedIn');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 lg:px-8 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-400/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-sky-400/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-sm animate-pulse-slow bg-white/90">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Next-Gen Multi-Output Content Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-slate-700 font-medium">Gemini & Multi-Provider AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
            One Source. <span className="text-gradient">AI Content Intelligence.</span>
            <br />
            Multiple Adapted Outputs.
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Upload any research paper, policy document, news advisory, or prompt. Understand the source once and transform it into LinkedIn posts, Twitter threads, blog articles, executive briefings, and video scripts simultaneously.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 text-white font-bold text-base hover:brightness-105 shadow-xl shadow-brand-600/25 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Try Multi-Output Generation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-50 text-slate-800 font-semibold text-base transition-all border border-slate-200 shadow-sm flex items-center justify-center gap-2"
            >
              <span>View Interactive Demo</span>
            </Link>
          </div>

          {/* Interactive 1-Source Live Transformation Simulator */}
          <div className="glass-panel p-6 lg:p-8 rounded-3xl border-slate-200 text-left max-w-5xl mx-auto shadow-xl bg-white/95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-slate-600 pl-2">OmniContent AI Engine Pipeline</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" /> 98.4% Fact Consistency Verified
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 1 Source Input */}
              <div className="lg:col-span-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-600" /> 1. Input Source
                  </span>
                  <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">PDF / Text</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed flex-1 shadow-sm">
                  {DEMO_SOURCE}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Intelligence Analysis: Complete</span>
                  <span className="text-brand-600 font-semibold">4 Key Facts Extracted</span>
                </div>
              </div>

              {/* Center Arrow */}
              <div className="hidden lg:flex items-center justify-center lg:col-span-1 text-brand-600">
                <div className="w-10 h-10 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center shadow-sm">
                  <Wand2 className="w-5 h-5 text-brand-600" />
                </div>
              </div>

              {/* Right Column: Multi-Format Output Switcher */}
              <div className="lg:col-span-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-600" /> 2. Adapted Outputs
                  </span>
                  <span className="text-[10px] bg-brand-50 text-brand-700 border border-brand-200 px-2 py-0.5 rounded font-semibold">
                    Simultaneous
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1.5 mb-3 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  {Object.keys(DEMO_OUTPUTS).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        activeTab === tab
                          ? 'bg-white text-brand-600 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      {DEMO_OUTPUTS[tab].icon}
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Output View Box */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 flex-1 flex flex-col shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-100">
                    <span>{DEMO_OUTPUTS[activeTab].title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {DEMO_OUTPUTS[activeTab].tag}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed flex-1">
                    {DEMO_OUTPUTS[activeTab].content}
                  </pre>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Tone: Executive & Engaging</span>
                    <Link href="/create" className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1">
                      Edit in Post Studio →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 lg:px-8 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Built for Modern Content Strategy Teams
            </h2>
            <p className="text-slate-600 text-base">
              Say goodbye to repetitive manual re-writing. One single intelligence pass extracts factual entities, metrics, and key narratives for seamless multi-channel distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-200/80 bg-slate-50/40">
              <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1-Source Multi-Generation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate LinkedIn posts, Twitter threads, Instagram captions, blog posts, briefings, and video scripts simultaneously in a single click.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-200/80 bg-slate-50/40">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Factual Validation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatic validation engine scores factual consistency, platform compliance, and tone alignment to eliminate unsupported claims.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-200/80 bg-slate-50/40">
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Canvas Video Studio MVP</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Turn video scripts into interactive vertical scenes with text overlays, subtitle timing, audio tracks, and canvas preview player.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-200/80 bg-slate-50/40">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-5">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Rewrite Studio</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                In-line AI actions to instantly shorten, expand, simplify, change tone, or professionalize selected content blocks.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-200/80 bg-slate-50/40">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Built-in Template Library</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Browse pre-built social, executive, news, and video templates or save custom organizational templates for team reuse.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-200/80 bg-slate-50/40">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Modular AI Abstraction</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Supports Google Gemini API out of the box with intelligent fallback mode when offline, ready for OpenAI & Anthropic expansion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Explanation */}
      <section className="py-20 px-4 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              How OmniContent AI Works
            </h2>
            <p className="text-slate-600 text-base">4 simple steps to transform raw information into multi-channel campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="glass-panel p-6 rounded-2xl relative border-slate-200 bg-white shadow-sm">
              <span className="text-4xl font-black text-brand-600/10 absolute top-4 right-4">01</span>
              <h4 className="text-base font-bold text-slate-900 mb-2">1. Input Source</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Paste text, prompts, or upload PDF / DOCX research documents.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative border-slate-200 bg-white shadow-sm">
              <span className="text-4xl font-black text-brand-600/10 absolute top-4 right-4">02</span>
              <h4 className="text-base font-bold text-slate-900 mb-2">2. Extract Intelligence</h4>
              <p className="text-xs text-slate-600 leading-relaxed">AI analyzes key facts, entities, statistics, and narrative structure once.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative border-slate-200 bg-white shadow-sm">
              <span className="text-4xl font-black text-brand-600/10 absolute top-4 right-4">03</span>
              <h4 className="text-base font-bold text-slate-900 mb-2">3. Adapt Outputs</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Generates platform-customized outputs simultaneously based on selected formats.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative border-slate-200 bg-white shadow-sm">
              <span className="text-4xl font-black text-brand-600/10 absolute top-4 right-4">04</span>
              <h4 className="text-base font-bold text-slate-900 mb-2">4. Edit & Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Refine in Post Studio or produce vertical scenes in Video Studio MVP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl p-10 bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800 border border-brand-400/30 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to Accelerate Your Content Operations?
            </h2>
            <p className="text-indigo-100 text-base max-w-2xl mx-auto mb-8">
              Start transforming research reports and advisories into high-performing multi-format content today.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-brand-700 font-bold text-base hover:bg-slate-50 shadow-xl transition-all"
            >
              <span>Launch Content Studio</span>
              <ArrowRight className="w-5 h-5 text-brand-600" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
