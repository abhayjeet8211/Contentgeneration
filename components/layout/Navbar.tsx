'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Plus, FolderKanban, Video, LayoutTemplate, Settings, LogOut, User as UserIcon, Layers, ShieldCheck } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 px-4 lg:px-8 py-3 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight flex items-center gap-2">
              <span className="text-slate-900">OmniContent</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 font-semibold">
                AI Platform
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">One Source → Multi-Format Outputs</p>
          </div>
        </Link>

        {/* Navigation Links for Authenticated / App mode */}
        {!isPublicPage && (
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80">
            <Link
              href="/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                pathname === '/dashboard'
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/create"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                pathname === '/create'
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Plus className="w-4 h-4" />
              Create Content
            </Link>
            <Link
              href="/projects"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                pathname.startsWith('/projects')
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              Projects
            </Link>
            <Link
              href="/video/demo"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                pathname.startsWith('/video')
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Video className="w-4 h-4" />
              Video Studio
            </Link>
            <Link
              href="/templates"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                pathname === '/templates'
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              Templates
            </Link>
            <Link
              href="/verify"
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                pathname === '/verify'
                  ? 'bg-white text-brand-600 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Verify
            </Link>
          </nav>
        )}

        {/* Right Actions / User Profile */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/create"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-medium text-sm hover:brightness-105 shadow-md shadow-brand-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                New Generation
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  title="Settings"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-semibold text-xs">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name || 'Account'}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[110px]">{user.email}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-600/20 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
