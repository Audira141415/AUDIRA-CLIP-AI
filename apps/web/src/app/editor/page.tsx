'use client';

import { 
  Home, Video, Clapperboard, Type, Crop, PlaySquare, 
  BarChart2, Users, Settings as SettingsIcon, HelpCircle, Bell, 
  Download, Upload, Filter, Plus, ChevronDown, Monitor, 
  RotateCw, Play, Pause, SkipBack, SkipForward, Maximize2, 
  MousePointer2, Undo, Redo, Scissors, Trash2, SplitSquareHorizontal, Eye, Lock
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function AdvancedNLEEditor() {
  // Video Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Toggle Play/Pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
          }).catch(error => {
            console.error("Video playback failed:", error);
            setIsPlaying(false);
            // Ignore the error to prevent crash
          });
        }
      }
    }
  };

  // Format time (HH:MM:SS:FF) assuming 30fps
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00:00:00";
    const pad = (num: number, size: number) => ('000' + num).slice(size * -1);
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const frames = Math.floor((timeInSeconds % 1) * 30);
    return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}:${pad(frames, 2)}`;
  };

  return (
    <div className="h-screen w-full bg-[#FAFAFA] text-gray-700 flex font-sans overflow-hidden">
      
      {/* 1. LEFT GLOBAL SIDEBAR */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col z-50">
        <div className="h-16 flex items-center px-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#F5A623] rounded-sm shadow-sm"></div>
            <span className="font-black text-gray-900 tracking-widest text-lg">AUDIRA <span className="text-[#F5A623]">CLIP</span></span>
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
          <button className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors">
            <span className="text-xs">{"<"}</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. TOP HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                Untitled Project <ChevronDown className="w-4 h-4 text-gray-400" />
              </h1>
              <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Saved 2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" />
            <Bell className="w-5 h-5 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors" />
            <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold text-xs shadow-inner">AU</div>
            <button className="h-9 px-4 bg-[#F5A623] hover:bg-orange-500 text-white font-bold text-sm rounded-lg flex items-center gap-2 transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Export <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* MIDDLE AREA (Library, Preview, Properties) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* 3. MEDIA LIBRARY (Left Panel) */}
          <aside className="w-[380px] bg-white border-r border-gray-200 flex flex-col shrink-0">
            {/* Tabs */}
            <div className="h-16 border-b border-gray-200 flex items-center px-4 gap-6 overflow-x-auto no-scrollbar">
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
                <button className="flex-1 h-10 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2 text-sm text-gray-700 font-medium transition-colors shadow-sm">
                  <Upload className="w-4 h-4" /> Upload Media <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                <button className="w-10 h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-900">Project Media <span className="bg-gray-100 px-1.5 py-0.5 rounded ml-1 text-gray-500 font-semibold">24</span></span>
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
                  <div className="aspect-video bg-purple-50 rounded-lg border border-purple-200 flex flex-col justify-between p-2 shadow-sm">
                     <div className="flex justify-center mt-2">
                        <MusicIcon />
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-[9px] text-gray-700 bg-white/80 backdrop-blur-sm px-1 rounded font-medium">02:45</span>
                       <MoreVerticalIcon />
                     </div>
                  </div>
                  <div className="col-span-3 text-[10px] font-medium text-gray-500 mt-1">Music_Loop.mp3</div>
                </div>
              </div>
            </div>
          </aside>

          {/* 4. CENTER PREVIEW AREA */}
          <div className="flex-1 flex flex-col bg-gray-50 border-r border-gray-200 relative">
            <div className="h-12 flex items-center justify-between px-4 z-10">
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1 hover:text-gray-900 cursor-pointer bg-white px-2 py-1 rounded shadow-sm border border-gray-200">Fit <ChevronDown className="w-3 h-3" /></span>
                <span className="flex items-center gap-1 hover:text-gray-900 cursor-pointer bg-white px-2 py-1 rounded shadow-sm border border-gray-200">100% <ChevronDown className="w-3 h-3" /></span>
                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                <Undo className="w-4 h-4 hover:text-gray-900 cursor-pointer" />
                <Redo className="w-4 h-4 hover:text-gray-900 cursor-pointer" />
              </div>
              <div className="flex items-center gap-3 text-xs font-medium">
                 <button className="px-3 py-1.5 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 text-gray-700 transition-colors">Save</button>
                 <Eye className="w-4 h-4 text-gray-500 hover:text-gray-900 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-6 min-h-0 relative">
               {/* Grid Pattern Background for Canvas */}
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               
               {/* 16:9 Canvas container */}
               <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden relative shadow-xl border border-gray-300 z-10 group">
                  
                  {/* REAL VIDEO PLAYER */}
                  <video 
                    ref={videoRef}
                    className="w-full h-full object-cover bg-black"
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    onTimeUpdate={() => {
                      if (videoRef.current) {
                        setCurrentTime(videoRef.current.currentTime);
                      }
                    }}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(videoRef.current.duration);
                      }
                    }}
                    onEnded={() => setIsPlaying(false)}
                    onClick={togglePlay}
                  />
                  
                  {/* Playhead indicator bar on video (Interactive representation) */}
                  <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-white/30 rounded-full overflow-visible opacity-0 group-hover:opacity-100 transition-opacity">
                     <div 
                        className="absolute left-0 top-0 bottom-0 bg-[#F5A623] rounded-full"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                     ></div>
                     <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F5A623] border-2 border-white rounded-full shadow-md -ml-2"
                        style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                     ></div>
                  </div>
               </div>
            </div>

            {/* Player Controls */}
            <div className="h-14 flex items-center justify-between px-6 bg-white border-t border-gray-200 z-10 shadow-sm">
               <div className="text-xs font-mono text-gray-500 font-medium">
                 <span className="text-gray-900 font-bold">{formatTime(currentTime)}</span> / {formatTime(duration)}
               </div>
               <div className="flex items-center gap-6">
                 <SkipBack 
                   className="w-4 h-4 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors" 
                   onClick={() => {
                     if (videoRef.current) {
                       videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                     }
                   }}
                 />
                 <div 
                   className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 cursor-pointer transition-colors"
                   onClick={togglePlay}
                 >
                   {isPlaying ? (
                     <Pause className="w-4 h-4 text-gray-900" fill="currentColor" />
                   ) : (
                     <Play className="w-4 h-4 text-gray-900 ml-0.5" fill="currentColor" />
                   )}
                 </div>
                 <SkipForward 
                   className="w-4 h-4 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors" 
                   onClick={() => {
                     if (videoRef.current) {
                       videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
                     }
                   }}
                 />
               </div>
               <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">16:9 <ChevronDown className="w-3 h-3" /></span>
                  <Maximize2 className="w-4 h-4 hover:text-gray-900 cursor-pointer" />
               </div>
            </div>
          </div>

          {/* 5. RIGHT PROPERTIES PANEL */}
          <aside className="w-[300px] bg-white flex flex-col shrink-0">
            <div className="h-14 border-b border-gray-200 flex px-4 gap-4 overflow-x-auto no-scrollbar items-end shadow-sm z-10">
              <button className="pb-3 text-sm font-bold text-gray-900 border-b-2 border-[#F5A623]">Video</button>
              <button className="pb-3 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors">Audio</button>
              <button className="pb-3 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors">Effects</button>
              <button className="pb-3 text-sm font-semibold text-gray-400 hover:text-gray-700 transition-colors">Adjust</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8 bg-white">
               {/* Transform Section */}
               <section>
                 <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Transform</h3>
                 
                 <div className="space-y-5">
                   <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                       <span>Scale</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <input type="range" className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none accent-[#F5A623]" defaultValue={100} />
                       <span className="text-xs bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-md text-gray-700 font-mono min-w-[3.5rem] text-center shadow-sm">100%</span>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                       <span>Position</span>
                     </div>
                     <div className="flex gap-3">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 flex items-center justify-between shadow-sm focus-within:border-[#F5A623] focus-within:ring-1 focus-within:ring-[#F5A623]">
                          <span className="text-xs text-gray-400 font-medium">X</span>
                          <input type="text" defaultValue="0" className="w-10 bg-transparent text-xs text-gray-900 font-mono text-right focus:outline-none" />
                        </div>
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 flex items-center justify-between shadow-sm focus-within:border-[#F5A623] focus-within:ring-1 focus-within:ring-[#F5A623]">
                          <span className="text-xs text-gray-400 font-medium">Y</span>
                          <input type="text" defaultValue="0" className="w-10 bg-transparent text-xs text-gray-900 font-mono text-right focus:outline-none" />
                        </div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                       <span>Rotate</span>
                     </div>
                     <div className="flex gap-3 items-center">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 shadow-sm focus-within:border-[#F5A623] focus-within:ring-1 focus-within:ring-[#F5A623]">
                          <input type="text" defaultValue="0°" className="w-full bg-transparent text-xs text-gray-900 font-mono focus:outline-none" />
                        </div>
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm cursor-pointer hover:bg-gray-200">
                           <RotateCw className="w-4 h-4 text-gray-600" />
                        </div>
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                       <span>Flip</span>
                     </div>
                     <div className="flex gap-2">
                        <button className="flex-1 h-9 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 shadow-sm transition-colors">
                           <FlipHIcon />
                        </button>
                        <button className="flex-1 h-9 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 shadow-sm transition-colors">
                           <FlipVIcon />
                        </button>
                     </div>
                   </div>
                 </div>
               </section>

               <div className="h-px bg-gray-200 w-full"></div>

               {/* Compositing Section */}
               <section>
                 <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Compositing</h3>
                 
                 <div className="space-y-5">
                   <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                       <span>Blend Mode</span>
                     </div>
                     <div className="relative">
                       <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs font-medium text-gray-900 shadow-sm focus:outline-none focus:border-[#F5A623]">
                         <option>Normal</option>
                         <option>Multiply</option>
                         <option>Screen</option>
                         <option>Overlay</option>
                       </select>
                       <ChevronDown className="w-3 h-3 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                     </div>
                   </div>

                   <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-600 mb-2">
                       <span>Opacity</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <input type="range" className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none accent-[#F5A623]" defaultValue={100} />
                       <span className="text-xs bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-md text-gray-700 font-mono min-w-[3.5rem] text-center shadow-sm">100%</span>
                     </div>
                   </div>
                 </div>
               </section>
            </div>
          </aside>
        </div>

        {/* 6. TIMELINE AREA */}
        <div className="h-[320px] bg-white border-t border-gray-200 flex flex-col shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-20">
          
          {/* Timeline Toolbar */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-1">
              <button className="p-1.5 hover:bg-gray-200 rounded-md text-[#F5A623] bg-orange-100/50 transition-colors"><MousePointer2 className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <button className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"><Undo className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"><Redo className="w-4 h-4" /></button>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <button className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"><Scissors className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"><Crop className="w-4 h-4" /></button>
              <button className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"><SplitSquareHorizontal className="w-4 h-4" /></button>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <span>Zoom</span>
                  <input type="range" className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none accent-gray-400" defaultValue={50} />
               </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative overflow-hidden bg-white">
             
             {/* Time Ruler */}
             <div className="h-7 border-b border-gray-200 flex relative ml-[120px] text-[10px] text-gray-400 font-mono font-medium items-end overflow-hidden bg-gray-50">
                {Array.from({length: 15}).map((_, i) => (
                  <div key={i} className="flex-1 border-l border-gray-300 h-2.5 relative min-w-[80px]">
                     <span className="absolute -top-4 -left-3 text-gray-500">00:00:{i * 5 < 10 ? '0'+(i*5) : i*5}:00</span>
                  </div>
                ))}
             </div>

             {/* Dynamic Playhead */}
             <div 
               className="absolute top-0 bottom-0 w-px bg-[#F5A623] z-30 pointer-events-none shadow-[0_0_8px_rgba(245,166,35,0.8)]"
               style={{ left: `calc(120px + ${(currentTime / (duration || 1)) * 800}px)` }} // Mocking movement
             >
               <div className="absolute top-0 -translate-x-1/2 w-3.5 h-4 bg-[#F5A623] rounded-b-sm flex justify-center shadow-sm">
                  <div className="w-1.5 h-1.5 mt-1 bg-white rounded-full shadow-inner" />
               </div>
             </div>

             {/* Tracks Container */}
             <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-10 pt-2">
                
                {/* V2 Track */}
                <div className="flex h-12 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-[120px] bg-white border-r border-gray-200 flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] font-semibold text-gray-500">
                     <span className="w-4 text-gray-900">V2</span>
                     <Eye className="w-3.5 h-3.5 hover:text-gray-900 cursor-pointer transition-colors" />
                     <Lock className="w-3.5 h-3.5 hover:text-gray-900 cursor-pointer transition-colors" />
                     <span>Video 2</span>
                  </div>
                  <div className="flex-1 relative">
                     {/* Title Clip */}
                     <div className="absolute left-[100px] w-[180px] h-8 top-2 bg-purple-100 border border-purple-300 rounded-md flex items-center px-2 cursor-pointer shadow-sm hover:border-purple-400 transition-colors">
                        <Type className="w-3.5 h-3.5 text-purple-600 mr-2" />
                        <span className="text-[10px] text-purple-900 font-bold">Title Here</span>
                     </div>
                  </div>
                </div>

                {/* V1 Track */}
                <div className="flex h-16 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="w-[120px] bg-white border-r border-gray-200 flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] font-semibold text-gray-500">
                     <span className="w-4 text-gray-900">V1</span>
                     <Eye className="w-3.5 h-3.5 hover:text-gray-900 cursor-pointer transition-colors" />
                     <SpeakerIcon />
                     <span>Video 1</span>
                  </div>
                  <div className="flex-1 relative flex items-center px-2">
                     <div className="absolute left-0 w-[800px] h-12 flex gap-1 cursor-pointer">
                        {/* Clip 1 */}
                        <div className="w-full h-full rounded-md overflow-hidden relative border-2 border-[#F5A623] shadow-[0_0_0_1px_rgba(245,166,35,0.3)] z-10">
                           <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/10" />
                           <span className="absolute bottom-1 left-1 text-[9px] text-white font-semibold bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm">Big_Buck_Bunny.mp4</span>
                           {/* Handles */}
                           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-white border-r border-[#F5A623] cursor-col-resize shadow-md" />
                           <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white border-l border-[#F5A623] cursor-col-resize shadow-md" />
                        </div>
                     </div>
                  </div>
                </div>

                {/* A1 Track */}
                <div className="flex h-14 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="w-[120px] bg-white border-r border-gray-200 flex items-center px-3 gap-3 shrink-0 sticky left-0 z-20 text-[10px] font-semibold text-gray-500">
                     <span className="w-4 text-gray-900">A1</span>
                     <Lock className="w-3.5 h-3.5 hover:text-gray-900 cursor-pointer transition-colors" />
                     <SpeakerIcon />
                     <span>Audio 1</span>
                  </div>
                  <div className="flex-1 relative flex items-center px-2">
                     <div className="absolute left-[0px] w-[800px] h-10 bg-green-50 border border-green-200 rounded-md flex overflow-hidden shadow-sm hover:border-green-300 transition-colors cursor-pointer">
                        {/* Volume keyframe overlay mock */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                           <svg width="100%" height="100%">
                              <path d="M0,20 L150,20 L200,5 L800,5" fill="none" stroke="#22C55E" strokeWidth="1.5" opacity="0.8"/>
                              <circle cx="150" cy="20" r="3.5" fill="white" stroke="#22C55E" strokeWidth="1.5" />
                              <circle cx="200" cy="5" r="3.5" fill="white" stroke="#22C55E" strokeWidth="1.5" />
                           </svg>
                        </div>
                        <span className="absolute top-1 left-2 text-[9px] font-bold text-green-800 z-10 bg-white/50 px-1 rounded">Audio_Track.mp3</span>
                        {/* Waveform */}
                        <svg className="w-full h-full text-green-400 opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
                           <path d="M0 50 Q 5 20, 10 50 T 20 50 T 30 50 T 40 50 T 50 50 T 60 50 T 70 50 T 80 50 T 90 50 T 100 50" fill="currentColor"/>
                        </svg>
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
    <Link href={href} className={`flex items-center gap-3 px-6 py-2.5 cursor-pointer border-l-4 transition-colors ${active ? 'border-[#F5A623] bg-[#FFF8EB] text-[#F5A623]' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
      <div className="[&>svg]:w-4 [&>svg]:h-4">{icon}</div>
      <span className="text-xs font-bold tracking-wide">{label}</span>
    </Link>
  );
}

