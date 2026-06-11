'use client';

import { motion } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Scissors, Type, Layers, ZoomIn, ZoomOut, 
  Save, Download, ChevronLeft, LayoutTemplate, Sparkles, Settings as SettingsIcon,
  MousePointer2, Hand, SplitSquareHorizontal, Eye, EyeOff, Lock, Unlock
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function TimelineEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('subtitles');

  return (
    <div className="h-screen w-full bg-[#0A0A0A] text-gray-300 flex flex-col font-sans overflow-hidden selection:bg-[#F5A623] selection:text-black">
      
      {/* --- TOP HEADER --- */}
      <header className="h-14 border-b border-white/10 bg-[#111111] flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="font-semibold text-sm text-gray-100 flex items-center gap-2">
            Short_Hormozi_Style.mp4
            <span className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded text-gray-400 font-mono">1080x1920</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white px-3 py-1.5 rounded-md flex items-center gap-2 text-xs font-medium transition-colors hover:bg-white/5">
            <Save className="w-4 h-4" /> Save Draft
          </button>
          <button className="bg-[#F5A623] hover:bg-[#F5A623]/90 text-black px-4 py-1.5 rounded-md font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(245,166,35,0.2)]">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* --- MAIN WORKSPACE --- */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT TOOLBAR (Primary Nav) */}
        <aside className="w-16 border-r border-white/10 bg-[#111111] flex flex-col items-center py-4 gap-2 z-10">
          <ToolButton icon={<Layers />} label="Media" />
          <ToolButton icon={<Type />} label="Text" />
          <ToolButton icon={<Sparkles />} label="Subtitles" active />
          <ToolButton icon={<LayoutTemplate />} label="Templates" />
          <div className="flex-1" />
          <ToolButton icon={<SettingsIcon />} label="Settings" />
        </aside>

        {/* LEFT PANEL (Secondary Tool Panel) */}
        <aside className="w-64 border-r border-white/10 bg-[#0F0F0F] flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-gray-100">AI Subtitles</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer group">
                <span className="text-xs text-gray-400 group-hover:text-gray-200">00:00:01 - 00:00:03</span>
                <span className="text-xs font-medium text-white">THE HOOK</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-white/10 border-l-2 border-[#F5A623] cursor-pointer">
                <span className="text-xs text-[#F5A623]">00:00:03 - 00:00:05</span>
                <span className="text-xs font-medium text-white">WAIT...</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer group">
                <span className="text-xs text-gray-400 group-hover:text-gray-200">00:00:05 - 00:00:08</span>
                <span className="text-xs font-medium text-gray-300">LET ME EXPLAIN</span>
              </div>
            </div>
            
            <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-colors">
              <Sparkles className="w-3 h-3 text-[#F5A623]" /> Regenerate with AI
            </button>
          </div>
        </aside>

        {/* CENTER PREVIEW (Video Canvas) */}
        <div className="flex-1 flex flex-col relative bg-[#050505] overflow-hidden">
          {/* Top Canvas Toolbar */}
          <div className="h-10 flex items-center justify-center gap-2">
            <div className="flex items-center bg-white/5 rounded-md border border-white/10 p-0.5">
              <button className="p-1.5 bg-white/10 rounded text-white"><MousePointer2 className="w-4 h-4" /></button>
              <button className="p-1.5 text-gray-500 hover:text-gray-300"><Hand className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono ml-4">
              <span>Zoom: 45%</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4">
            {/* 9:16 Canvas Area */}
            <div className="relative aspect-[9/16] h-full max-h-[70vh] bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl ring-1 ring-white/5">
              {/* Dummy Video Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50" />
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Video Background" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" />

              {/* TikTok/Reels Safe Zone Overlay */}
              <div className="absolute inset-0 border-[1px] border-dashed border-white/20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              
              {/* Dummy UI Elements representing TikTok overlay */}
              <div className="absolute right-2 bottom-32 w-10 h-40 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm pointer-events-none flex flex-col gap-4 items-center py-4 opacity-50" />
              <div className="absolute left-4 bottom-4 w-48 h-16 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm pointer-events-none opacity-50" />

              {/* Editable Fabric.js-like Subtitle Element */}
              <div className="absolute inset-x-0 bottom-1/3 flex justify-center cursor-move group">
                <div className="relative border border-transparent group-hover:border-[#F5A623] p-2 rounded transition-colors">
                  {/* Transform handles */}
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#F5A623] rounded-full opacity-0 group-hover:opacity-100" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#F5A623] rounded-full opacity-0 group-hover:opacity-100" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#F5A623] rounded-full opacity-0 group-hover:opacity-100" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#F5A623] rounded-full opacity-0 group-hover:opacity-100" />
                  
                  <span className="text-4xl font-black text-white uppercase" style={{ 
                    fontFamily: 'Montserrat, sans-serif',
                    textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000, 1px 1px 0px #000'
                  }}>
                    WAIT...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="h-14 flex items-center justify-center gap-6 border-t border-white/5 bg-[#0A0A0A]/80 backdrop-blur">
            <span className="text-xs font-mono text-gray-400 w-16 text-right">00:03:12</span>
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white transition-colors"><SkipBack className="w-4 h-4" /></button>
              <button 
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button className="text-gray-400 hover:text-white transition-colors"><SkipForward className="w-4 h-4" /></button>
            </div>
            <span className="text-xs font-mono text-gray-600 w-16">/ 00:15:00</span>
          </div>
        </div>
        
        {/* RIGHT PROPERTIES PANEL */}
        <aside className="w-72 border-l border-white/10 bg-[#111111] flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button className="flex-1 py-3 text-xs font-semibold text-white border-b-2 border-[#F5A623]">Design</button>
            <button className="flex-1 py-3 text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors">Animation</button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Text Style */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Text Style</label>
                <span className="text-[10px] text-[#F5A623] bg-[#F5A623]/10 px-1.5 py-0.5 rounded">Selected</span>
              </div>
              
              <div className="space-y-2">
                <select className="w-full bg-[#1A1A1A] border border-white/10 text-xs rounded p-2 text-white focus:outline-none focus:border-[#F5A623]">
                  <option>Montserrat (Black)</option>
                  <option>The Bold Font</option>
                  <option>Komika Axis</option>
                </select>
                
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded p-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Size</span>
                    <input type="number" defaultValue={72} className="w-10 bg-transparent text-xs text-white text-right focus:outline-none" />
                  </div>
                  <div className="w-10 bg-[#1A1A1A] border border-white/10 rounded flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stroke & Shadow */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stroke & Shadow</label>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#1A1A1A] border border-white/10 rounded flex items-center justify-center">
                    <div className="w-4 h-4 bg-black border border-white/20 rounded-sm" />
                  </div>
                  <div className="flex-1 bg-[#1A1A1A] border border-white/10 rounded p-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-8">Strk</span>
                    <input type="range" className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#F5A623]" defaultValue={15} />
                    <span className="text-xs text-white w-4 text-right">15</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10 w-full" />

            {/* AI Auto-Reframe */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Reframe</label>
              </div>
              
              <div className="bg-[#1A1A1A] border border-white/10 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Track Face</span>
                  <div className="w-8 h-4 bg-[#F5A623] rounded-full relative cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">Dynamic Zoom</span>
                  <div className="w-8 h-4 bg-white/20 rounded-full relative cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </aside>
      </div>

      {/* --- TIMELINE AREA --- */}
      <div className="h-72 border-t border-white/10 bg-[#0F0F0F] flex flex-col relative z-20">
        
        {/* Timeline Toolbar */}
        <div className="h-9 flex items-center justify-between px-4 border-b border-white/5 bg-[#141414]">
          <div className="flex items-center gap-4">
            <button className="p-1 hover:bg-white/10 rounded text-gray-400"><Scissors className="w-4 h-4" /></button>
            <button className="p-1 hover:bg-white/10 rounded text-gray-400"><SplitSquareHorizontal className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            <ZoomOut className="w-3.5 h-3.5 text-gray-500" />
            <input type="range" className="w-24 h-1 bg-white/20 rounded-lg appearance-none accent-[#F5A623]" defaultValue={40} />
            <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
          </div>
        </div>
        
        {/* Time Ruler */}
        <div className="h-6 border-b border-white/5 bg-[#111111] flex relative overflow-hidden text-[10px] text-gray-500 font-mono select-none">
          {/* Mock ruler markers */}
          <div className="absolute left-[64px] inset-y-0 right-0 flex items-end">
             {Array.from({length: 20}).map((_, i) => (
               <div key={i} className="flex-1 border-l border-white/10 h-2 relative">
                 <span className="absolute -top-4 -left-3">00:0{i}</span>
                 {/* Sub-ticks */}
                 <div className="absolute left-1/4 bottom-0 h-1 border-l border-white/5" />
                 <div className="absolute left-2/4 bottom-0 h-1 border-l border-white/5" />
                 <div className="absolute left-3/4 bottom-0 h-1 border-l border-white/5" />
               </div>
             ))}
          </div>
        </div>

        {/* Tracks Container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto relative bg-[#0A0A0A]">
          {/* Playhead Line */}
          <div className="absolute top-0 bottom-0 left-[250px] w-px bg-red-500 z-30 pointer-events-none">
            <div className="absolute -top-2 -translate-x-1/2 w-3 h-3 rounded-sm bg-red-500 flex items-center justify-center">
               <div className="w-0.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>

          <div className="min-w-[1200px] pb-8 pt-2">
            {/* Subtitle Track (T1) */}
            <div className="flex h-10 mb-1 group">
              <div className="w-16 flex-shrink-0 bg-[#111111] border-r border-white/5 flex items-center justify-between px-2 sticky left-0 z-20">
                <span className="text-[10px] font-bold text-gray-500">T1</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              <div className="flex-1 relative flex items-center px-2">
                 <div className="absolute left-[64px] w-32 h-6 bg-[#F5A623]/20 border border-[#F5A623]/50 rounded text-[10px] text-[#F5A623] flex items-center px-2 overflow-hidden hover:bg-[#F5A623]/30 cursor-pointer transition-colors">
                   <span className="truncate">"THE HOOK"</span>
                 </div>
                 {/* Selected block */}
                 <div className="absolute left-[196px] w-48 h-6 bg-white border border-white rounded text-[10px] text-black font-bold flex items-center px-2 shadow-[0_0_0_2px_rgba(245,166,35,0.5)] cursor-pointer z-10">
                   <span className="truncate">"WAIT..."</span>
                   {/* Handle */}
                   <div className="absolute right-0 top-0 bottom-0 w-2 bg-black/10 cursor-col-resize" />
                 </div>
              </div>
            </div>

            {/* Video Track (V1) */}
            <div className="flex h-16 mb-1 group">
              <div className="w-16 flex-shrink-0 bg-[#111111] border-r border-white/5 flex items-center justify-between px-2 sticky left-0 z-20">
                <span className="text-[10px] font-bold text-gray-500">V1</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              <div className="flex-1 relative flex items-center px-2">
                <div className="absolute left-0 w-[600px] h-12 bg-blue-600/20 border border-blue-500/30 rounded overflow-hidden flex cursor-pointer hover:border-blue-500/50 transition-colors">
                  {/* Mock Video Thumbnails */}
                  {Array.from({length: 12}).map((_, i) => (
                    <img key={i} src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&q=50" className="h-full w-12 object-cover opacity-60 border-r border-blue-900/30" alt="thumb" />
                  ))}
                  <div className="absolute top-0 bottom-0 left-0 px-2 flex items-center bg-gradient-to-r from-blue-900/80 to-transparent">
                    <span className="text-[10px] text-white font-medium drop-shadow-md">main_interview_cam1.mp4</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Audio Track (A1) */}
            <div className="flex h-14 group">
              <div className="w-16 flex-shrink-0 bg-[#111111] border-r border-white/5 flex flex-col justify-center gap-1 px-2 sticky left-0 z-20">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-gray-500">A1</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Lock className="w-3 h-3 text-gray-500" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                   <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-3/4" />
                   </div>
                </div>
              </div>
              <div className="flex-1 relative flex items-center px-2">
                <div className="absolute left-0 w-[600px] h-10 bg-green-600/10 border border-green-500/20 rounded flex items-center cursor-pointer hover:border-green-500/40 transition-colors overflow-hidden">
                   {/* Realistic Audio Waveform SVG Pattern */}
                   <svg className="w-full h-full text-green-500/60" preserveAspectRatio="none" viewBox="0 0 1000 100">
                      <path d="M0,50 L5,20 L10,80 L15,30 L20,70 L25,10 L30,90 L35,40 L40,60 L45,20 L50,80 L55,30 L60,70 L65,10 L70,90 L75,40 L80,60 L85,20 L90,80 L95,30 L100,70 L105,10 L110,90 L115,40 L120,60 L125,20 L130,80 L135,30 L140,70 L145,10 L150,90 L155,40 L160,60 L165,20 L170,80 L175,30 L180,70 L185,10 L190,90 L195,40 L200,60 L205,20 L210,80 L215,30 L220,70 L225,10 L230,90 L235,40 L240,60 L245,20 L250,80 L255,30 L260,70 L265,10 L270,90 L275,40 L280,60 L285,20 L290,80 L295,30 L300,70 L305,10 L310,90 L315,40 L320,60 L325,20 L330,80 L335,30 L340,70 L345,10 L350,90 L355,40 L360,60 L365,20 L370,80 L375,30 L380,70 L385,10 L390,90 L395,40 L400,60 L405,20 L410,80 L415,30 L420,70 L425,10 L430,90 L435,40 L440,60 L445,20 L450,80 L455,30 L460,70 L465,10 L470,90 L475,40 L480,60 L485,20 L490,80 L495,30 L500,70 L505,10 L510,90 L515,40 L520,60 L525,20 L530,80 L535,30 L540,70 L545,10 L550,90 L555,40 L560,60 L565,20 L570,80 L575,30 L580,70 L585,10 L590,90 L595,40 L600,60 L605,20 L610,80 L615,30 L620,70 L625,10 L630,90 L635,40 L640,60 L645,20 L650,80 L655,30 L660,70 L665,10 L670,90 L675,40 L680,60 L685,20 L690,80 L695,30 L700,70 L705,10 L710,90 L715,40 L720,60 L725,20 L730,80 L735,30 L740,70 L745,10 L750,90 L755,40 L760,60 L765,20 L770,80 L775,30 L780,70 L785,10 L790,90 L795,40 L800,60 L805,20 L810,80 L815,30 L820,70 L825,10 L830,90 L835,40 L840,60 L845,20 L850,80 L855,30 L860,70 L865,10 L870,90 L875,40 L880,60 L885,20 L890,80 L895,30 L900,70 L905,10 L910,90 L915,40 L920,60 L925,20 L930,80 L935,30 L940,70 L945,10 L950,90 L955,40 L960,60 L965,20 L970,80 L975,30 L980,70 L985,10 L990,90 L995,40 L1000,60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                   <div className="absolute top-0 bottom-0 left-0 px-2 flex items-center">
                    <span className="text-[10px] text-white/50 font-medium drop-shadow-md">Audio Mix</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function ToolButton({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-xl transition-colors ${active ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
      <div className={`[&>svg]:w-5 [&>svg]:h-5 ${active ? 'text-[#F5A623]' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-medium">{label}</span>
    </button>
  );
}
