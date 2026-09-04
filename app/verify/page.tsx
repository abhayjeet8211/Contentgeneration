'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';

interface VerificationResponse {
  exact_match: boolean;
  matching_content_id: string | null;
  matching_project_id?: string | null;
  similarity_score: number;
  confidence: 'high' | 'medium' | 'low' | 'very_low';
  fingerprint_algorithm: string;
  fingerprint_version: string;
  submitted_fingerprint: string;
  submitted_simhash?: string;
  matched_fingerprint?: string | null;
  hamming_distance?: number;
  message: string;
}

export default function VerificationPage() {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('text');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/provenance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          contentType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Verification request failed');
      }

      const data: VerificationResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to verify content');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">High Confidence</span>;
      case 'medium':
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">Medium Confidence</span>;
      case 'low':
        return <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">Low Confidence</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">No Significant Match</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Phase 3B Content Provenance
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Content Verification Studio
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Verify the authenticity, cryptographic identity, and structural similarity of generated content assets against the platform provenance registry.
          </p>
        </div>

        {/* Verification Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleVerify} className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <label htmlFor="verify-content-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paste Content or Structured Asset
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Format:</span>
                <select
                  id="content-type-select"
                  aria-label="Format"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="text">Plain Text / Markdown</option>
                  <option value="LINKEDIN">LinkedIn Post</option>
                  <option value="TWITTER_THREAD">Twitter Thread</option>
                  <option value="BLOG">Blog Post / Article</option>
                  <option value="VIDEO">Video Package (JSON)</option>
                  <option value="PRESENTATION">Presentation (JSON)</option>
                  <option value="INFOGRAPHIC">Infographic (JSON)</option>
                </select>
              </div>
            </div>

            <textarea
              id="verify-content-input"
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste generated text, article, social post, or structured JSON package to verify provenance and similarity..."
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Submitted content is canonicalized prior to SHA-256 and SimHash comparison.</span>
              </div>
              <button
                id="verify-btn"
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Verify Provenance
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results Section */}
          {result && (
            <div className="pt-6 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-brand-600" /> Provenance Verification Report
                </h2>
                {getConfidenceBadge(result.confidence)}
              </div>

              {/* Exact Match Status Banner */}
              {result.exact_match ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-900">Exact Content Match Verified</p>
                    <p className="text-xs text-emerald-700">
                      This content asset matches a registered cryptographic SHA-256 fingerprint in the platform provenance registry with 100% integrity.
                    </p>
                    {result.matching_content_id && (
                      <p className="text-[11px] font-mono text-emerald-800 pt-1">
                        Asset Reference: {result.matching_content_id}
                      </p>
                    )}
                  </div>
                </div>
              ) : result.similarity_score >= 0.65 ? (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-amber-900">Potential Provenance Match Found</p>
                    <p className="text-xs text-amber-700">
                      Exact cryptographic match not found, but high heuristic similarity detected with an existing platform asset.
                    </p>
                    {result.matching_content_id && (
                      <p className="text-[11px] font-mono text-amber-800 pt-1">
                        Related Candidate: {result.matching_content_id}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800">No Provenance Match Recorded</p>
                    <p className="text-xs text-slate-600">
                      Neither exact cryptographic fingerprint nor significant similarity profile matches were identified for this content.
                    </p>
                  </div>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Exact Match</p>
                  <p className={`text-xl font-black mt-1 ${result.exact_match ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {result.exact_match ? 'YES' : 'NO'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Similarity Score</p>
                  <p className="text-xl font-black text-brand-600 mt-1">
                    {Math.round(result.similarity_score * 100)}%
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Hamming Distance</p>
                  <p className="text-xl font-black text-slate-700 mt-1">
                    {result.hamming_distance !== undefined ? `${result.hamming_distance}/64` : 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Algorithm</p>
                  <p className="text-sm font-black text-slate-700 mt-1.5">
                    {result.fingerprint_algorithm} v{result.fingerprint_version}
                  </p>
                </div>
              </div>

              {/* Fingerprint Inspection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Submitted Canonical SHA-256</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(result.submitted_fingerprint);
                      setCopiedHash(true);
                      setTimeout(() => setCopiedHash(false), 2000);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-700 flex items-center gap-1 transition-colors"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    {copiedHash ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="font-mono text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-800 break-all select-all">
                  {result.submitted_fingerprint}
                </p>
              </div>

              {/* Disclaimer Notice */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-500" /> Technical Limitation & Heuristic Advisory
                </p>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Cryptographic SHA-256 verifies exact canonical equivalence. SimHash similarity is a probabilistic, heuristic metric based on token shingle Hamming distance. High similarity does not constitute proof of copying or copyright infringement.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
