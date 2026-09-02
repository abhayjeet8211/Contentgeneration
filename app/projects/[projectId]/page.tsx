'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  FolderKanban,
  FileText,
  Layers,
  Sparkles,
  ShieldCheck,
  Plus,
  ArrowRight,
  Edit3,
  Video,
  Presentation,
  BarChart3,
  CheckCircle2,
  Linkedin,
  Twitter,
  Instagram,
  FileSpreadsheet,
  Film,
  Mail,
  Copy,
  Youtube,
  Radio,
  Globe,
  ExternalLink,
  RefreshCw,
  Clock,
} from 'lucide-react';

interface ProjectDetail {
  id: string;
  title: string;
  description?: string;
  sources: {
    id: string;
    title: string;
    sourceType: string;
    sourceUrl?: string;
    rawContent: string;
    processingStatus: string;
    createdAt: string;
    contentIntelligence?: {
      id: string;
      title?: string;
      summary: string;
      keyFacts: string; // JSON string
      claims?: string; // JSON string
      keyEntities?: string;
      topics?: string;
      statistics?: string; // JSON string
      sentiment: string;
      sourceReferences?: Array<{
        factOrClaim: string;
        sourceType: string;
        location: string;
        quote?: string;
        speaker?: string;
      }>;
    };
    analysis?: {
      summary: string;
      keyFacts: string;
      keyEntities: string;
      topics: string;
      sentiment: string;
    };
  }[];
  generations: {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    generatedContents: {
      id: string;
      format: string;
      platform: string;
      title: string;
      content: string;
      tone?: string;
      audience?: string;
      validation?: {
        factScore: number;
        formatComplianceScore: number;
      };
    }[];
  }[];
}

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTraceItem, setActiveTraceItem] = useState<any | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchProject = () => {
    fetch(`/api/projects/${params.projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProject();
  }, [params.projectId]);

  const handleRetryFormat = async (contentId: string, format: string) => {
    setRetryingId(contentId);
    try {
      const res = await fetch('/api/generation/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId, format }),
      });
      if (res.ok) {
        fetchProject();
      }
    } catch (err) {
      console.error('Retry error:', err);
    } finally {
      setRetryingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Loading Content Intelligence Workspace...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Workspace Not Found</h2>
          <Link href="/projects" className="text-xs text-brand-600 font-semibold hover:underline">
            ← Back to Workspaces
          </Link>
        </div>
      </div>
    );
  }

  const latestSource = project.sources?.[0];
  const intel = latestSource?.contentIntelligence;

  // Parse structured items safely
  const parsedFacts: any[] = intel?.keyFacts
    ? JSON.parse(intel.keyFacts)
    : latestSource?.analysis?.keyFacts
    ? JSON.parse(latestSource.analysis.keyFacts)
    : [];

  const parsedStats: any[] = intel?.statistics ? JSON.parse(intel.statistics) : [];
  const parsedClaims: any[] = intel?.claims ? JSON.parse(intel.claims) : [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-600 font-semibold mb-1">
              <Link href="/projects" className="hover:underline">Workspaces</Link>
              <span>/</span>
              <span className="text-slate-500">{project.title}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <FolderKanban className="w-8 h-8 text-brand-600" />
              {project.title}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              {project.description || 'One source • Persistent Content Intelligence representation • Multi-output packages'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Transform New Source
            </Link>
          </div>
        </div>

        {/* Source Traceability Popover Modal */}
        {activeTraceItem && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Source Traceability
                </div>
                <button
                  onClick={() => setActiveTraceItem(null)}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fact / Metric</span>
                <p className="text-sm font-bold text-slate-900">{activeTraceItem.fact || activeTraceItem.metric || activeTraceItem.claim}</p>

                <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase block">Source Citation</span>
                  <p className="text-xs font-mono text-emerald-800 font-semibold">
                    📍 {activeTraceItem.timestamp ? `Timestamp ${activeTraceItem.timestamp} in Video` : activeTraceItem.page ? `Page ${activeTraceItem.page} in Document` : activeTraceItem.citation || activeTraceItem.sourceRef || 'Verified in Source Repository'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTraceItem(null)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Close Trace View
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Source Information & Persistent Content Intelligence */}
          <div className="lg:col-span-5 space-y-6">
            {/* Source Ingestion Card */}
            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-600" /> Source Document
                </h2>
                <div className="flex items-center gap-1.5">
                  {latestSource?.sourceType === 'YOUTUBE' && <Youtube className="w-4 h-4 text-red-500" />}
                  {latestSource?.sourceType === 'PODCAST' && <Radio className="w-4 h-4 text-purple-500" />}
                  {latestSource?.sourceType === 'WEBPAGE' && <Globe className="w-4 h-4 text-emerald-500" />}
                  <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                    {latestSource?.sourceType || 'TEXT'}
                  </span>
                </div>
              </div>

              {latestSource ? (
                <div className="space-y-2.5">
                  <h3 className="text-sm font-bold text-slate-900">{latestSource.title}</h3>
                  {latestSource.sourceUrl && (
                    <a
                      href={latestSource.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-sky-600 hover:underline flex items-center gap-1 font-mono truncate"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{latestSource.sourceUrl}</span>
                    </a>
                  )}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed line-clamp-5">
                    {latestSource.rawContent}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No source uploaded yet.</p>
              )}
            </div>

            {/* Structured Content Intelligence Representation */}
            {(intel || latestSource?.analysis) && (
              <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-gradient-to-b from-white to-slate-50/80 space-y-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-600" /> Content Intelligence
                  </h2>
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Single-Source Truth
                  </span>
                </div>

                {/* Summary */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1.5">Executive Summary</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                    {intel?.summary || latestSource?.analysis?.summary}
                  </p>
                </div>

                {/* Traceable Key Facts */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Extracted Key Facts</h4>
                    <span className="text-[10px] text-slate-400">Click to trace citation</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    {parsedFacts.map((item, i) => {
                      const factText = typeof item === 'string' ? item : item.fact;
                      return (
                        <li
                          key={i}
                          onClick={() => setActiveTraceItem(typeof item === 'object' ? item : { fact: factText, citation: 'Source Context' })}
                          className="flex items-start gap-2 p-2 rounded-xl hover:bg-white hover:border-brand-200 border border-transparent transition-all cursor-pointer group"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <span className="text-slate-800 leading-relaxed">{factText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Empirical Statistics */}
                {parsedStats.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400 mb-1.5">Verified Statistics</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {parsedStats.map((st, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveTraceItem(st)}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 cursor-pointer transition-all"
                        >
                          <span className="text-[10px] font-semibold text-slate-400 uppercase block">{st.metric}</span>
                          <span className="text-base font-extrabold text-emerald-600">{st.value}</span>
                          <p className="text-[10px] text-slate-600 truncate">{st.statistic}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Adapted Outputs Hierarchy & Workspaces */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" /> Multi-Output Adapted Packages
              </h2>
              <span className="text-xs text-slate-500 font-semibold">
                {project.generations?.reduce((acc, g) => acc + (g.generatedContents?.length || 0), 0) || 0} Total Generated Artifacts
              </span>
            </div>

            {project.generations?.length === 0 ? (
              <div className="glass-panel p-10 rounded-3xl border-slate-200 bg-white text-center space-y-4 shadow-sm">
                <Layers className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">No Outputs Generated Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Run the multimodal pipeline to adapt this source into Video Packages, Presentation Decks, Infographics, and LinkedIn posts simultaneously.
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" /> Run 1-Source Transformation
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {project.generations.map((gen) => (
                  <div key={gen.id} className="glass-panel p-6 rounded-3xl border-slate-200 bg-white space-y-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{gen.title}</h3>
                        <span className="text-[11px] text-slate-400">
                          {new Date(gen.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Generated simultaneously
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {gen.generatedContents?.map((item) => {
                        const isVideo = item.format === 'VIDEO' || item.format === 'VIDEO_SCRIPT';
                        const isPresentation = item.format === 'PRESENTATION';
                        const isInfographic = item.format === 'INFOGRAPHIC';

                        return (
                          <div
                            key={item.id}
                            className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-brand-300 hover:bg-white transition-all shadow-xs space-y-3"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                                  isVideo ? 'bg-amber-50 text-amber-800 border-amber-200' :
                                  isPresentation ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                                  isInfographic ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                  'bg-brand-50 text-brand-800 border-brand-200'
                                }`}>
                                  {item.platform}
                                </span>

                                {item.validation && (
                                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    {item.validation.factScore}% Fact Score
                                  </span>
                                )}
                              </div>

                              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                              <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                                {item.content}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">Tone: {item.tone || 'Adapted'}</span>

                              {/* Workspace Action Buttons */}
                              <div className="flex items-center gap-2">
                                {isVideo ? (
                                  <Link
                                    href={`/video/${item.id}`}
                                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                                  >
                                    <Video className="w-3.5 h-3.5" /> Video Studio
                                  </Link>
                                ) : isPresentation ? (
                                  <Link
                                    href={`/presentation/${item.id}`}
                                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                                  >
                                    <Presentation className="w-3.5 h-3.5" /> Slide Studio
                                  </Link>
                                ) : isInfographic ? (
                                  <Link
                                    href={`/infographic/${item.id}`}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                                  >
                                    <BarChart3 className="w-3.5 h-3.5" /> Infographic Studio
                                  </Link>
                                ) : (
                                  <Link
                                    href={`/editor/${item.id}`}
                                    className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit Studio
                                  </Link>
                                )}

                                <button
                                  onClick={() => handleRetryFormat(item.id, item.format)}
                                  disabled={retryingId === item.id}
                                  title="Regenerate this specific output format"
                                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
                                >
                                  <RefreshCw className={`w-3.5 h-3.5 ${retryingId === item.id ? 'animate-spin text-brand-600' : ''}`} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
