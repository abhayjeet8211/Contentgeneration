import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Cpu, Zap, FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-surface-800/80 bg-surface-950 mt-auto py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">OmniContent AI</span>
          </div>
          <p className="text-sm text-surface-400 max-w-sm leading-relaxed">
            The enterprise-grade Content Intelligence platform. Understand source documents once and adapt narratives simultaneously across social media, blogs, briefings, scripts, and video.
          </p>
          <div className="flex items-center gap-4 text-xs text-surface-400 pt-2">
            <span className="flex items-center gap-1 text-accent-emerald">
              <ShieldCheck className="w-4 h-4" /> 100% Factual Consistency Verification
            </span>
            <span className="flex items-center gap-1 text-brand-300">
              <Cpu className="w-4 h-4" /> Powered by Gemini API & AI Provider Engine
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform Formats</h4>
          <ul className="space-y-2 text-sm text-surface-400">
            <li>LinkedIn Posts & Articles</li>
            <li>Twitter / X Threads</li>
            <li>Instagram Visual Captions</li>
            <li>Executive Briefings & Reports</li>
            <li>Short-Form & Scene Video Scripts</li>
            <li>Custom Tailored Formats</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Product Workflow</h4>
          <ul className="space-y-2 text-sm text-surface-400">
            <li><Link href="/create" className="hover:text-white transition-colors">1. Source Document Input</Link></li>
            <li><Link href="/create" className="hover:text-white transition-colors">2. Intelligence Extraction</Link></li>
            <li><Link href="/create" className="hover:text-white transition-colors">3. Multi-Output Generation</Link></li>
            <li><Link href="/editor/demo" className="hover:text-white transition-colors">4. AI Post Studio Editor</Link></li>
            <li><Link href="/video/demo" className="hover:text-white transition-colors">5. Canvas Video Studio MVP</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-surface-900 flex flex-col sm:flex-row items-center justify-between text-xs text-surface-500 gap-4">
        <p>© 2026 OmniContent AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-surface-300 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-surface-300 cursor-pointer">Terms of Service</span>
          <span className="hover:text-surface-300 cursor-pointer">API Documentation</span>
        </div>
      </div>
    </footer>
  );
}
