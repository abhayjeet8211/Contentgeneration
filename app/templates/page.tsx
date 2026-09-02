'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  LayoutTemplate,
  Search,
  Plus,
  ArrowRight,
  Linkedin,
  Twitter,
  Instagram,
  FileSpreadsheet,
  Film,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface TemplateItem {
  id?: string;
  name: string;
  category: string;
  description: string;
  format: string;
  defaultTone?: string;
  defaultAudience?: string;
  templatePrompt: string;
  isSystem?: boolean;
}

const CATEGORIES = ['All', 'LinkedIn', 'Marketing', 'Professional', 'Social Media', 'Video', 'Announcement'];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Custom Template Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('LINKEDIN');
  const [templatePrompt, setTemplatePrompt] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTemplates = () => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTemplates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !templatePrompt) return;

    setSaving(true);
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, description, format, templatePrompt }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setName('');
        setDescription('');
        setTemplatePrompt('');
        fetchTemplates();
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <LayoutTemplate className="w-7 h-7 text-brand-600" />
              Content Template Library
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Browse pre-configured prompt structures for LinkedIn, Executive Briefings, Twitter Threads, and Video Scripts.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Save Custom Template
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-2xl border border-slate-200">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-brand-600 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-brand-500 shadow-sm"
              placeholder="Search templates..."
            />
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="glass-panel p-12 rounded-3xl border-slate-200 bg-white text-center text-slate-500 text-sm">
            Loading template library...
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl border-slate-200 bg-white text-center text-slate-500 text-sm">
            No templates matching selected criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl, i) => (
              <div
                key={tpl.id || i}
                className="glass-panel glass-panel-hover p-6 rounded-3xl border-slate-200 bg-white flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full">
                      {tpl.category}
                    </span>
                    {tpl.isSystem && (
                      <span className="text-[10px] text-sky-700 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-sky-600" /> System Default
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{tpl.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{tpl.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">Tone: {tpl.defaultTone || 'Professional'}</span>
                  <Link
                    href="/create"
                    className="px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    Use Template <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Template Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">Save Custom Template</h3>

              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Template Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500"
                    placeholder="e.g. Weekly Tech Newsletter Hook"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500"
                    placeholder="Brief description of format..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Prompt Instructions</label>
                  <textarea
                    rows={3}
                    required
                    value={templatePrompt}
                    onChange={(e) => setTemplatePrompt(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-brand-500"
                    placeholder="Instructions for generating output..."
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
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md"
                  >
                    {saving ? 'Saving...' : 'Save Template'}
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
