'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Plus,
  Sparkles,
  FolderKanban,
  FileText,
  Layers,
  Video,
  LayoutTemplate,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Share2,
  FileSpreadsheet,
  Linkedin,
  Twitter,
  Instagram,
  Zap,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
  sources: { id: string }[];
  generations: { id: string }[];
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 lg:p-8 rounded-3xl glass-panel border-surface-800 bg-gradient-to-r from-surface-900 via-surface-900 to-brand-950/40 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Content Intelligence Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Content Operations Center
            </h1>
            <p className="text-surface-400 text-sm max-w-xl">
              Transform single research papers, advisories, or prompts into 6+ platform-optimized outputs simultaneously.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <Link
              href="/create"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold text-sm hover:brightness-110 shadow-lg shadow-brand-600/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New 1-Source Generation
            </Link>
          </div>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-panel p-5 rounded-2xl border-surface-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Active Workspaces</p>
              <h3 className="text-2xl font-black text-white mt-1">{projects.length || 3}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-surface-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Outputs Generated</p>
              <h3 className="text-2xl font-black text-accent-cyan mt-1">24</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 text-accent-cyan flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-surface-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Fact Precision Score</p>
              <h3 className="text-2xl font-black text-accent-emerald mt-1">98.5%</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-emerald/20 text-accent-emerald flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-surface-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Time Saved</p>
              <h3 className="text-2xl font-black text-accent-amber mt-1">18.5 hrs</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-accent-amber/20 text-accent-amber flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Quick Launch Action Banner */}
        <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" /> Quick Launch Studio Workflows
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/create"
              className="glass-panel glass-panel-hover p-4 rounded-2xl border-surface-800 flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  1-Source Multi-Output
                </h3>
                <p className="text-xs text-surface-400 mt-0.5">Upload PDF/Text & generate all platforms</p>
              </div>
            </Link>

            <Link
              href="/video/demo"
              className="glass-panel glass-panel-hover p-4 rounded-2xl border-surface-800 flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Canvas Video Studio
                </h3>
                <p className="text-xs text-surface-400 mt-0.5">Scene manager, subtitles & video export MVP</p>
              </div>
            </Link>

            <Link
              href="/templates"
              className="glass-panel glass-panel-hover p-4 rounded-2xl border-surface-800 flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center group-hover:scale-105 transition-transform">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-accent-purple transition-colors">
                  Template Library
                </h3>
                <p className="text-xs text-surface-400 mt-0.5">LinkedIn, Twitter, Video & Executive prompts</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Workspaces / Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-brand-400" /> Recent Content Workspaces
            </h2>
            <Link href="/projects" className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1">
              View All Workspaces →
            </Link>
          </div>

          {loading ? (
            <div className="glass-panel p-8 rounded-2xl text-center text-surface-400 text-sm">Loading workspaces...</div>
          ) : projects.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl text-center space-y-3">
              <FolderKanban className="w-10 h-10 text-surface-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Workspaces Created Yet</h3>
              <p className="text-xs text-surface-400 max-w-sm mx-auto">
                Create your first project to organize source documents and multi-platform outputs.
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 shadow-md"
              >
                <Plus className="w-4 h-4" /> Start Generation Workflow
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.id}`}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl border-surface-800 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded">
                        Workspace
                      </span>
                      <span className="text-[11px] text-surface-500">
                        {new Date(proj.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-surface-400 line-clamp-2">{proj.description || 'Source documents & generations'}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-800/80 flex items-center justify-between text-xs text-surface-400">
                    <span>{proj.sources?.length || 1} Sources</span>
                    <span className="text-brand-400 font-semibold flex items-center gap-1">
                      Open Project <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
