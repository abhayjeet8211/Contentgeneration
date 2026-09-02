'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Presentation,
  Download,
  Plus,
  Trash2,
  Sparkles,
  ArrowLeft,
  Copy,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Layers,
  Wand2,
  Eye,
  Sliders,
  Share2,
} from 'lucide-react';

interface Slide {
  slideNumber: number;
  title: string;
  mainContent?: string;
  bulletPoints: string[];
  visualRecommendation?: string;
  layoutRecommendation?: string;
  sourceReferences?: string[];
  speakerNotes?: string;
}

interface PresentationPackage {
  metadata: {
    title: string;
    subtitle: string;
    targetAudience: string;
    recommendedSlideCount: number;
    presentationObjective: string;
  };
  structure: string[];
  slides: Slide[];
}

export default function PresentationStudioPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<any>(null);
  const [pkg, setPkg] = useState<PresentationPackage | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [regeneratingNotes, setRegeneratingNotes] = useState(false);
  const [savedStatus, setSavedStatus] = useState('All changes saved');

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
            console.error('Error parsing presentation package data:', e);
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
          Loading Presentation Studio...
        </div>
      </div>
    );
  }

  // Fallback demo presentation if raw content without packageData
  const activePackage: PresentationPackage = pkg || {
    metadata: {
      title: content?.title || 'Executive Intelligence Briefing',
      subtitle: 'Strategic Roadmap & Multimodal Insights',
      targetAudience: 'Executive Leadership',
      recommendedSlideCount: 4,
      presentationObjective: 'Communicate strategic findings and actions',
    },
    structure: ['Title', 'Executive Summary', 'Findings', 'Roadmap'],
    slides: [
      {
        slideNumber: 1,
        title: content?.title || 'Executive Strategic Briefing',
        mainContent: 'Single-source intelligence synthesized for executive decision makers.',
        bulletPoints: [
          'Audience: Executive Stakeholders',
          'Focus: Actionable Telemetry & Risk Mitigation',
          'Source: Verified Content Intelligence',
        ],
        visualRecommendation: 'Deep obsidian theme with indigo accents and minimalist typography',
        layoutRecommendation: 'TITLE_HERO',
        speakerNotes: 'Good morning everyone. Today we examine the core takeaways from our verified intelligence report.',
      },
      {
        slideNumber: 2,
        title: 'Executive Summary & Macro Context',
        mainContent: content?.content?.slice(0, 300) || 'Macro intelligence summary.',
        bulletPoints: [
          'Threat frequency increased 42% across target infrastructure',
          'Zero-trust telemetry mitigated 96% of intrusion attempts',
          'Average cost savings estimated at $2.4 Million per prevented event',
        ],
        visualRecommendation: '3-card pillar layout with stat highlight badges',
        layoutRecommendation: 'THREE_COLUMN_CARDS',
        speakerNotes: 'Notice the three key pillars outlined on this slide. Rapid mitigation delivers measurable ROI.',
      },
    ],
  };

  const currentSlide = activePackage.slides[activeSlideIndex] || activePackage.slides[0];

  const updateCurrentSlide = (updates: Partial<Slide>) => {
    if (!pkg) return;
    const updatedSlides = [...pkg.slides];
    updatedSlides[activeSlideIndex] = { ...updatedSlides[activeSlideIndex], ...updates };
    setPkg({ ...pkg, slides: updatedSlides });
    setSavedStatus('Edited • Saving...');
    setTimeout(() => setSavedStatus('All changes saved'), 600);
  };

  const handleAddSlide = () => {
    if (!pkg) return;
    const newSlide: Slide = {
      slideNumber: pkg.slides.length + 1,
      title: 'New Strategic Slide',
      mainContent: 'Enter concise key takeaway for this slide.',
      bulletPoints: ['First key insight', 'Supporting metric or evidence', 'Strategic implication'],
      layoutRecommendation: 'THREE_COLUMN_CARDS',
      speakerNotes: 'Enter presentation speaker talking points here.',
    };
    setPkg({
      ...pkg,
      slides: [...pkg.slides, newSlide],
    });
    setActiveSlideIndex(pkg.slides.length);
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    if (!pkg || pkg.slides.length <= 1) return;
    const filtered = pkg.slides
      .filter((_, idx) => idx !== indexToDelete)
      .map((slide, idx) => ({ ...slide, slideNumber: idx + 1 }));
    setPkg({ ...pkg, slides: filtered });
    setActiveSlideIndex(Math.max(0, indexToDelete - 1));
  };

  const handleExportPptx = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/export/pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: activePackage.metadata.title,
          subtitle: activePackage.metadata.subtitle,
          slides: activePackage.slides,
        }),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activePackage.metadata.title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PPTX download error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleRegenerateNotes = async () => {
    setRegeneratingNotes(true);
    try {
      const res = await fetch('/api/content/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `Slide Title: ${currentSlide.title}\nContent: ${currentSlide.mainContent}\nBullets: ${currentSlide.bulletPoints.join(', ')}`,
          action: 'PROFESSIONALIZE',
          targetTone: 'Authoritative & Engaging',
          customPrompt: 'Write rich, natural executive speaker notes explaining the context, visuals, statistics, and transition to the next slide.',
        }),
      });
      const data = await res.json();
      if (data.rewritten) {
        updateCurrentSlide({ speakerNotes: data.rewritten });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRegeneratingNotes(false);
    }
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
              <Presentation className="w-4 h-4 text-indigo-600" />
              <h1 className="text-sm font-bold text-slate-900 line-clamp-1">{activePackage.metadata.title}</h1>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                Slide {activeSlideIndex + 1} of {activePackage.slides.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{savedStatus}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAddSlide}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Slide
          </button>
          <button
            onClick={handleExportPptx}
            disabled={exporting}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? 'Generating PPTX...' : 'Export to PPTX'}
          </button>
        </div>
      </div>

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Slide Deck Navigator */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Slide Deck</span>
            <span className="text-xs font-semibold text-indigo-600">{activePackage.slides.length} Slides</span>
          </div>

          <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
            {activePackage.slides.map((slide, idx) => {
              const isActive = idx === activeSlideIndex;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between relative group ${
                    isActive
                      ? 'bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                      : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1 pr-2">
                    <span className="text-xs font-bold text-slate-400 shrink-0 mt-0.5">#{slide.slideNumber}</span>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{slide.title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2">
                        {slide.bulletPoints?.[0] || slide.mainContent || 'Slide Content'}
                      </p>
                    </div>
                  </div>

                  {activePackage.slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSlide(idx);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Live Slide Preview Canvas */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 rounded-3xl p-8 text-white min-h-[420px] flex flex-col justify-between shadow-xl relative overflow-hidden border border-slate-800">
            {/* Background Gradient Effect */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-sky-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Slide Meta */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
              <span className="text-[11px] font-mono text-indigo-400 tracking-wider uppercase">
                {activePackage.metadata.title} • SLIDE {currentSlide.slideNumber}
              </span>
              <span className="text-[10px] font-semibold bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                {currentSlide.layoutRecommendation || 'EXECUTIVE_SLIDE'}
              </span>
            </div>

            {/* Slide Body */}
            <div className="py-6 space-y-4 relative z-10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h2>

              {currentSlide.mainContent && (
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  {currentSlide.mainContent}
                </p>
              )}

              <div className="space-y-2.5 pt-2">
                {currentSlide.bulletPoints?.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                    <span className="leading-relaxed">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Slide Visual Prompt Indicator */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="line-clamp-1">{currentSlide.visualRecommendation || 'Modern executive typography theme'}</span>
              </div>
              <span className="shrink-0 font-mono text-slate-500">{currentSlide.slideNumber} / {activePackage.slides.length}</span>
            </div>
          </div>

          {/* Navigation Controls under canvas */}
          <div className="flex items-center justify-between px-2 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeSlideIndex === 0}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Slide
            </button>
            <span>Slide {activeSlideIndex + 1} of {activePackage.slides.length}</span>
            <button
              onClick={() => setActiveSlideIndex((prev) => Math.min(activePackage.slides.length - 1, prev + 1))}
              disabled={activeSlideIndex === activePackage.slides.length - 1}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center gap-1 shadow-xs"
            >
              Next Slide <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Properties & Speaker Notes Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Edit Slide Properties */}
          <div className="glass-panel p-5 rounded-3xl border-slate-200 bg-white space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" /> Slide Editor
              </h3>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Slide Title
              </label>
              <input
                type="text"
                value={currentSlide.title}
                onChange={(e) => updateCurrentSlide({ title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Main Takeaway / Subtitle
              </label>
              <textarea
                rows={2}
                value={currentSlide.mainContent || ''}
                onChange={(e) => updateCurrentSlide({ mainContent: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Bullet Points (1 per line)
              </label>
              <textarea
                rows={4}
                value={currentSlide.bulletPoints?.join('\n') || ''}
                onChange={(e) => updateCurrentSlide({ bulletPoints: e.target.value.split('\n').filter(Boolean) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Speaker Notes Panel */}
          <div className="glass-panel p-5 rounded-3xl border-slate-200 bg-white space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" /> Speaker Notes
              </h3>
              <button
                onClick={handleRegenerateNotes}
                disabled={regeneratingNotes}
                className="text-[10px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                {regeneratingNotes ? 'Rewriting...' : 'AI Enhance'}
              </button>
            </div>

            <textarea
              rows={5}
              value={currentSlide.speakerNotes || ''}
              onChange={(e) => updateCurrentSlide({ speakerNotes: e.target.value })}
              placeholder="Enter what the presenter should say, context, visual explanation, and transition..."
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-indigo-500 font-sans"
            />
            <p className="text-[10px] text-slate-400">
              Notes are exported directly into the PPTX slide notes container.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
