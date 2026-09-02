'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  FileText,
  Layers,
  Video,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  sources: { id: string; title: string; sourceType: string }[];
  generations: { id: string; generatedContents: { id: string; format: string; title: string }[] }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // New project modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc }),
      });
      if (res.ok) {
        setNewTitle('');
        setNewDesc('');
        setIsModalOpen(false);
        fetchProjects();
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this content workspace?')) return;

    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <FolderKanban className="w-7 h-7 text-brand-600" />
              Content Workspaces
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Organize your source documents, content intelligence analyses, multi-platform generations, and media assets.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Workspace
          </button>
        </div>

        {loading ? (
          <div className="glass-panel p-12 rounded-3xl border-slate-200 bg-white text-center text-slate-500 text-sm">
            Loading workspaces...
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border-slate-200 bg-white text-center space-y-4 shadow-sm">
            <FolderKanban className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Workspaces Found</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Create a workspace to group source documents and multi-format outputs together.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Workspace Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => {
              const totalOutputs = proj.generations?.reduce(
                (acc, g) => acc + (g.generatedContents?.length || 0),
                0
              );

              return (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.id}`}
                  className="glass-panel glass-panel-hover p-6 rounded-3xl border-slate-200 bg-white flex flex-col justify-between group relative shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full">
                        {proj.category || 'Workspace'}
                      </span>
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        title="Delete Workspace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {proj.description || 'Contains source documents and generated content.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>{proj.sources?.length || 0} Sources</span>
                      <span>•</span>
                      <span>{totalOutputs || 0} Outputs</span>
                    </div>
                    <span className="text-brand-600 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Create Workspace Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Create New Workspace</h3>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Workspace Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Q3 Strategic Advisory Campaign"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500"
                    placeholder="Brief overview of project goal..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md"
                  >
                    {creating ? 'Creating...' : 'Create Workspace'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
