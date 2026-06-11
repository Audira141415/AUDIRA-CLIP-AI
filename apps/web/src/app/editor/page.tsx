'use client';

import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Scissors, Type, Square, Layers, ZoomIn, ZoomOut, Save, Download } from 'lucide-react';
import { useState } from 'react';

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TimelineEditor() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <DashboardLayout>
      <div className="h-[85vh] flex flex-col bg-background text-black font-body overflow-hidden border-4 border-black shadow-neu">
      {/* Editor Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <h1 className="font-heading font-bold text-lg">Short_Hormozi_Style.mp4</h1>
          <span className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">1080x1920</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded flex items-center gap-2 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button className="bg-primary hover:bg-primary/90 text-black px-4 py-1.5 rounded font-bold text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)] flex items-center gap-2 transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-16 border-r border-gray-800 bg-surface/30 flex flex-col items-center py-4 gap-4">
          <button className="p-3 bg-gray-800 rounded-xl text-white hover:text-primary transition-colors tooltip" title="Media">
            <Layers className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-500 hover:text-primary transition-colors tooltip" title="Text">
            <Type className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-500 hover:text-primary transition-colors tooltip" title="Split">
            <Scissors className="w-5 h-5" />
          </button>
          <button className="p-3 text-gray-500 hover:text-primary transition-colors tooltip" title="Elements">
            <Square className="w-5 h-5" />
          </button>
        </aside>

        {/* Video Player Area */}
        <div className="flex-1 flex flex-col relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 mix-blend-overlay">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative aspect-[9/16] h-full max-h-[60vh] bg-black rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
              {/* Fake Video Preview */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black" />
              <div className="absolute inset-x-0 bottom-1/4 flex justify-center">
                <span className="text-4xl font-heading font-black text-white outline-text tracking-widest uppercase" style={{ textShadow: '2px 2px 0 #00E5FF, -2px -2px 0 #7C3AED' }}>
                  THE HOOK
                </span>
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="h-16 flex items-center justify-center gap-6 pb-4">
            <button className="text-gray-400 hover:text-white"><SkipBack className="w-5 h-5" /></button>
            <button 
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </button>
            <button className="text-gray-400 hover:text-white"><SkipForward className="w-5 h-5" /></button>
          </div>
        </div>
        
        {/* Right Properties Panel */}
        <aside className="w-72 border-l border-gray-800 bg-surface/30 p-4 overflow-y-auto">
          <h3 className="font-bold mb-4">Properties</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">Transform</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-surface border border-gray-700 rounded p-2 text-sm flex justify-between">
                  <span className="text-gray-500">Scale</span><span>100%</span>
                </div>
                <div className="bg-surface border border-gray-700 rounded p-2 text-sm flex justify-between">
                  <span className="text-gray-500">Rot</span><span>0°</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider font-medium">AI Auto-Reframe</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 accent-primary" defaultChecked />
                <span className="text-sm">Track Active Speaker</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Timeline Area */}
      <div className="h-64 border-t border-gray-800 bg-[#0C0C0F] flex flex-col">
        {/* Timeline Tools */}
        <div className="h-10 flex items-center justify-between px-4 border-b border-gray-800">
          <div className="flex gap-4 text-sm text-gray-400">
            <button className="hover:text-white">Undo</button>
            <button className="hover:text-white">Redo</button>
          </div>
          <div className="flex items-center gap-2">
            <ZoomOut className="w-4 h-4 text-gray-400" />
            <input type="range" className="w-24 accent-primary" />
            <ZoomIn className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* Tracks Area */}
        <div className="flex-1 overflow-x-auto relative p-4 space-y-2">
          {/* Playhead */}
          <div className="absolute top-0 bottom-0 left-1/3 w-px bg-danger z-10">
            <div className="absolute top-0 -translate-x-1/2 -mt-2 w-3 h-3 rotate-45 bg-danger" />
          </div>

          {/* Video Track */}
          <div className="flex items-center gap-2 h-14">
            <div className="w-16 flex-shrink-0 text-xs text-gray-500 font-medium">V1</div>
            <div className="flex-1 bg-surface border border-gray-700 rounded overflow-hidden relative">
              <div className="absolute left-10 w-64 h-full bg-blue-900/50 border border-blue-500/50 rounded flex items-center px-2">
                <span className="text-xs text-blue-200 truncate">main_interview.mp4</span>
              </div>
            </div>
          </div>
          
          {/* Audio Track */}
          <div className="flex items-center gap-2 h-12">
            <div className="w-16 flex-shrink-0 text-xs text-gray-500 font-medium">A1</div>
            <div className="flex-1 bg-surface border border-gray-700 rounded overflow-hidden relative">
              <div className="absolute left-10 w-64 h-full bg-green-900/50 border border-green-500/50 rounded flex items-center px-2">
                 <svg className="w-full h-full text-green-500 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0 50 Q 10 20, 20 50 T 40 50 T 60 50 T 80 50 T 100 50" fill="transparent" stroke="currentColor" strokeWidth="2"/>
                 </svg>
              </div>
            </div>
          </div>

          {/* Subtitle Track */}
          <div className="flex items-center gap-2 h-8">
            <div className="w-16 flex-shrink-0 text-xs text-gray-500 font-medium">T1</div>
            <div className="flex-1 bg-surface border border-gray-700 rounded overflow-hidden relative">
              <div className="absolute left-16 w-32 h-full bg-purple-900/50 border border-purple-500/50 rounded flex items-center justify-center">
                <span className="text-[10px] text-purple-200">"THE HOOK"</span>
              </div>
              <div className="absolute left-52 w-20 h-full bg-purple-900/50 border border-purple-500/50 rounded flex items-center justify-center">
                <span className="text-[10px] text-purple-200">"WAIT..."</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
