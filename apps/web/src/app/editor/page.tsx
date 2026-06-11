'use client';

import { 
  Home, Video, Clapperboard, Type, Crop, PlaySquare, 
  BarChart2, Users, Settings as SettingsIcon, HelpCircle, Bell, 
  Download, Upload, Filter, Plus, ChevronDown, Monitor, 
  RotateCw, Play, SkipBack, SkipForward, Maximize2, 
  MousePointer2, Undo, Redo, Scissors, Trash2, SplitSquareHorizontal, Eye, Lock
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function AdvancedNLEEditor() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="h-screen w-full bg-[#111111] text-gray-300 flex font-sans overflow-hidden">
      
      {/* 1. LEFT GLOBAL SIDEBAR */}
      <aside className="w-56 bg-[#151515] border-r border-[#222] flex flex-col z-50">
        <div className="h-16 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#F5A623] rounded-sm"></div>
            <span className="font-black text-white tracking-widest text-lg">AUDIRA <span className="text-[#F5A623]">CLIP</span></span>
          </div>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          <NavItem icon={<Home />} label="DASHBOARD" href="/" />
          <NavItem icon={<Video />} label="VIDEO LIBRARY" />
          <NavItem icon={<Clapperboard />} label="EDITOR" active href="/editor" />
          <NavItem icon={<Type />} label="SUBTITLE STUDIO" />
          <NavItem icon={<Crop />} label="AI REFRAMING" />
          <NavItem icon={<PlaySquare />} label="RENDER QUEUE" />
          <NavItem icon={<BarChart2 />} label="ANALYTICS" />
          <NavItem icon={<Users />} label="TEAM" />
          <NavItem icon={<SettingsIcon />} label="AI COPILOT" />
          <NavItem icon={<SettingsIcon />} label="SETTINGS" href="/settings" />
        </nav>
        
        <div className="p-4">
          <button className="w-6 h-6 bg-[#222] rounded flex items-center justify-center text-gray-500 hover:text-white">
            <span className="text-xs">{"<"}</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. TOP HEADER */}
        <header className="h-16 bg-[#111111] border-b border-[#222] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-sm font-semibold text-white flex items-center gap-2">
                Untitled Project <ChevronDown className="w-4 h-4 text-gray-500" />
              </h1>
              <p className="text-[11px] text-gray-500 mt-0.5">Saved 2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <HelpCircle className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <Bell className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-xs">AU</div>
            <button className="h-9 px-4 bg-[#F5A623] hover:bg-orange-400 text-black font-bold text-sm rounded flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Export <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MIDDLE AREA (Library, Preview, Properties) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* 3. MEDIA LIBRARY (Left Panel) */}
          <aside className="w-[380px] bg-[#111111] border-r border-[#222] flex flex-col shrink-0">
            {/* Tabs */}
            <div className="h-16 border-b border-[#222] flex items-center px-4 gap-6 overflow-x-auto no-scrollbar">
              <LibTab icon={<Video />} label="Media" active />
              <LibTab icon={<PlaySquare />} label="Audio" />
              <LibTab icon={<Type />} label="Text" />
              <LibTab icon={<Monitor />} label="Elements" />
              <LibTab icon={<SplitSquareHorizontal />} label="Transitions" />
              <LibTab icon={<Filter />} label="Filters" />
              <LibTab icon={<SparklesIcon />} label="Effects" />
            </div>

            <div className="p-4 flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <button className="flex-1 h-10 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] rounded flex items-center justify-center gap-2 text-sm text-gray-300 transition-colors">
                  <Upload className="w-4 h-4" /> Upload Media <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                <button className="w-10 h-10 bg-[#1A1A1A] border border-[#333] rounded flex items-center justify-center text-gray-400 hover:text-white">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-white">Project Media <span className="bg-[#222] px-1.5 py-0.5 rounded ml-1 text-gray-400">24</span></span>
                <div className="flex gap-2">
                  <GridIcon />
                  <ListIcon />
                </div>
              </div>

              {/* Grid of Media */}
              <div className="flex-1 overflow-y-auto pr-2 pb-4">
                <div className="grid grid-cols-3 gap-3">
                  <MediaItem title="Video_01.mp4" duration="00:18" img="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80" />
                  <MediaItem title="B-roll_02.mp4" duration="00:14" img="https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200&q=80" />
                  <MediaItem title="Interview.mp4" duration="00:22" img="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" />
                  <MediaItem title="City_Broll.mp4" duration="00:10" img="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&q=80" />
                  <MediaItem title="Screen_01.mp4" duration="00:12" img="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80" />
                  <div className="aspect-video bg-[#3D255A] rounded-md border border-[#5A3A8A] flex flex-col justify-between p-2">
                     <div className="flex justify-center mt-2">
                        <MusicIcon />
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-[9px] text-white bg-black/50 px-1 rounded">02:45</span>
                       <MoreVerticalIcon />
                     </div>
                  </div>
                  <div className="col-span-3 text-[10px] text-gray-400 mt-1">Music_Loop.mp3</div>
                </div>
              </div>
            </div>
          </aside>

          {/* 4. CENTER PREVIEW AREA */}
          <div className="flex-1 flex flex-col bg-[#080808] border-r border-[#222]">
            <div className="h-12 flex items-center justify-between px-4">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1 hover:text-white cursor-pointer">Fit <ChevronDown className="w-3 h-3" /></span>
                <span className="flex items-center gap-1 hover:text-white cursor-pointer">100% <ChevronDown className="w-3 h-3" /></span>
                <div className="w-px h-4 bg-[#333] mx-1"></div>
                <Undo className="w-4 h-4 hover:text-white cursor-pointer" />
                <Redo className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>
              <div className="flex items-center gap-3 text-xs">
                 <button className="px-3 py-1.5 border border-[#333] rounded hover:bg-[#222] text-gray-300">Save</button>
                 <Eye className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 min-h-0">
               {/* 16:9 Canvas container */}
               <div className="w-full max-w-4xl aspect-video bg-black rounded overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#222]">
                  <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" className="w-full h-full object-cover" alt="Preview" />
                  
                  {/* Playhead indicator bar on video */}
                  <div className="absolute bottom-4 left-4 right-4 h-1 bg-white/20 rounded-full">
                     <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-[#F5A623] rounded-full"></div>
                     <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#F5A623] rounded-full shadow-sm"></div>
                  </div>
               </div>
            </div>

            {/* Player Controls */}
            <div className="h-14 flex items-center justify-between px-6 bg-[#080808]">
               <div className="text-xs font-mono text-gray-400">
                 <span className="text-white">00:00:07:12</span> / 00:01:23:20
               </div>
               <div className="flex items-center gap-6">
                 <SkipBack className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                 <Play className="w-5 h-5 text-white cursor-pointer" fill="currentColor" />
                 <SkipForward className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
               </div>
               <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">16:9 <ChevronDown className="w-3 h-3" /></span>
                  <Maximize2 className="w-4 h-4 hover:text-white cursor-pointer" />
               </div>
            </div>
          </div>

          {/* 5. RIGHT PROPERTIES PANEL */}
          <aside className="w-[300px] bg-[#111111] flex flex-col shrink-0">
            <div className="h-14 border-b border-[#222] flex px-4 gap-4 overflow-x-auto no-scrollbar items-end">
              <button className="pb-3 text-sm font-semibold text-[#F5A623] border-b-2 border-[#F5A623]">Video</button>
              <button className="pb-3 text-sm font-medium text-gray-400 hover:text-gray-200">Audio</button>
              <button className="pb-3 text-sm font-medium text-gray-400 hover:text-gray-200">Effects</button>
              <button className="pb-3 text-sm font-medium text-gray-400 hover:text-gray-200">Adjust</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">
               {/* Transform Section */}
               <section>
                 <h3 className="text-xs font-semibold text-white mb-4">Transform</h3>
                 
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                       <span>Scale</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <input type="range" className="flex-1 h-1 bg-[#333] rounded-lg appearance-none accent-[#F5A623]" defaultValue={100} />
                       <span className="text-xs bg-[#1A1A1A] border border-[#333] px-2 py-1 rounded text-white min-w-[3rem] text-center">100%</span>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                       <span>Position</span>
                     </div>
                     <div className="flex gap-3">
                        <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded px-3 py-1.5 flex items-center justify-between">
                          <span className="text-xs text-gray-500">X</span>
                          <span className="text-xs text-white">0</span>
                        </div>
                        <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded px-3 py-1.5 flex items-center justify-between">
                          <span className="text-xs text-gray-500">Y</span>
                          <span className="text-xs text-white">0</span>
                        </div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                       <span>Rotate</span>
                     </div>
                     <div className="flex gap-3 items-center">
                        <div className="flex-1 bg-[#1A1A1A] border border-[#333] rounded px-3 py-1.5">
                          <span className="text-xs text-white">0°</span>
                        </div>
                        <RotateCw className="w-4 h-4 text-gray-500 hover:text-white cursor-pointer" />
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                       <span>Flip</span>
                     </div>
                     <div className="flex gap-2">
                        <button className="w-10 h-8 bg-[#1A1A1A] border border-[#333] rounded flex items-center justify-center text-gray-400 hover:text-white">
                           <FlipHIcon />
                        </button>
                        <button className="w-10 h-8 bg-[#1A1A1A] border border-[#333] rounded flex items-center justify-center text-gray-400 hover:text-white">
                           <FlipVIcon />
                        </button>
                     </div>
                   </div>
                 </div>
               </section>

               <div className="h-px bg-[#222]"></div>

               {/* Compositing Section */}
               <section>
                 <h3 className="text-xs font-semibold text-white mb-4">Compositing</h3>
                 
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                       <span>Blend Mode</span>
                     </div>
                     <button className="w-full bg-[#1A1A1A] border border-[#333] rounded px-3 py-2 flex items-center justify-between text-xs text-white">
                       Normal <ChevronDown className="w-3 h-3 text-gray-500" />
                     </button>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs text-gray-400 mb-2">
                       <span>Opacity</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="flex-1 relative h-1 bg-[#333] rounded-lg">
                          <div className="absolute left-0 top-0 bottom-0 w-full bg-[#F5A623] rounded-full"></div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                       </div>
                       <span className="text-xs text-white min-w-[3rem] text-right">100%</span>
                     </div>
                   </div>
                 </div>
               </section>
            </div>
          </aside>
        </div>

        {/* 6. TIMELINE AREA */}
        <div className="h-[280px] bg-[#111111] border-t border-[#222] flex flex-col shrink-0">
          
          {/* Timeline Toolbar */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-[#222]">
            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-[#222] rounded text-[#F5A623] bg-[#222]/50"><MousePointer2 className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-[#333] mx-2"></div>
              <button className="p-1.5 hover:bg-[#222] rounded text-gray-400"><Undo className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-[#222] rounded text-gray-400"><Redo className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-[#333] mx-2"></div>
              <button className="p-1.5 hover:bg-[#222] rounded text-gray-400"><Scissors className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-[#222] rounded text-gray-400"><Trash2 className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-[#222] rounded text-gray-400"><Crop className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-[#222] rounded text-gray-400"><SplitSquareHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Split</span>
                  <input type="range" className="w-20 h-1 bg-[#333] rounded-lg appearance-none accent-gray-400" defaultValue={50} />
                  <Plus className="w-4 h-4" />
               </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden bg-[#0D0D0F]">
             
             {/* Time Ruler */}
             <div className="h-6 border-b border-[#222] flex relative ml-[120px] text-[10px] text-gray-500 font-mono items-end overflow-hidden">
                {Array.from({length: 15}).map((_, i) => (
                  <div key={i} className="flex-1 border-l border-[#222] h-2 relative min-w-[80px]">
                     <span className="absolute -top-4 -left-3">00:00:{i * 5 < 10 ? '0'+(i*5) : i*5}:00</span>
                  </div>
                ))}
             </div>

             {/* Playhead */}
             <div className="absolute top-0 bottom-0 left-[350px] w-px bg-[#F5A623] z-30 pointer-events-none shadow-[0_0_5px_rgba(245,166,35,0.5)]">
               <div className="absolute top-0 -translate-x-1/2 w-3 h-4 bg-[#F5A623] rounded-b-sm flex justify-center">
                  <div className="w-2 h-2 mt-1 bg-black/20 rounded-full" />
               </div>
             </div>

             {/* Tracks Container */}
             <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                
                {/* V2 Track */}
                <div className="flex h-12 border-b border-transparent hover:bg-white/5 transition-colors">
                  <div className="w-[120px] bg-[#111111] border-r border-[#222] flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] text-gray-400">
                     <span className="w-4 font-bold text-gray-300">V2</span>
                     <Eye className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                     <Lock className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                     <span>Video 2</span>
                  </div>
                  <div className="flex-1 relative">
                     {/* Title Clip */}
                     <div className="absolute left-[100px] w-[180px] h-8 top-2 bg-[#3A255A] border border-[#5A3A8A] rounded-sm flex items-center px-2 cursor-pointer">
                        <Type className="w-3 h-3 text-[#B794F4] mr-2" />
                        <span className="text-[10px] text-white font-medium">Title Here</span>
                     </div>
                  </div>
                </div>

                {/* V1 Track */}
                <div className="flex h-16 border-b border-[#222]/50 hover:bg-white/5 transition-colors">
                  <div className="w-[120px] bg-[#111111] border-r border-[#222] flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] text-gray-400">
                     <span className="w-4 font-bold text-gray-300">V1</span>
                     <Eye className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                     <SpeakerIcon />
                     <span>Video 1</span>
                  </div>
                  <div className="flex-1 relative flex items-center px-2">
                     <div className="absolute left-[20px] w-[800px] h-12 flex gap-1 cursor-pointer">
                        {/* Clip 1 */}
                        <div className="w-[160px] h-full rounded-sm overflow-hidden relative border border-[#F5A623] ring-1 ring-[#F5A623]">
                           <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/20" />
                           <span className="absolute bottom-1 left-1 text-[9px] text-white bg-black/50 px-1 rounded">Video_01</span>
                           {/* Handles */}
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
                           <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
                        </div>
                        {/* Clip 2 */}
                        <div className="w-[140px] h-full rounded-sm overflow-hidden relative border border-[#444]">
                           <img src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&q=80" className="w-full h-full object-cover" />
                        </div>
                        {/* Clip 3 */}
                        <div className="w-[150px] h-full rounded-sm overflow-hidden relative border border-[#444]">
                           <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" className="w-full h-full object-cover" />
                        </div>
                        {/* Clip 4 */}
                        <div className="w-[130px] h-full rounded-sm overflow-hidden relative border border-[#444]">
                           <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200&q=80" className="w-full h-full object-cover" />
                        </div>
                     </div>
                  </div>
                </div>

                {/* A1 Track */}
                <div className="flex h-14 border-b border-[#222]/50 hover:bg-white/5 transition-colors">
                  <div className="w-[120px] bg-[#111111] border-r border-[#222] flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] text-gray-400">
                     <span className="w-4 font-bold text-gray-300">A1</span>
                     <Lock className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                     <SpeakerIcon />
                     <span>Audio 1</span>
                  </div>
                  <div className="flex-1 relative flex items-center px-2">
                     <div className="absolute left-[20px] w-[790px] h-10 bg-[#1E4D3E] border border-[#2D6A56] rounded-sm flex overflow-hidden">
                        {/* Volume keyframe overlay mock */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                           <svg width="100%" height="100%">
                              <path d="M0,20 L150,20 L200,5 L800,5" fill="none" stroke="white" strokeWidth="1" opacity="0.7"/>
                              <circle cx="150" cy="20" r="3" fill="white" />
                              <circle cx="200" cy="5" r="3" fill="white" />
                           </svg>
                        </div>
                        <span className="absolute top-1 left-2 text-[9px] text-white/80 z-10">Music_Loop.mp3</span>
                        {/* Waveform */}
                        <svg className="w-full h-full text-[#4ADE80] opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                           <path d="M0 50 Q 5 20, 10 50 T 20 50 T 30 50 T 40 50 T 50 50 T 60 50 T 70 50 T 80 50 T 90 50 T 100 50" fill="currentColor"/>
                        </svg>
                     </div>
                  </div>
                </div>

                {/* A2 Track */}
                <div className="flex h-14 border-b border-[#222]/50 hover:bg-white/5 transition-colors">
                  <div className="w-[120px] bg-[#111111] border-r border-[#222] flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] text-gray-400">
                     <span className="w-4 font-bold text-gray-300">A2</span>
                     <Lock className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                     <SpeakerIcon />
                     <span>Audio 2</span>
                  </div>
                  <div className="flex-1 relative flex items-center px-2">
                     <div className="absolute left-[70px] w-[740px] h-10 bg-[#1D324F] border border-[#2B4B77] rounded-sm flex overflow-hidden">
                        <span className="absolute top-1 left-2 text-[9px] text-white/80 z-10">Interview_Audio.wav</span>
                        <svg className="w-full h-full text-[#60A5FA] opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
                           <path d="M0 50 Q 5 40, 10 50 T 20 50 T 30 50 T 40 50 T 50 50 T 60 50 T 70 50 T 80 50 T 90 50 T 100 50" fill="currentColor"/>
                        </svg>
                     </div>
                  </div>
                </div>

                {/* T1 Track */}
                <div className="flex h-12 border-b border-[#222]/50 hover:bg-white/5 transition-colors">
                  <div className="w-[120px] bg-[#111111] border-r border-[#222] flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] text-gray-400">
                     <span className="w-4 font-bold text-gray-300">T1</span>
                     <Lock className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                     <Type className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                     <span>Text 1</span>
                  </div>
                  <div className="flex-1 relative flex items-center px-2">
                     <div className="absolute left-[25px] w-[180px] h-8 bg-[#523A12] border border-[#7A561B] rounded-sm flex items-center justify-center cursor-pointer">
                        <span className="text-[10px] text-[#F5A623] font-medium">Subtitle Text Here</span>
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

// Helper Components
function NavItem({ icon, label, active = false, href = "#" }: { icon: React.ReactNode, label: string, active?: boolean, href?: string }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-6 py-2.5 cursor-pointer border-l-4 transition-colors ${active ? 'border-[#F5A623] bg-white/5 text-[#F5A623]' : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'}`}>
      <div className="[&>svg]:w-4 [&>svg]:h-4">{icon}</div>
      <span className="text-xs font-bold tracking-wide">{label}</span>
    </Link>
  );
}

function LibTab({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1.5 shrink-0 transition-colors ${active ? 'text-[#F5A623]' : 'text-gray-500 hover:text-gray-300'}`}>
      <div className="[&>svg]:w-4 [&>svg]:h-4">{icon}</div>
      <span className="text-[10px] font-medium">{label}</span>
      {active && <div className="w-full h-0.5 bg-[#F5A623] mt-1 rounded-t-sm" />}
    </button>
  );
}

function MediaItem({ title, duration, img }: { title: string, duration: string, img: string }) {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="aspect-video bg-[#222] rounded-md overflow-hidden relative border border-transparent group-hover:border-[#F5A623] transition-colors">
         <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="thumb" />
         <span className="absolute bottom-1 left-1 text-[9px] text-white bg-black/60 px-1 rounded">{duration}</span>
      </div>
      <div className="flex items-center justify-between mt-1">
         <span className="text-[10px] text-gray-300 truncate pr-2">{title}</span>
         <MoreVerticalIcon />
      </div>
    </div>
  );
}

// Tiny icons
function SparklesIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> }
function GridIcon() { return <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> }
function ListIcon() { return <svg className="w-4 h-4 text-gray-600 hover:text-gray-400 cursor-pointer" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg> }
function MoreVerticalIcon() { return <svg className="w-3 h-3 text-gray-500 hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg> }
function MusicIcon() { return <svg className="w-6 h-6 text-[#B794F4]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function FlipHIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20v2"/><path d="M12 14v2"/><path d="M12 8v2"/><path d="M12 2v2"/><path d="M17 12h2"/><path d="M21 12h2"/><path d="M7 12h2"/><path d="M3 12h2"/><path d="m16 8-4-4-4 4"/><path d="m16 16-4 4-4-4"/></svg> }
function FlipVIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h2"/><path d="M8 12h2"/><path d="M14 12h2"/><path d="M20 12h2"/><path d="M12 3v2"/><path d="M12 7v2"/><path d="M12 15v2"/><path d="M12 19v2"/><path d="m8 16 4 4 4-4"/><path d="m8 8 4-4 4 4"/></svg> }
function SpeakerIcon() { return <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> }
