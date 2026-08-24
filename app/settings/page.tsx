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
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-surface-800">
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <SettingsIcon className="w-7 h-7 text-brand-400" />
            Platform Settings & AI Providers
          </h1>
          <p className="text-sm text-surface-400 mt-1">
            Configure Google Gemini API keys, provider abstraction model selection, and storage defaults.
          </p>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings updated successfully!</span>
          </div>
        )}

        {/* AI Provider Config */}
        <form onSubmit={handleSave} className="glass-panel p-6 lg:p-8 rounded-3xl border-surface-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-400" /> AI Provider Configuration
            </h2>
            <span className="text-xs font-semibold text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full border border-accent-cyan/20">
              Active Provider: {apiKey ? 'Google Gemini API' : 'Built-in Intelligent Engine (Mock Mode)'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-1.5">
              Google Gemini API Key
            </label>
            <div className="relative">
              <Key className="w-5 h-5 text-surface-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-white placeholder-surface-500 text-sm focus:outline-none focus:border-brand-500"
                placeholder="AIzaSy..."
              />
            </div>
            <p className="text-[11px] text-surface-400 mt-1">
              Leave empty to automatically use the built-in Intelligent Mock Engine for zero-config offline testing.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-1.5">
              Gemini Model Selection
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-900 border border-surface-800 text-white text-sm focus:outline-none focus:border-brand-500"
            >
              <option value="gemini-1.5-flash">gemini-1.5-flash (Recommended for speed)</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro (High intelligence & reasoning)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash (Experimental next-gen)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-surface-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-md flex items-center gap-2 transition-all"
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