function LibTab({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1.5 shrink-0 transition-colors pt-3 ${active ? 'text-[#F5A623]' : 'text-gray-500 hover:text-gray-900'}`}>
      <div className="[&>svg]:w-4 [&>svg]:h-4">{icon}</div>
      <span className="text-[10px] font-bold">{label}</span>
      <div className={`w-full h-0.5 mt-1.5 rounded-t-sm transition-colors ${active ? 'bg-[#F5A623]' : 'bg-transparent'}`} />
    </button>
  );
}

function MediaItem({ title, duration, img }: { title: string, duration: string, img: string }) {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative border-2 border-transparent group-hover:border-[#F5A623] transition-colors shadow-sm">
         <img src={img} className="w-full h-full object-cover transition-opacity" alt="thumb" />
         <span className="absolute bottom-1 left-1 text-[9px] font-semibold text-white bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm">{duration}</span>
      </div>
      <div className="flex items-center justify-between mt-1.5 px-0.5">
         <span className="text-[10px] font-semibold text-gray-700 truncate pr-2 group-hover:text-gray-900 transition-colors">{title}</span>
         <MoreVerticalIcon />
      </div>
    </div>
  );
}

// Tiny icons
function SparklesIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> }
function GridIcon() { return <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> }
function ListIcon() { return <svg className="w-4 h-4 text-gray-400 hover:text-gray-900 cursor-pointer transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg> }
function MoreVerticalIcon() { return <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg> }
function MusicIcon() { return <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> }
function FlipHIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20v2"/><path d="M12 14v2"/><path d="M12 8v2"/><path d="M12 2v2"/><path d="M17 12h2"/><path d="M21 12h2"/><path d="M7 12h2"/><path d="M3 12h2"/><path d="m16 8-4-4-4 4"/><path d="m16 16-4 4-4-4"/></svg> }
function FlipVIcon() { return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12h2"/><path d="M8 12h2"/><path d="M14 12h2"/><path d="M20 12h2"/><path d="M12 3v2"/><path d="M12 7v2"/><path d="M12 15v2"/><path d="M12 19v2"/><path d="m8 16 4 4 4-4"/><path d="m8 8 4-4 4 4"/></svg> }
function SpeakerIcon() { return <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> }
