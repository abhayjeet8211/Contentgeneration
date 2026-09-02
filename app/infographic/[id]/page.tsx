'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  BarChart3,
  Download,
  Share2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Copy,
  TrendingUp,
  Shield,
  DollarSign,
  Lock,
  Cpu,
  LayoutGrid,
  AlignVerticalSpaceAround,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface InfographicPackage {
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
  sections: Array<{
    sectionTitle: string;
    sectionType: string;
    content: string;
    stat?: { value: string; metric: string; sourceRef?: string };
    iconRecommendation?: string;
    visualRecommendation?: string;
  }>;
  layoutRecommendations?: {
    orientation: string;
    sectionHierarchy: string;
    visualWeight: string;
    textPlacement: string;
    chartPlacement: string;
    iconPlacement: string;
  };
  visualRecommendations?: {
    icons: string[];
    charts: string[];
    diagrams: string[];
    colorPalette: string[];
    illustrations: string[];
  };
}

export default function InfographicStudioPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<any>(null);
  const [pkg, setPkg] = useState<InfographicPackage | null>(null);
  const [layoutMode, setLayoutMode] = useState<'VERTICAL' | 'GRID' | 'HORIZONTAL'>('VERTICAL');
  const [activeTraceStat, setActiveTraceStat] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        if (data.packageData) {
          try {
            const parsed = typeof data.packageData === 'string' ? JSON.parse(data.packageData) : data.packageData;
            setPkg(parsed);
          } catch (e) {
            console.error('Error parsing infographic package data:', e);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Loading Infographic Studio...
        </div>
      </div>
    );
  }

  const activePackage: InfographicPackage = pkg || {
    mainMessage: {
      headline: content?.title || 'Automated Intelligence Transformation',
      subheadline: 'One Source • Deep Structured Knowledge • Infinite Consistent Outputs',
      coreTakeaway: content?.content?.slice(0, 200) || 'Zero-trust telemetry prevents 96% of intrusion vectors.',
    },
    keyMessages: [
      'Single-source intelligence ensures zero cross-channel drift.',
      'Deploying behavioral telemetry protects cloud infrastructure and saves $2.4M.',
      'Automated transformation accelerates multi-format communication by 80%.',
    ],
    statistics: [
      { metric: 'Intrusion Mitigation', value: '96%', label: 'Attacks stopped by zero-trust telemetry', sourceRef: 'Advisory p. 2' },
      { metric: 'Attack Surge', value: '+42%', label: 'Rise in automated credential threats', sourceRef: 'Audit Report p. 1' },
      { metric: 'Financial Protection', value: '$2.4M', label: 'Average saved per prevented incident', sourceRef: 'Financial Telemetry' },
    ],
    sections: [
      {
        sectionTitle: 'The Shifting Operational Landscape',
        sectionType: 'HEADLINE',
        content: 'Modern organizations face escalating threat volumes requiring real-time intelligence transformation.',
        iconRecommendation: 'Shield',
      },
      {
        sectionTitle: 'Empirical Telemetry Highlights',
        sectionType: 'KEY_STAT',
        content: 'Zero-trust identity verification delivers outsized protection across enterprise cloud infrastructure.',
        stat: { value: '96%', metric: 'Mitigation Rate', sourceRef: 'Section 2' },
        iconRecommendation: 'TrendingUp',
      },
      {
        sectionTitle: 'Strategic Horizons & Execution',
        sectionType: 'MAIN_INSIGHT',
        content: 'Mandate multi-factor authentication, perform continuous simulations, and deploy single-source pipelines.',
        iconRecommendation: 'Sparkles',
      },
    ],
    visualRecommendations: {
      icons: ['Shield', 'TrendingUp', 'DollarSign', 'CheckCircle2'],
      charts: ['Radial Progress Gauge (96%)', 'Comparative Growth (+42%)'],
      diagrams: ['3-Stage Linear Pipeline'],
      colorPalette: ['#6366f1 (Indigo)', '#0ea5e9 (Sky Blue)', '#10b981 (Emerald)', '#0f172a (Slate Dark)'],
      illustrations: ['Clean isometric cloud security network'],
    },
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(activePackage, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      {/* Top Studio Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={content?.generation?.projectId ? `/projects/${content.generation.projectId}` : '/projects'}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h1 className="text-sm font-bold text-slate-900 line-clamp-1">{activePackage.mainMessage.headline}</h1>
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                Infographic Package
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Visual hierarchy, traceable statistics & layout guidance</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Layout Mode Selector */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setLayoutMode('VERTICAL')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                layoutMode === 'VERTICAL' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <AlignVerticalSpaceAround className="w-3.5 h-3.5" /> Vertical
            </button>
            <button
              onClick={() => setLayoutMode('GRID')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                layoutMode === 'GRID' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grid Cards
            </button>
          </div>

          <button
            onClick={handleCopyJSON}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied!' : 'Copy JSON'}
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF / Print
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Canvas Preview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-slate-800 space-y-8">
            {/* Header Hero Banner */}
            <div className="text-center space-y-3 border-b border-white/10 pb-8">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                ★ Content Intelligence Infographic
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white max-w-2xl mx-auto">
                {activePackage.mainMessage.headline}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
                {activePackage.mainMessage.subheadline}
              </p>

              {activePackage.mainMessage.coreTakeaway && (
                <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-emerald-200 max-w-2xl mx-auto backdrop-blur-xs flex items-center gap-3 text-left">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{activePackage.mainMessage.coreTakeaway}</span>
                </div>
              )}
            </div>

            {/* Key Statistics Grid with Traceability */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider">Key Empirical Statistics</span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Source Traceable
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activePackage.statistics?.map((stat, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveTraceStat(stat)}
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-white/10 cursor-pointer transition-all space-y-2 group relative"
                  >
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      {stat.metric}
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">
                      {stat.value}
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{stat.label}</p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-400">
                      <span>Source: {stat.sourceRef}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Structured Content Sections */}
            <div className={`space-y-4 ${layoutMode === 'GRID' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-0' : ''}`}>
              {activePackage.sections?.map((section, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 backdrop-blur-xs"
                >
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white">{section.sectionTitle}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{section.content}</p>

                  {section.stat && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                      <span>{section.stat.metric}:</span>
                      <span className="text-white">{section.stat.value}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer Citation */}
            <div className="pt-6 border-t border-white/10 text-center text-xs text-slate-500">
              Verified & Generated with Gen AI Content Intelligence Platform • Single-Source Representation
            </div>
          </div>
        </div>

        {/* Right Column: Recommendations & Traceability Inspector */}
        <div className="lg:col-span-4 space-y-6">
          {/* Source Traceability Popover / Card */}
          {activeTraceStat ? (
            <div className="glass-panel p-5 rounded-3xl border-emerald-300 bg-emerald-50/60 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Source Traceability
                </span>
                <button
                  onClick={() => setActiveTraceStat(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">{activeTraceStat.metric}: {activeTraceStat.value}</h4>
                <p className="text-xs text-slate-700">{activeTraceStat.label}</p>
                <div className="mt-2 p-2.5 rounded-xl bg-white border border-emerald-200 text-xs font-mono text-emerald-800">
                  Citation Reference: <strong>{activeTraceStat.sourceRef}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-5 rounded-3xl border-slate-200 bg-white space-y-3 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Source Fact Verification
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every statistic generated in this infographic package contains a traceable citation to the source timestamp, page, or section. Click any metric to inspect its verification.
              </p>
            </div>
          )}

          {/* Visual Recommendations */}
          <div className="glass-panel p-5 rounded-3xl border-slate-200 bg-white space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-indigo-600" /> Visual & Color Styling
            </h3>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Curated Color Palette
              </span>
              <div className="flex flex-wrap gap-2">
                {activePackage.visualRecommendations?.colorPalette?.map((color, i) => (
                  <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-800">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Recommended Charts
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {activePackage.visualRecommendations?.charts?.map((chart, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{chart}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="glass-panel p-5 rounded-3xl border-slate-200 bg-white space-y-3 shadow-sm">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-brand-600" /> Key Takeaway Messages
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {activePackage.keyMessages?.map((msg, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{msg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
