'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Sparkles, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border-surface-800 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
            <p className="text-sm text-surface-400 mt-1">We'll send password recovery instructions to your email</p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-accent-emerald mx-auto" />
              <h3 className="font-bold text-white text-base">Check Your Inbox</h3>
              <p className="text-xs text-surface-300">
                If an account exists for <span className="text-white font-semibold">{email}</span>, a password reset link has been dispatched.
              </p>
              <Link href="/login" className="inline-block pt-3 text-xs text-brand-400 font-semibold hover:text-brand-300">
                ← Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-surface-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-surface-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-900/80 border border-surface-800 text-white placeholder-surface-500 focus:outline-none focus:border-brand-500 text-sm transition-colors"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/25 transition-all flex items-center justify-center gap-2 mt-6"
              >
                Send Recovery Email
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-surface-800 text-center text-xs text-surface-400">
            Remember password?{' '}
            <Link href="/login" className="text-brand-400 font-semibold hover:text-brand-300">
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
