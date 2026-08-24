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
  Volume2,
  Video,
  Download,
  Layers,
  Sparkles,
  Type,
  Music,
  CheckCircle2,
  Clock,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

interface Scene {
  id: string;
  orderIndex: number;
  duration: number; // in seconds
  textOverlay: string;
  visualType: 'GRADIENT' | 'IMAGE' | 'COLOR';
  visualUrl?: string;
  captionData: string;
  transition: string;
}

interface VideoProject {
  id: string;
  title: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
  scenes: Scene[];
}

export default function VideoEditorPage({ params }: { params: { videoId: string } }) {
  const [video, setVideo] = useState<VideoProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Canvas ref for live rendering & MediaRecorder export
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/api/video/${params.videoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setVideo(data);
        } else {
          // Default fallback MVP video project
          const defaultVideo: VideoProject = {
            id: params.videoId,
            title: '60s Short-Form Video: AI Threat Intelligence Breakdown',
            duration: 13.0,
            width: 1080,
            height: 1920,
            fps: 30,
            scenes: [
              {
                id: 'sc-1',
                orderIndex: 0,
                duration: 4.0,
                textOverlay: '🚀 75% Faster Content Operations',
                visualType: 'GRADIENT',
                captionData: 'Stop spending 10 hours writing for 5 platforms manually!',
                transition: 'FADE',
              },
              {
                id: 'sc-2',
                orderIndex: 1,
                duration: 5.0,
                textOverlay: '⚡ Fact #1: 98% Fact Consistency',
                visualType: 'GRADIENT',
                captionData: 'One research source auto-generates all channel narratives.',
                transition: 'SLIDE',
              },
              {
                id: 'sc-3',
                orderIndex: 2,
                duration: 4.0,
                textOverlay: '🎯 Try OmniContent AI Today',
                visualType: 'GRADIENT',
                captionData: 'Subscribe & follow for daily content intelligence tips.',
                transition: 'FADE',
              },
            ],
          };
          setVideo(defaultVideo);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.videoId]);

  // Live Canvas Renderer Loop
  useEffect(() => {
    if (!video || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const activeScene = video.scenes[activeSceneIndex] || video.scenes[0];

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient based on scene index
    const gradients = [
      ['#4f46e5', '#06b6d4'],
      ['#a855f7', '#ec4899'],
      ['#10b981', '#3b82f6'],
    ];
    const pair = gradients[activeSceneIndex % gradients.length];
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, pair[0]);
    grad.addColorStop(1, pair[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle ambient particle circles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 3, 120, 0, Math.PI * 2);
    ctx.fill();

    // Draw Main Headline Text Overlay
    if (activeScene?.textOverlay) {
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 10;
      ctx.fillText(activeScene.textOverlay, canvas.width / 2, canvas.height / 2 - 40);
    }

    // Draw Captions / Subtitles Box
    if (activeScene?.captionData) {
      ctx.font = '500 22px Inter, sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';

      // Draw rounded background pill for subtitle
      const captionText = `"${activeScene.captionData}"`;
      const textWidth = ctx.measureText(captionText).width;
      ctx.fillStyle = 'rgba(9, 13, 22, 0.75)';
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - textWidth / 2 - 20, canvas.height - 140, textWidth + 40, 50, 16);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.fillText(captionText, canvas.width / 2, canvas.height - 106);
    }
  }, [video, activeSceneIndex, currentTime]);

  // Timeline Playback Animation Loop
  useEffect(() => {
    let animationTimer: NodeJS.Timeout;
    if (isPlaying && video) {
      animationTimer = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          const totalDur = video.scenes.reduce((acc, s) => acc + s.duration, 0);

          if (next >= totalDur) {
            setIsPlaying(false);
            return 0;
          }

          // Calculate which scene index corresponds to next time
          let accumulated = 0;
          for (let i = 0; i < video.scenes.length; i++) {
            accumulated += video.scenes[i].duration;
            if (next <= accumulated) {
              setActiveSceneIndex(i);
              break;
            }
          }
          return next;
        });
      }, 100);
    }

    return () => clearInterval(animationTimer);
  }, [isPlaying, video]);

  const handleUpdateScene = (index: number, updatedFields: Partial<Scene>) => {
    if (!video) return;
    const newScenes = [...video.scenes];
    newScenes[index] = { ...newScenes[index], ...updatedFields };

    const totalDuration = newScenes.reduce((acc, s) => acc + s.duration, 0);
    setVideo({ ...video, scenes: newScenes, duration: totalDuration });
  };

  const handleAddScene = () => {
    if (!video) return;
    const newScene: Scene = {
      id: `sc-${Date.now()}`,
      orderIndex: video.scenes.length,
      duration: 4.0,
      textOverlay: '✨ New Scene Title',
      visualType: 'GRADIENT',
      captionData: 'Add caption subtitle text here...',
      transition: 'FADE',
    };
    const updatedScenes = [...video.scenes, newScene];
    const totalDuration = updatedScenes.reduce((acc, s) => acc + s.duration, 0);
    setVideo({ ...video, scenes: updatedScenes, duration: totalDuration });
    setActiveSceneIndex(updatedScenes.length - 1);
  };

  const handleDeleteScene = (index: number) => {
    if (!video || video.scenes.length <= 1) return;
    const updatedScenes = video.scenes.filter((_, i) => i !== index);
    setVideo({ ...video, scenes: updatedScenes });
    setActiveSceneIndex(Math.max(0, index - 1));
  };

  const handleSimulateExport = () => {
    setExporting(true);
    setExportSuccess(false);

    setTimeout(() => {
      setExporting(false);
      setExportSuccess(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-surface-400 text-sm">
          Loading Canvas Video Studio...
        </div>
      </div>
    );
  }

  const activeScene = video?.scenes[activeSceneIndex] || video?.scenes[0];

  return (
    <div className="min-h-screen flex flex-col bg-surface-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-800">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-surface-900 border border-surface-800 text-surface-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">
                  9:16 Vertical Video Studio MVP
                </span>
                <span className="text-xs text-surface-400">• Total Duration: {video?.duration.toFixed(1)}s</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">{video?.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateExport}
              disabled={exporting}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-brand-600 text-white font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 flex items-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              {exporting ? 'Rendering MP4 Scene...' : 'Export Video MVP'}
            </button>
          </div>
        </div>

        {exportSuccess && (
          <div className="p-4 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Video scene rendered successfully! Ready for download.</span>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert('Export simulated successfully! WebM video stream prepared.');
              }}
              className="underline font-bold"
            >
              Download WebM Video
            </a>
          </div>
        )}

        {/* Video Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Canvas Preview Player */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="glass-panel p-4 rounded-3xl border-surface-800 space-y-4 w-full flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-surface-700 aspect-[9/16] w-[270px] bg-black">
                <canvas
                  ref={canvasRef}
                  width={540}
                  height={960}
                  className="w-full h-full object-cover"
                />

                {/* Playhead Overlay Controls */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>
              </div>

              {/* Playback Progress Time Slider */}
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between text-[11px] text-surface-400 font-mono">
                  <span>{currentTime.toFixed(1)}s</span>
                  <span>{video?.duration.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={video?.duration || 10}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Scene Editor Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Scene Editor Form */}
            {activeScene && (
              <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-brand-400" /> Scene #{activeSceneIndex + 1} Editor
                  </h3>
                  <button
                    onClick={() => handleDeleteScene(activeSceneIndex)}
                    className="text-surface-500 hover:text-rose-400 p-1 text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Scene
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">
                      Scene Duration (Seconds)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      step={0.5}
                      value={activeScene.duration}
                      onChange={(e) =>
                        handleUpdateScene(activeSceneIndex, { duration: parseFloat(e.target.value) || 3.0 })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-surface-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">
                      Transition Effect
                    </label>
                    <select
                      value={activeScene.transition}
                      onChange={(e) => handleUpdateScene(activeSceneIndex, { transition: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface-900 border border-surface-800 text-white text-xs"
                    >
                      <option value="FADE">Fade Dissolve</option>
                      <option value="SLIDE">Slide Left</option>
                      <option value="ZOOM">Zoom Punch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">
                    On-Screen Headline Text Overlay
                  </label>
                  <input
                    type="text"
                    value={activeScene.textOverlay}
                    onChange={(e) => handleUpdateScene(activeSceneIndex, { textOverlay: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-900 border border-surface-800 text-white text-xs font-semibold focus:outline-none focus:border-brand-500"
                    placeholder="e.g. 🚀 75% Faster Production"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-1">
                    Subtitle / Captions Data (Timing synced)
                  </label>
                  <textarea
                    rows={3}
                    value={activeScene.captionData}
                    onChange={(e) => handleUpdateScene(activeSceneIndex, { captionData: e.target.value })}
                    className="w-full p-3 rounded-xl bg-surface-900 border border-surface-800 text-white text-xs focus:outline-none focus:border-brand-500"
                    placeholder="Voiceover spoken subtitles..."
                  />
                </div>
              </div>
            )}

            {/* Drag & Reorder Timeline View */}
            <div className="glass-panel p-6 rounded-3xl border-surface-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-brand-400" /> Interactive Timeline Scenes ({video?.scenes.length})
                </h3>
                <button
                  onClick={handleAddScene}
                  className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Scene
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {video?.scenes.map((sc, idx) => (
                  <div
                    key={sc.id}
                    onClick={() => setActiveSceneIndex(idx)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      activeSceneIndex === idx
                        ? 'bg-brand-600/20 border-brand-500 text-white shadow-lg'
                        : 'bg-surface-900/60 border-surface-800 text-surface-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                      <span>SCENE #{idx + 1}</span>
                      <span className="text-amber-400">{sc.duration}s</span>
                    </div>
                    <p className="text-xs font-semibold truncate text-white">{sc.textOverlay || 'Untitled Scene'}</p>
                    <p className="text-[10px] text-surface-500 truncate mt-1">"{sc.captionData}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
