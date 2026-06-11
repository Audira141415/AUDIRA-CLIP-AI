'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, RefreshCw, CheckSquare, Zap, Smile, Flame, Users, Mic, MoreVertical, Play, Pause, SkipBack, SkipForward, Maximize, Volume2, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AIClipper() {
  const analysisStats = [
    { label: "Viral Moments", count: 12, icon: Zap, bg: "bg-primary" },
    { label: "Emotional Moments", count: 8, icon: Smile, bg: "bg-secondary" },
    { label: "Funny Moments", count: 15, icon: Smile, bg: "bg-warning" },
    { label: "High Engagement", count: 10, icon: Flame, bg: "bg-success" },
    { label: "Speaker Changes", count: 24, icon: Users, bg: "bg-white" },
    { label: "Topic Changes", count: 7, icon: Mic, bg: "bg-accent-blue" },
  ];

  const detectedClips = [
    { title: "Viral Moment", time: "00:12:44 - 00:13:10", duration: "00:26", score: "95%", added: false, color: "bg-primary" },
    { title: "Funny Moment", time: "00:24:11 - 00:24:50", duration: "00:39", score: "88%", added: true, color: "bg-secondary" },
    { title: "High Engagement", time: "00:31:22 - 00:32:05", duration: "00:43", score: "89%", added: true, color: "bg-accent-teal" },
    { title: "Emotional Moment", time: "00:41:03 - 00:41:48", duration: "00:45", score: "93%", added: true, color: "bg-warning" },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 bg-background min-h-[calc(100vh-2rem)] text-black font-sans p-8 overflow-x-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-4 border-black bg-white p-4 shadow-neu">
          <div className="flex items-center gap-6">
            <Link href="/library" className="flex items-center gap-2 text-black hover:bg-primary border-2 border-transparent hover:border-black px-2 py-1 transition-all text-md font-black uppercase">
              <ArrowLeft className="w-5 h-5" strokeWidth={3} /> Back to Library
            </Link>
            <div className="h-8 w-1 bg-black"></div>
            <h1 className="font-black text-xl flex items-center gap-3 uppercase">
              AI Clipper - Podcast Episode #47.mp4 <span className="bg-primary border-2 border-black px-2 py-0.5 text-black font-bold">00:45:12</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border-4 border-black bg-white shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu-hover text-md font-black uppercase transition-all">
              <RefreshCw className="w-5 h-5" strokeWidth={3} /> Re-analyze
            </button>
            <button className="bg-primary hover:bg-secondary text-black px-6 py-2 border-4 border-black text-md font-black uppercase transition-colors shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu-hover">
              Create Project
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Video Player (Col Span 2) */}
          <div className="lg:col-span-2 bg-black border-4 border-black shadow-neu relative flex flex-col group overflow-hidden">
            {/* Mock Video Area */}
            <div className="flex-1 relative aspect-video bg-gray-900">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
            </div>
            
            {/* Player Controls */}
            <div className="bg-white border-t-4 border-black p-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-black bg-primary px-1 border-2 border-black">00:12:45</span>
                <div className="flex-1 h-3 bg-background border-2 border-black relative cursor-pointer overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[25%] bg-secondary border-r-2 border-black"></div>
                  <div className="absolute top-1/2 left-[25%] w-4 h-4 bg-primary border-2 border-black transform -translate-x-1/2 -translate-y-1/2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                </div>
                <span className="text-sm font-black bg-white px-1 border-2 border-black">00:45:12</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <button className="w-10 h-10 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary flex items-center justify-center transition-colors"><SkipBack className="w-5 h-5 fill-current" /></button>
                  <button className="w-12 h-12 bg-primary border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-secondary flex items-center justify-center transition-colors"><Play className="w-6 h-6 fill-current" /></button>
                  <button className="w-10 h-10 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary flex items-center justify-center transition-colors"><SkipForward className="w-5 h-5 fill-current" /></button>
                  <button className="w-10 h-10 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-teal flex items-center justify-center ml-2 transition-colors"><Volume2 className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-md font-black border-4 border-black bg-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-primary transition-colors">1X</button>
                  <button className="w-10 h-10 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-secondary flex items-center justify-center transition-colors"><Maximize className="w-5 h-5" strokeWidth={3} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Results */}
          <div className="bg-white border-4 border-black shadow-neu p-6 h-full flex flex-col">
            <h3 className="font-black text-2xl uppercase mb-6 border-b-4 border-black pb-4">AI Analysis Results</h3>
            
            <div className="mb-8 p-4 bg-background border-4 border-black shadow-neu">
              <div className="flex justify-between text-sm font-black uppercase mb-2">
                <span>30% Analysis Complete</span>
              </div>
              <div className="h-4 w-full bg-white border-2 border-black overflow-hidden">
                <div className="h-full w-[30%] bg-primary border-r-2 border-black"></div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {analysisStats.map((stat, i) => (
                <div key={i} className={`flex items-center justify-between p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer ${stat.bg}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                       <stat.icon className="w-6 h-6 text-black" strokeWidth={2.5} />
                    </div>
                    <span className="text-md font-black uppercase">{stat.label}</span>
                  </div>
                  <span className="font-black text-xl bg-white px-2 border-2 border-black">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Detected Clips Row */}
        <div className="bg-background border-4 border-black p-8 shadow-neu">
          <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
            <h3 className="font-black text-3xl uppercase">Detected Clips</h3>
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-md font-black bg-white border-4 border-black px-4 py-2 hover:bg-primary shadow-neu transition-colors uppercase">
                <CheckSquare className="w-6 h-6" strokeWidth={3} /> Select All
              </button>
              <button className="bg-secondary border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu-hover hover:bg-white px-6 py-2 text-md font-black transition-all uppercase text-black">
                Add Selected to Project
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detectedClips.map((clip, i) => (
              <div key={i} className={`bg-white border-4 border-black p-4 flex flex-col gap-4 shadow-neu hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-neu-hover transition-all`}>
                <div className={`relative aspect-video border-4 border-black overflow-hidden bg-accent-blue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  <div className="absolute inset-0 bg-black/20 mix-blend-overlay" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40 cursor-pointer">
                    <div className="w-16 h-16 bg-primary border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-black ml-1 fill-current" strokeWidth={2} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-black text-lg uppercase mb-2 line-clamp-1">{clip.title}</h4>
                  <div className="flex justify-between items-center text-sm font-bold bg-background border-2 border-black px-2 py-1 mb-3">
                    <span>{clip.time}</span>
                    <span className="bg-white px-1 border-l-2 border-black ml-2 pl-2">{clip.duration}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t-4 border-black">
                    <span className={`text-sm font-black uppercase px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${clip.color}`}>
                      SCORE {clip.score}
                    </span>
                    <button className={`flex items-center gap-1 px-4 py-2 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-black uppercase transition-all ${clip.added ? 'bg-background hover:bg-white' : 'bg-primary hover:bg-secondary'}`}>
                      <Plus className="w-4 h-4" strokeWidth={3} /> {clip.added ? 'ADDED' : 'ADD'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
