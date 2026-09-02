'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  Film,
  Play,
  Pause,
  Plus,
  Trash2,
  Copy,
  ArrowLeft,
  Video,
  Download,
  Layers,
  Sparkles,
  Type,
  Music,
  CheckCircle2,
  Clock,
  Camera,
  FileText,
  Subtitles,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface StoryboardScene {
  sceneNumber: number;
  startTime: number;
  endTime: number;
  duration: number;
  narration: string;
  visual: string;
  onScreenText?: string;
  cameraFraming?: string;
  transition?: string;
  audio?: string;
  subject?: string;
  environment?: string;
}

interface SubtitleItem {
  start: number;
  end: number;
  text: string;
}

interface VideoContentPackage {
  concept: {
    title: string;
    hook: string;
    targetAudience: string;
    objective: string;
    recommendedDuration: string;
    tone: string;
    format: string;
  };
  script: {
    hook: string;
    introduction: string;
    mainSections: Array<{ heading: string; body: string; visualCue?: string }>;
    conclusion: string;
    callToAction: string;
    fullText: string;
  };
  storyboard: StoryboardScene[];
  sceneDescriptions: Array<{
    sceneNumber: number;
    subject: string;
    environment: string;
    composition: string;
    cameraRecommendation: string;
    motion: string;
    supportingGraphics: string;
  }>;
  narration: Array<{
    sceneNumber: number;
    text: string;
    timing: string;
    speakingStyle: string;
    tone: string;
  }>;
  subtitles: SubtitleItem[];
  visualRecommendations: Array<{
    type: string;
    description: string;
    sceneNumber?: number;
  }>;
  musicRecommendations: {
    style: string;
    energy: string;
    mood: string;
    transitions: string;
  };
}

