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
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 lg:px-8 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-accent-cyan/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-brand-500/30 text-brand-300 text-xs font-semibold mb-6 animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Next-Gen Multi-Output Content Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            <span className="text-white">Gemini & Multi-Provider AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none mb-6">
            One Source. <span className="text-gradient">AI Content Intelligence.</span>
            <br />
            Multiple Adapted Outputs.
          </h1>

          <p className="text-lg md:text-xl text-surface-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Upload any research paper, policy document, news advisory, or prompt. Understand the source once and transform it into LinkedIn posts, Twitter threads, blog articles, executive briefings, and video scripts simultaneously.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/create"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-cyan text-white font-bold text-base hover:brightness-110 shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-3 group"
            >
              <span>Try Multi-Output Generation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-surface-800/80 text-white font-semibold text-base transition-all border border-surface-700/60 flex items-center justify-center gap-2"
            >
              <span>View Interactive Demo</span>
            </Link>
          </div>

          {/* Interactive 1-Source Live Transformation Simulator */}
          <div className="glass-panel p-6 lg:p-8 rounded-3xl border-surface-800 text-left max-w-5xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-surface-400 pl-2">OmniContent AI Engine Pipeline</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-accent-emerald bg-accent-emerald/10 px-3 py-1 rounded-full border border-accent-emerald/20">
                <ShieldCheck className="w-3.5 h-3.5" /> 98.4% Fact Consistency Verified
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 1 Source Input */}
              <div className="lg:col-span-5 bg-surface-900/80 p-5 rounded-2xl border border-surface-800/80 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-400" /> 1. Input Source
                  </span>
                  <span className="text-[10px] text-surface-400 bg-surface-800 px-2 py-0.5 rounded">PDF / Text</span>
                </div>
                <div className="p-3 bg-surface-950/80 rounded-xl border border-surface-800/60 text-xs text-surface-300 font-mono leading-relaxed flex-1">
                  {DEMO_SOURCE}
                </div>
                <div className="mt-4 pt-3 border-t border-surface-800/80 flex items-center justify-between text-xs text-surface-400">
                  <span>Intelligence Analysis: Complete</span>
                  <span className="text-accent-cyan font-semibold">4 Key Facts Extracted</span>
                </div>
              </div>

              {/* Center Arrow */}
              <div className="hidden lg:flex items-center justify-center lg:col-span-1 text-brand-400">
                <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center animate-pulse">
                  <Wand2 className="w-5 h-5 text-brand-400" />
                </div>
              </div>

              {/* Right Column: Multi-Format Output Switcher */}
              <div className="lg:col-span-6 bg-surface-900/80 p-5 rounded-2xl border border-surface-800/80 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-400" /> 2. Adapted Outputs
                  </span>
                  <span className="text-[10px] text-surface-400 bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-semibold">
                    Simultaneous
                  </span>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-1.5 mb-3 p-1 bg-surface-950 rounded-xl border border-surface-800/60">
                  {Object.keys(DEMO_OUTPUTS).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        activeTab === tab
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'text-surface-400 hover:text-white hover:bg-surface-800/40'
                      }`}
                    >
                      {DEMO_OUTPUTS[tab].icon}
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Output View Box */}
                <div className="p-4 bg-surface-950/80 rounded-xl border border-surface-800/60 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs font-semibold text-white mb-2 pb-2 border-b border-surface-800/60">
                    <span>{DEMO_OUTPUTS[activeTab].title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-surface-800 text-surface-300">
                      {DEMO_OUTPUTS[activeTab].tag}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs text-surface-300 leading-relaxed flex-1">
                    {DEMO_OUTPUTS[activeTab].content}
                  </pre>
                  <div className="mt-3 pt-2 border-t border-surface-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-surface-400">Tone: Executive & Engaging</span>
                    <Link href="/create" className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
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
      <section className="py-20 px-4 lg:px-8 border-t border-surface-800/60 bg-surface-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              Built for Modern Content Strategy Teams
            </h2>
            <p className="text-surface-400 text-base">
              Say goodbye to repetitive manual re-writing. One single intelligence pass extracts factual entities, metrics, and key narratives for seamless multi-channel distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1-Source Multi-Generation</h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                Generate LinkedIn posts, Twitter threads, Instagram captions, blog posts, briefings, and video scripts simultaneously in a single click.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Factual Validation</h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                Automatic validation engine scores factual consistency, platform compliance, and tone alignment to eliminate unsupported claims.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent-amber/20 border border-accent-amber/30 flex items-center justify-center text-accent-amber mb-5">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Canvas Video Studio MVP</h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                Turn video scripts into interactive vertical scenes with text overlays, subtitle timing, audio tracks, and canvas preview player.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-purple mb-5">
                <Wand2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Rewrite Studio</h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                In-line AI actions to instantly shorten, expand, simplify, change tone, or professionalize selected content blocks.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-accent-emerald/20 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald mb-5">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Built-in Template Library</h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                Browse pre-built social, executive, news, and video templates or save custom organizational templates for team reuse.
              </p>
            </div>

            <div className="glass-panel glass-panel-hover p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Modular AI Abstraction</h3>
              <p className="text-sm text-surface-400 leading-relaxed">
                Supports Google Gemini API out of the box with intelligent fallback mode when offline, ready for OpenAI & Anthropic expansion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Explanation */}
      <section className="py-20 px-4 lg:px-8 bg-surface-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
              How OmniContent AI Works
            </h2>
            <p className="text-surface-400 text-base">4 simple steps to transform raw information into multi-channel campaigns.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="glass-panel p-6 rounded-2xl relative">
              <span className="text-4xl font-black text-brand-500/30 absolute top-4 right-4">01</span>
              <h4 className="text-base font-bold text-white mb-2">1. Input Source</h4>
              <p className="text-xs text-surface-400">Paste text, prompts, or upload PDF / DOCX research documents.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <span className="text-4xl font-black text-brand-500/30 absolute top-4 right-4">02</span>
              <h4 className="text-base font-bold text-white mb-2">2. Extract Intelligence</h4>
              <p className="text-xs text-surface-400">AI analyzes key facts, entities, statistics, and narrative structure once.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <span className="text-4xl font-black text-brand-500/30 absolute top-4 right-4">03</span>
              <h4 className="text-base font-bold text-white mb-2">3. Adapt Outputs</h4>
              <p className="text-xs text-surface-400">Generates platform-customized outputs simultaneously based on selected formats.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative">
              <span className="text-4xl font-black text-brand-500/30 absolute top-4 right-4">04</span>
              <h4 className="text-base font-bold text-white mb-2">4. Edit & Export</h4>
              <p className="text-xs text-surface-400">Refine in Post Studio or produce vertical scenes in Video Studio MVP.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="py-16 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl p-10 bg-gradient-to-r from-brand-900 via-indigo-900 to-surface-900 border border-brand-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Ready to Accelerate Your Content Operations?
            </h2>
            <p className="text-surface-300 text-base max-w-2xl mx-auto mb-8">
              Start transforming research reports and advisories into high-performing multi-format content today.
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-surface-950 font-bold text-base hover:bg-surface-100 shadow-xl transition-all"
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
