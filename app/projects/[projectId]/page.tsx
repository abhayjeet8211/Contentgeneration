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
  CheckCircle2,
  Linkedin,
  Twitter,
  Instagram,
  FileSpreadsheet,
  Film,
  Mail,
  Copy,
} from 'lucide-react';

interface ProjectDetail {
  id: string;
  title: string;
  description?: string;
  sources: {
    id: string;
    title: string;
    sourceType: string;
    rawContent: string;
    createdAt: string;
    analysis?: {
      summary: string;
      keyFacts: string; // JSON string
      keyEntities: string; // JSON string
      topics: string; // JSON string
      sentiment: string;
    };
  }[];
  generations: {
    id: string;
    title: string;
    createdAt: string;
    generatedContents: {
      id: string;
      format: string;
      platform: string;
      title: string;
      content: string;
      tone?: string;
      validation?: {
        factScore: number;
        formatComplianceScore: number;
      };
    }[];
  }[];
  videoProjects?: { id: string; title: string; duration: number }[];
}

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${params.projectId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) setProject(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.projectId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-surface-400 text-sm">
          Loading Content Workspace...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <h2 className="text-xl font-bold text-white">Workspace Not Found</h2>
          <Link href="/projects" className="text-xs text-brand-400 font-semibold">
            ← Back to Workspaces
          </Link>
        </div>
      </div>
    );
  }

  const latestSource = project.sources?.[0];
  const parsedFacts: string[] = latestSource?.analysis?.keyFacts
    ? JSON.parse(latestSource.analysis.keyFacts)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surface-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-400 font-semibold mb-1">
              <Link href="/projects" className="hover:underline">Workspaces</Link>
              <span>/</span>
              <span>Workspace Details</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FolderKanban className="w-7 h-7 text-brand-400" />
              {project.title}
            </h1>
            <p className="text-xs text-surface-400 mt-1">{project.description || 'Single-source content intelligence hub'}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Run New 1-Source Generation
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Source & Content Intelligence Analysis */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-400" /> Source Information
                </h2>
                <span className="text-[10px] font-bold text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded">
                  {latestSource?.sourceType || 'TEXT'}
                </span>
              </div>

              {latestSource ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">{latestSource.title}</h3>
                  <div className="p-3 bg-surface-900/90 rounded-xl border border-surface-800 text-xs text-surface-300 font-mono leading-relaxed line-clamp-6">
                    {latestSource.rawContent}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-surface-400">No source uploaded yet.</p>
              )}
            </div>

            {/* Content Intelligence Extraction Panel */}
            {latestSource?.analysis && (
              <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4 bg-gradient-to-b from-surface-900/90 to-brand-950/20">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-400" /> Content Intelligence
                  </h2>
                  <span className="text-xs text-accent-emerald font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Verified Analysis
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-surface-400 mb-1">Executive Summary</h4>
                    <p className="text-xs text-surface-200 leading-relaxed bg-surface-950/80 p-3 rounded-xl border border-surface-800/60">
                      {latestSource.analysis.summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold uppercase text-surface-400 mb-1">Extracted Key Facts</h4>
                    <ul className="space-y-1.5 text-xs text-surface-300">
                      {parsedFacts.map((fact, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Multi-Output Generations Hierarchy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-400" /> Adapted Outputs Hierarchy
              </h2>
              <span className="text-xs text-surface-400">
                {project.generations?.reduce((acc, g) => acc + (g.generatedContents?.length || 0), 0) || 0} Total Outputs
              </span>
            </div>

            {project.generations?.length === 0 ? (
              <div className="glass-panel p-8 rounded-3xl text-center space-y-3">
                <Layers className="w-10 h-10 text-surface-500 mx-auto" />
                <h3 className="text-base font-bold text-white">No Generations Yet</h3>
                <p className="text-xs text-surface-400 max-w-sm mx-auto">
                  Run the multi-output content pipeline to adapt this workspace's source into LinkedIn posts, video scripts, and executive briefings.
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-md"
                >
                  <Plus className="w-4 h-4" /> Run Pipeline
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {project.generations.map((gen) => (
                  <div key={gen.id} className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
                    <div className="flex items-center justify-between border-b border-surface-800/80 pb-3">
                      <h3 className="text-sm font-bold text-white">{gen.title}</h3>
                      <span className="text-[11px] text-surface-400">
                        {new Date(gen.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {gen.generatedContents?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-surface-900/90 p-4 rounded-2xl border border-surface-800 flex flex-col justify-between hover:border-brand-500/40 transition-colors"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-brand-300 uppercase tracking-wider bg-brand-500/20 px-2 py-0.5 rounded">
                                {item.platform}
                              </span>
                              {item.validation && (
                                <span className="text-[10px] text-accent-emerald font-semibold">
                                  {item.validation.factScore}% Fact Score
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-white line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-surface-400 line-clamp-3 leading-relaxed">
                              {item.content}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-surface-800 flex items-center justify-between">
                            <span className="text-[10px] text-surface-500">Tone: {item.tone || 'Adapted'}</span>
                            <div className="flex items-center gap-2">
                              {item.format === 'VIDEO_SCRIPT' ? (
                                <Link
                                  href={`/video/demo`}
                                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                                >
                                  <Video className="w-3.5 h-3.5" /> Video Studio
                                </Link>
                              ) : (
                                <Link
                                  href={`/editor/${item.id}`}
                                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Edit Studio
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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