export default function VideoEditorPage({ params }: { params: { videoId: string } }) {
  const [content, setContent] = useState<any>(null);
  const [pkg, setPkg] = useState<VideoContentPackage | null>(null);
  const [activeTab, setActiveTab] = useState<'STORYBOARD' | 'SCRIPT' | 'SUBTITLES' | 'ASSETS'>('STORYBOARD');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [copiedScript, setCopiedScript] = useState(false);
  const [exportingSubtitles, setExportingSubtitles] = useState(false);

  // Playback state for canvas preview
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetch(`/api/content/${params.videoId}`)
      .then((res) => res.json())
      .then((data) => {
        setContent(data);
        if (data.packageData) {
          try {
            const parsed = typeof data.packageData === 'string' ? JSON.parse(data.packageData) : data.packageData;
            setPkg(parsed);
          } catch (e) {
            console.error('Error parsing video package data:', e);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        // Fetch legacy video projects if not contentId
        fetch(`/api/video/${params.videoId}`)
          .then((r) => r.json())
          .then((d) => {
            setContent(d);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      });
  }, [params.videoId]);

  // Fallback demo package
  const activePackage: VideoContentPackage = pkg || {
    concept: {
      title: content?.title || '60s Video Explainer: Intelligence Breakdown',
      hook: 'What if you could turn complex intelligence into instant communication?',
      targetAudience: 'Executive Leaders & Technical Innovators',
      objective: 'Drive strategic adoption and awareness',
      recommendedDuration: '60 Seconds',
      tone: 'Authoritative & Engaging',
      format: 'Short-Form Video / Explainer',
    },
    script: {
      hook: 'What if you could turn complex intelligence into instant communication in under a minute?',
      introduction: content?.content?.slice(0, 200) || 'Recent audits reveal significant shifts across operational benchmarks.',
      mainSections: [
        {
          heading: 'Core Impact',
          body: 'Deploying continuous behavioral telemetry mitigated 96% of unauthorized intrusions, saving $2.4M on average.',
          visualCue: 'Cut to dynamic 3D bar chart with glowing metric counters',
        },
      ],
      conclusion: 'Single-source intelligence ensures zero cross-channel drift.',
      callToAction: 'Read the comprehensive advisory report today.',
      fullText: content?.content || `[HOOK]\nWhat if you could turn complex intelligence into instant communication?\n\n[SUMMARY]\nContinuous behavioral telemetry mitigates 96% of unauthorized intrusions.\n\n[CTA]\nRead the full advisory today.`,
    },
    storyboard: [
      {
        sceneNumber: 1,
        startTime: 0,
        endTime: 5,
        duration: 5,
        narration: 'What if you could turn complex intelligence into instant communication in under a minute?',
        visual: 'Kinetic title sequence with glowing obsidian nodes and high-speed motion lines.',
        onScreenText: 'INTELLIGENCE ACCELERATED 2026',
        cameraFraming: 'Dynamic Push-In',
        transition: 'Whip Pan Right',
        audio: 'Impact sub-bass drop with rising synth pulse',
        subject: 'AI Intelligence Node Network',
        environment: 'Sleek Cyber Glass Studio',
      },
      {
        sceneNumber: 2,
        startTime: 5,
        endTime: 25,
        duration: 20,
        narration: 'Organizations deploying continuous behavioral telemetry mitigated 96% of intrusion attempts.',
        visual: 'Presenter stands beside floating holographic data cards showcasing core insights.',
        onScreenText: '96% MITIGATION RATE',
        cameraFraming: 'Medium 3/4 Profile',
        transition: 'Cross Dissolve',
        audio: 'Clean modern electronic rhythm at 115 BPM',
        subject: 'Presenter & Data HUD',
        environment: 'Modern Command Center',
      },
    ],
    sceneDescriptions: [
      {
        sceneNumber: 1,
        subject: 'Kinetic Neural Grid',
        environment: 'Deep Obsidian Space',
        composition: 'Focal node in golden ratio',
        cameraRecommendation: 'Cinema 35mm Prime f/1.4',
        motion: 'Fast push-in',
        supportingGraphics: 'Cyan and Indigo Particle Beams',
      },
    ],
    narration: [
      {
        sceneNumber: 1,
        text: 'What if you could turn complex intelligence into instant communication in under a minute?',
        timing: '00:00 - 00:05',
        speakingStyle: 'Intriguing, energetic hook',
        tone: 'Authoritative',
      },
    ],
    subtitles: [
      { start: 0.0, end: 4.8, text: 'What if you could turn complex intelligence into instant communication?' },
      { start: 5.0, end: 12.5, text: 'Deploying behavioral telemetry mitigated 96% of intrusions.' },
    ],
    visualRecommendations: [
      { type: 'ANIMATION', description: '3D glowing network nodes pulsing with energy', sceneNumber: 1 },
      { type: 'CHART', description: 'Radial progress gauge filling to 96%', sceneNumber: 2 },
    ],
    musicRecommendations: {
      style: 'Futuristic Corporate Electronic / Synthwave Minimal',
      energy: 'High Opening → Steady Informative → Inspiring Finish',
      mood: 'Confident, Innovative, Premium',
      transitions: 'Drop at scene 1 cut, subtle build at scene 2 metric reveal',
    },
  };

  const activeScene = activePackage.storyboard[activeSceneIndex] || activePackage.storyboard[0];

  // Canvas render loop
  useEffect(() => {
    if (!canvasRef.current || !activeScene) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Glowing circle effect
    ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 3, 140, 0, Math.PI * 2);
    ctx.fill();

    // Scene on-screen text
    if (activeScene.onScreenText) {
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fillText(activeScene.onScreenText, canvas.width / 2, canvas.height / 2 - 40);
    }

    // Subtitle / Narration pill
    if (activeScene.narration) {
      ctx.font = '500 20px Inter, sans-serif';
      const text = `"${activeScene.narration.slice(0, 60)}..."`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - textWidth / 2 - 20, canvas.height - 130, textWidth + 40, 50, 16);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.fillText(text, canvas.width / 2, canvas.height - 98);
    }
  }, [activeScene]);

  const handleDownloadSubtitles = async (format: 'srt' | 'vtt') => {
    setExportingSubtitles(true);
    try {
      const res = await fetch('/api/export/subtitles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtitles: activePackage.subtitles,
          format,
          title: activePackage.concept.title.replace(/[^a-zA-Z0-9]/g, '_'),
        }),
      });

      if (!res.ok) throw new Error('Failed to export subtitles');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activePackage.concept.title.replace(/[^a-zA-Z0-9]/g, '_')}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    } finally {
      setExportingSubtitles(false);
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(activePackage.script.fullText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
          Loading Video Content Package Studio...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      {/* Top Studio Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={content?.generation?.projectId ? `/projects/${content.generation.projectId}` : '/projects'}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-amber-600" />
              <h1 className="text-sm font-bold text-slate-900 line-clamp-1">{activePackage.concept.title}</h1>
              <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                {activePackage.concept.recommendedDuration} • {activePackage.concept.format}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Video Content Package & Storyboard Studio</p>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('STORYBOARD')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'STORYBOARD' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Storyboard ({activePackage.storyboard?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('SCRIPT')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'SCRIPT' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Script
            </button>
            <button
              onClick={() => setActiveTab('SUBTITLES')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'SUBTITLES' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Subtitles className="w-3.5 h-3.5" /> Subtitles (SRT/VTT)
            </button>
            <button
              onClick={() => setActiveTab('ASSETS')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'ASSETS' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              <Music className="w-3.5 h-3.5" /> Music & Visuals
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Concept Metadata Card */}
        <div className="glass-panel p-5 rounded-3xl border-slate-200 bg-white shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Hook</span>
            <p className="font-semibold text-slate-800 mt-0.5">{activePackage.concept.hook}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Audience</span>
            <p className="font-semibold text-slate-800 mt-0.5">{activePackage.concept.targetAudience}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Objective</span>
            <p className="font-semibold text-slate-800 mt-0.5">{activePackage.concept.objective}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tone</span>
            <p className="font-semibold text-slate-800 mt-0.5">{activePackage.concept.tone}</p>
          </div>
        </div>

        {/* TAB 1: STORYBOARD WORKSPACE */}
        {activeTab === 'STORYBOARD' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Canvas Scene Preview */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="glass-panel p-5 rounded-3xl border-slate-200 bg-white space-y-4 w-full flex flex-col items-center shadow-sm">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-300 aspect-[9/16] w-[260px] bg-slate-900">
                  <canvas ref={canvasRef} width={540} height={960} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] text-white font-mono">
                    Scene #{activeScene.sceneNumber} • {activeScene.duration}s
                  </div>
                </div>

                <div className="w-full text-center space-y-1">
                  <p className="text-xs font-bold text-slate-900">{activeScene.onScreenText || 'Scene Visual'}</p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Timing: {activeScene.startTime}s - {activeScene.endTime}s
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Storyboard Scene Cards */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Film className="w-4 h-4 text-amber-600" /> Storyboard Breakdown ({activePackage.storyboard.length} Scenes)
                </h3>
              </div>

              <div className="space-y-3">
                {activePackage.storyboard.map((scene, idx) => {
                  const isSelected = idx === activeSceneIndex;
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveSceneIndex(idx)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">Scene #{scene.sceneNumber}</span>
                          <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            {scene.duration}s ({scene.startTime}s - {scene.endTime}s)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span>Framing: {scene.cameraFraming || 'Medium'}</span>
                          <span>•</span>
                          <span>Transition: {scene.transition || 'Fade'}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Narration</span>
                          <p className="text-slate-800 font-medium leading-relaxed">"{scene.narration}"</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Visual Description</span>
                          <p className="text-slate-600">{scene.visual}</p>
                        </div>
                        {scene.audio && (
                          <div className="text-[11px] text-amber-800 flex items-center gap-1.5 pt-1">
                            <Music className="w-3.5 h-3.5" />
                            <span>Audio Cue: {scene.audio}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TELEPROMPTER SCRIPT */}
        {activeTab === 'SCRIPT' && (
          <div className="glass-panel p-8 rounded-3xl border-slate-200 bg-white space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Production Video Script</h3>
                <p className="text-xs text-slate-500">Formatted for teleprompter, voiceover recording, and speech delivery.</p>
              </div>
              <button
                onClick={handleCopyScript}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" /> {copiedScript ? 'Copied to Clipboard!' : 'Copy Teleprompter Script'}
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
              {activePackage.script.fullText}
            </div>
          </div>
        )}

        {/* TAB 3: SUBTITLES (SRT / VTT) */}
        {activeTab === 'SUBTITLES' && (
          <div className="glass-panel p-8 rounded-3xl border-slate-200 bg-white space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Timed Subtitle Segments</h3>
                <p className="text-xs text-slate-500">Synced closed captions ready for YouTube, Premiere, Final Cut, and CapCut.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadSubtitles('srt')}
                  disabled={exportingSubtitles}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download .SRT
                </button>
                <button
                  onClick={() => handleDownloadSubtitles('vtt')}
                  disabled={exportingSubtitles}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download .VTT
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {activePackage.subtitles.map((sub, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-mono text-amber-700 font-bold shrink-0">
                    {sub.start.toFixed(1)}s → {sub.end.toFixed(1)}s
                  </span>
                  <span className="text-slate-800 font-medium px-4 text-left flex-1">{sub.text}</span>
                  <span className="text-[10px] text-slate-400 font-mono">#00{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ASSETS & MUSIC RECOMMENDATIONS */}
        {activeTab === 'ASSETS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-600" /> Visual Asset Recommendations
              </h3>
              <div className="space-y-2.5">
                {activePackage.visualRecommendations.map((asset, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <span className="font-bold text-indigo-700 text-[10px] uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {asset.type}
                    </span>
                    <p className="text-slate-800 mt-1">{asset.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border-slate-200 bg-white space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-600" /> Background Music & Audio Cues
              </h3>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 text-xs text-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">Recommended Style</span>
                  <p className="font-semibold text-slate-900">{activePackage.musicRecommendations.style}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">Energy Curve</span>
                  <p>{activePackage.musicRecommendations.energy}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">Mood & Transitions</span>
                  <p>{activePackage.musicRecommendations.mood} • {activePackage.musicRecommendations.transitions}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
