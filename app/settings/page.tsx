'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Settings as SettingsIcon, Cpu, Key, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-200">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-7 h-7 text-brand-600" />
            Platform Settings & AI Providers
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure Google Gemini API keys, provider abstraction model selection, and storage defaults.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        {/* AI Provider Config */}
        <form onSubmit={handleSave} className="glass-panel p-6 lg:p-8 rounded-3xl border-slate-200 bg-white space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-600" /> AI Provider Configuration
            </h2>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 w-fit">
              Active Provider: {apiKey ? 'Google Gemini API' : 'Built-in Intelligent Engine (Mock Mode)'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Google Gemini API Key
            </label>
            <div className="relative">
              <Key className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
                placeholder="AIzaSy..."
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Leave empty to automatically use the built-in Intelligent Mock Engine for zero-config offline testing.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Gemini Model Selection
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="gemini-1.5-flash">gemini-1.5-flash (Recommended for speed)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (High intelligence & reasoning)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (Experimental next-gen)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> Save Settings
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
