'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Folder, Image as ImageIcon, Type, Sparkles, Music, Filter, Plus, 
  Play, SkipBack, SkipForward, Maximize, ClosedCaption, ChevronDown, 
  Undo, Redo, FolderOpen, Scissors, Trash2, ZoomIn, ZoomOut, Eye, Lock, 
  Volume2, Settings, ListVideo, Smartphone, MonitorPlay, ChevronRight,
  AlignLeft, AlignCenter, AlignRight
} from "lucide-react";

export default function EditorPage() {
  const mediaItems = [
    { title: "Interview_Fin...", type: "video", time: "00:54", thumb: "/feature_clipping.png" },
    { title: "B-Roll_01.mp4", type: "video", time: "00:12", thumb: "/feature_privacy.png" },
    { title: "B-Roll_02.mp4", type: "video", time: "00:10", thumb: "/feature_subtitles.png" },
    { title: "Logo_AudraClip.png", type: "image", time: "00:05", bg: "bg-black", icon: true },
    { title: "Background_Music", type: "audio", time: "02:45", bg: "bg-[#1A1A1A]", wave: true },
    { title: "Whoosh_Sound.mp3", type: "audio", time: "00:03", bg: "bg-[#1A1A1A]", wave: true }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-[#FAFAFA] text-black font-sans -m-8 relative overflow-hidden">
        
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

        {/* Top Area */}
        <div className="flex-1 flex overflow-hidden z-10">
          
          {/* Left Panel: Tools & Media */}
          <div className="w-[360px] border-r-4 border-black bg-white flex flex-col shrink-0">
            
            {/* Tool Categories */}
            <div className="flex justify-between border-b-4 border-black bg-[#FAFAFA] px-2 py-2">
              <button className="flex flex-col items-center gap-1 p-2 text-[#F5A623] border-b-4 border-[#F5A623] -mb-2.5 bg-white shadow-[2px_0px_0px_0px_rgba(0,0,0,1)] z-10"><Folder className="w-5 h-5" strokeWidth={2.5}/><span className="text-[9px] font-black uppercase">Media</span></button>
              <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-black transition-colors"><Sparkles className="w-5 h-5"/><span className="text-[9px] font-bold uppercase">Elements</span></button>
              <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-black transition-colors"><Type className="w-5 h-5"/><span className="text-[9px] font-bold uppercase">Text</span></button>
              <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-black transition-colors"><ListVideo className="w-5 h-5"/><span className="text-[9px] font-bold uppercase">Transitions</span></button>
              <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-black transition-colors"><Music className="w-5 h-5"/><span className="text-[9px] font-bold uppercase">Audio</span></button>
              <button className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-black transition-colors"><Filter className="w-5 h-5"/><span className="text-[9px] font-bold uppercase">Filters</span></button>
            </div>

            {/* Media Header */}
            <div className="p-4 border-b-4 border-black flex justify-between items-center bg-white">
              <h2 className="font-black uppercase text-lg">Project Media</h2>
              <button className="w-8 h-8 border-2 border-black flex items-center justify-center hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"><Plus className="w-4 h-4" strokeWidth={3}/></button>
            </div>

            {/* Media Tabs */}
            <div className="flex border-b-4 border-black bg-[#FAFAFA] px-4 gap-2 py-2">
              <button className="px-3 py-1 bg-[#F5A623] border-2 border-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">All</button>
              <button className="px-3 py-1 bg-white border-2 border-black font-bold uppercase text-xs hover:bg-gray-100 transition-colors">Video</button>
              <button className="px-3 py-1 bg-white border-2 border-black font-bold uppercase text-xs hover:bg-gray-100 transition-colors">Audio</button>
              <button className="px-3 py-1 bg-white border-2 border-black font-bold uppercase text-xs hover:bg-gray-100 transition-colors">Image</button>
            </div>

            {/* Media Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 bg-[#FAFAFA]">
              {mediaItems.map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className={`aspect-video border-4 border-black mb-2 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all ${item.bg || 'bg-gray-200'}`}>
                    {item.thumb && <img src={item.thumb} className="w-full h-full object-cover opacity-80" />}
                    {item.icon && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 bg-[#F5A623] border-4 border-black border-t-0 border-r-0"></div></div>}
                    {item.wave && (
                      <div className="absolute inset-0 flex items-center justify-center gap-1 p-2">
                         {[...Array(12)].map((_, j) => <div key={j} className="w-1.5 bg-[#00E5FF] border border-black" style={{height: `${20 + Math.random() * 80}%`}}></div>)}
                      </div>
                    )}
                  </div>
                  <div className="font-black text-xs truncate px-1">{item.title}</div>
                  <div className="text-[10px] font-bold text-gray-500 px-1">{item.time}</div>
                </div>
              ))}
              <div className="aspect-video border-4 border-black border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#FFEDF4] hover:border-solid transition-colors mb-2">
                <Plus className="w-6 h-6" strokeWidth={3}/>
                <span className="font-black text-xs uppercase">Add Media</span>
              </div>
            </div>
          </div>

          {/* Middle Panel: Canvas */}
          <div className="flex-1 flex flex-col bg-gray-200 border-r-4 border-black relative">
            
            {/* Canvas Area */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
               <div className="absolute top-4 left-4 bg-white border-4 border-black px-3 py-1 font-black text-xs uppercase flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:bg-[#F5A623] transition-colors">
                 <MonitorPlay className="w-4 h-4" strokeWidth={3}/> 16:9 <ChevronDown className="w-3 h-3"/>
               </div>

               {/* Video Frame */}
               <div className="w-full max-w-3xl aspect-video bg-gray-900 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                  <img src="/feature_clipping.png" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity" />
                  
                  {/* Transform Box UI overlay */}
                  <div className="absolute inset-4 border-2 border-white/50 pointer-events-none"></div>

                  {/* Selected Text Element */}
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 border-2 border-[#F5A623] border-dashed p-4 cursor-move group">
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#F5A623] border-2 border-black"></div>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#F5A623] border-2 border-black"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#F5A623] border-2 border-black"></div>
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#F5A623] border-2 border-black"></div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-white leading-tight" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                        Welcome to Audra Clip,<br/>your AI-powered video editing platform.
                      </span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Video Controls */}
            <div className="h-14 border-t-4 border-black bg-white px-6 flex items-center justify-between shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.05)] z-20 relative">
              <div className="flex items-center gap-4">
                <button className="hover:text-[#F5A623] transition-colors"><SkipBack className="w-5 h-5 fill-current" strokeWidth={2}/></button>
                <button className="hover:text-[#00E5FF] transition-colors"><Play className="w-6 h-6 fill-current" strokeWidth={2}/></button>
                <button className="hover:text-[#F5A623] transition-colors"><SkipForward className="w-5 h-5 fill-current" strokeWidth={2}/></button>
                <div className="font-black text-sm ml-4 border-l-4 border-black pl-4 py-1">00:00:01,200 <span className="text-gray-400">/ 00:01:23,400</span></div>
              </div>
              
              <div className="flex items-center gap-6">
                <button className="flex items-center justify-center border-2 border-black px-2 py-0.5 font-black text-xs hover:bg-[#F5A623] transition-colors"><ClosedCaption className="w-5 h-5 mr-1" strokeWidth={3}/> CC</button>
                <button className="hover:text-[#F5A623] transition-colors"><Maximize className="w-5 h-5" strokeWidth={3}/></button>
                <div className="flex items-center gap-1 border-2 border-black px-2 py-0.5 font-black text-xs cursor-pointer hover:bg-gray-100">
                  Fit <ChevronDown className="w-3 h-3"/>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Properties */}
          <div className="w-[320px] bg-white flex flex-col shrink-0">
            {/* Properties Tabs */}
            <div className="flex border-b-4 border-black bg-[#FAFAFA] text-[10px] font-black uppercase">
              <button className="flex-1 py-3 border-b-4 border-[#F5A623] text-[#F5A623] -mb-1 bg-white">Video</button>
              <button className="flex-1 py-3 text-gray-500 hover:text-black">Audio</button>
              <button className="flex-1 py-3 text-gray-500 hover:text-black">Text</button>
              <button className="flex-1 py-3 text-gray-500 hover:text-black">Effects</button>
              <button className="flex-1 py-3 text-gray-500 hover:text-black">Adjust</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#FAFAFA]">
              
              {/* Transform Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black uppercase text-sm">Transform</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Zoom</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 border-2 border-black relative">
                        <div className="absolute w-3 h-4 bg-[#00E5FF] border-2 border-black top-1/2 -translate-y-1/2 left-[30%] cursor-pointer"></div>
                      </div>
                      <span className="w-8 text-right">100%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Position</span>
                    <div className="flex gap-2">
                      <div className="flex items-center bg-white border-2 border-black px-2 py-1 w-16">
                        <span className="text-gray-400 mr-1">X</span> 0
                      </div>
                      <div className="flex items-center bg-white border-2 border-black px-2 py-1 w-16">
                        <span className="text-gray-400 mr-1">Y</span> 0
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Rotation</span>
                    <span className="bg-white border-2 border-black px-2 py-1 w-16 text-right">0°</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Anchor Point</span>
                    <div className="flex gap-2">
                      <div className="flex items-center bg-white border-2 border-black px-2 py-1 w-16">
                        <span className="text-gray-400 mr-1">X</span> 0
                      </div>
                      <div className="flex items-center bg-white border-2 border-black px-2 py-1 w-16">
                        <span className="text-gray-400 mr-1">Y</span> 0
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compositing Section */}
              <div className="pt-4 border-t-4 border-black">
                <h3 className="font-black uppercase text-sm mb-4">Compositing</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Blend Mode</span>
                    <div className="relative w-28">
                      <select className="w-full bg-white border-2 border-black px-2 py-1 font-bold outline-none appearance-none cursor-pointer">
                        <option>Normal</option>
                        <option>Multiply</option>
                        <option>Screen</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" strokeWidth={3} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Opacity</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 border-2 border-black relative">
                        <div className="absolute inset-y-0 left-0 bg-[#F5A623] border-r-2 border-black w-full"></div>
                        <div className="absolute w-3 h-4 bg-white border-2 border-black top-1/2 -translate-y-1/2 right-0 cursor-pointer"></div>
                      </div>
                      <span className="w-8 text-right">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t-4 border-black space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#F5A623] border-2 border-black flex items-center justify-center">
                       <div className="w-2 h-2 bg-black"></div>
                    </div>
                    <span className="font-black text-xs uppercase">Stabilization</span>
                  </div>
                  <div className="w-8 h-4 bg-[#F5A623] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-2.5 h-2.5 bg-white border-2 border-black rounded-full absolute right-0.5"></div>
                  </div>
                </div>

                {['Speed', 'Reverse', 'Crop', 'Color', 'Effects', 'Shadow'].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-100 p-1 -mx-1">
                     <span className="font-black text-xs uppercase">{item}</span>
                     {item === 'Speed' ? (
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-gray-500">Normal</span>
                         <ChevronRight className="w-4 h-4" strokeWidth={3}/>
                       </div>
                     ) : item === 'Reverse' ? (
                        <div className="w-8 h-4 bg-gray-200 border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                          <div className="w-2.5 h-2.5 bg-white border-2 border-black rounded-full absolute left-0.5"></div>
                        </div>
                     ) : (
                       <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3}/>
                     )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Area: Timeline */}
        <div className="h-[280px] border-t-4 border-black bg-white flex flex-col shrink-0 z-20 relative">
          
          {/* Timeline Toolbar */}
          <div className="h-12 border-b-4 border-black bg-[#FAFAFA] flex items-center px-4 justify-between">
            <div className="flex gap-4">
              <button className="p-1.5 hover:bg-[#FFEDF4] border-2 border-transparent hover:border-black transition-all rounded-sm"><Undo className="w-4 h-4" strokeWidth={3}/></button>
              <button className="p-1.5 hover:bg-[#FFEDF4] border-2 border-transparent hover:border-black transition-all rounded-sm"><Redo className="w-4 h-4" strokeWidth={3}/></button>
              <div className="w-0.5 h-6 bg-black mx-1"></div>
              <button className="p-1.5 hover:bg-[#00E5FF] border-2 border-transparent hover:border-black transition-all rounded-sm"><FolderOpen className="w-4 h-4" strokeWidth={3}/></button>
              <button className="p-1.5 hover:bg-[#F5A623] border-2 border-transparent hover:border-black transition-all rounded-sm"><Scissors className="w-4 h-4" strokeWidth={3}/></button>
              <button className="p-1.5 hover:bg-red-400 border-2 border-transparent hover:border-black transition-all rounded-sm"><Trash2 className="w-4 h-4" strokeWidth={3}/></button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase mr-2">Snap</span>
                <div className="w-10 h-5 bg-[#F5A623] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-3 h-3 bg-white border-2 border-black rounded-full absolute right-0.5"></div>
                </div>
              </div>
              <div className="w-0.5 h-6 bg-black mx-1"></div>
              <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black"><ZoomOut className="w-4 h-4" strokeWidth={3}/></button>
                <div className="w-32 h-2 bg-gray-200 border-2 border-black relative mx-2">
                  <div className="absolute w-4 h-4 bg-[#F5A623] border-2 border-black top-1/2 -translate-y-1/2 left-[40%] cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></div>
                </div>
                <button className="p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black"><ZoomIn className="w-4 h-4" strokeWidth={3}/></button>
              </div>
            </div>
          </div>

          {/* Timeline Tracks */}
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Time Ruler */}
            <div className="h-6 border-b-2 border-black bg-white flex relative">
              <div className="w-40 shrink-0 border-r-4 border-black bg-[#FAFAFA]"></div>
              <div className="flex-1 relative flex justify-between px-4 items-center text-[9px] font-black font-mono text-gray-500">
                 <span>00:00:00</span><span>00:00:10</span><span>00:00:20</span><span>00:00:30</span><span>00:00:40</span><span>00:00:50</span><span>00:01:00</span><span>00:01:10</span><span>00:01:20</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto relative bg-[#FAFAFA]">
              
              {/* Playhead */}
              <div className="absolute left-[25%] top-0 bottom-0 w-0.5 bg-[#F5A623] z-30 pointer-events-none">
                 <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-4 bg-[#F5A623] border-2 border-black clip-playhead flex items-center justify-center">
                    <div className="text-[8px] font-black absolute -top-4 text-[#F5A623]">X</div>
                 </div>
              </div>

              {/* Track V3 (Text) */}
              <div className="flex h-12 border-b-2 border-gray-200 group">
                <div className="w-40 bg-white border-r-4 border-black shrink-0 flex items-center gap-3 px-3 text-[10px] font-black uppercase text-gray-600">
                  <span className="w-4">V3</span>
                  <Lock className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <Eye className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <span className="flex-1 text-right">Overlay</span>
                </div>
                <div className="flex-1 relative p-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGxpbmUgeDE9IjIwIiB5MT0iMCIgeDI9IjIwIiB5Mj0iNDAiIHN0cm9rZT0iI2U1ZTVlNSIgc3Ryb2tlLXdpZHRoPSIxIiAvPjwvc3ZnPg==')]">
                   <div className="absolute left-[15%] top-1 h-[80%] w-[12%] bg-[#D8B4E2] border-4 border-black border-r-0 flex items-center px-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                     <span className="text-[9px] font-black truncate">T Welcome to Audra Clip,</span>
                   </div>
                   <div className="absolute left-[27%] top-1 h-[80%] w-[18%] bg-[#D8B4E2] border-4 border-black flex items-center px-2 cursor-pointer hover:bg-opacity-80 transition-opacity">
                     <span className="text-[9px] font-black truncate">T your AI-powered video editing platform.</span>
                   </div>
                </div>
              </div>

              {/* Track V2 (Video) */}
              <div className="flex h-16 border-b-2 border-gray-200 group">
                <div className="w-40 bg-white border-r-4 border-black shrink-0 flex items-center gap-3 px-3 text-[10px] font-black uppercase text-gray-600">
                  <span className="w-4">V2</span>
                  <Lock className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <Eye className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <span className="flex-1 text-right">Video</span>
                </div>
                <div className="flex-1 relative p-1 bg-gray-100">
                   {/* Empty Track */}
                </div>
              </div>

              {/* Track V1 (Video Main) */}
              <div className="flex h-16 border-b-2 border-gray-200 group">
                <div className="w-40 bg-white border-r-4 border-black shrink-0 flex items-center gap-3 px-3 text-[10px] font-black uppercase text-gray-600">
                  <span className="w-4">V1</span>
                  <Lock className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <Eye className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <span className="flex-1 text-right">Video</span>
                </div>
                <div className="flex-1 relative p-1">
                   <div className="h-full w-[90%] bg-white border-4 border-[#F5A623] flex overflow-hidden cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="h-full w-24 border-r-2 border-black shrink-0">
                          <img src="/feature_clipping.png" className="w-full h-full object-cover mix-blend-luminosity opacity-80" />
                        </div>
                      ))}
                   </div>
                </div>
              </div>

              {/* Track A1 (Audio Main) */}
              <div className="flex h-14 border-b-2 border-gray-200 group">
                <div className="w-40 bg-white border-r-4 border-black shrink-0 flex items-center gap-3 px-3 text-[10px] font-black uppercase text-gray-600">
                  <span className="w-4">A1</span>
                  <Lock className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <Volume2 className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <span className="flex-1 text-right">Audio</span>
                </div>
                <div className="flex-1 relative p-1">
                   <div className="h-full w-[90%] bg-[#00E5FF] border-4 border-black flex items-center px-1 overflow-hidden opacity-90 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="w-full h-full flex items-center justify-between gap-[2px] opacity-60">
                         {[...Array(200)].map((_, i) => (
                           <div key={i} className="w-1 bg-black" style={{height: `${10 + Math.random() * 90}%`}}></div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

              {/* Track A2 (Music) */}
              <div className="flex h-14 group">
                <div className="w-40 bg-white border-r-4 border-black shrink-0 flex items-center gap-3 px-3 text-[10px] font-black uppercase text-gray-600">
                  <span className="w-4">A2</span>
                  <Lock className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <Volume2 className="w-3 h-3 hover:text-black cursor-pointer"/>
                  <span className="flex-1 text-right">Music</span>
                </div>
                <div className="flex-1 relative p-1">
                   <div className="h-full w-[100%] bg-[#2B4B7C] border-4 border-black flex items-center px-1 overflow-hidden cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <div className="w-full h-full flex items-center justify-between gap-[2px] opacity-40">
                         {[...Array(200)].map((_, i) => (
                           <div key={i} className="w-1 bg-[#00E5FF]" style={{height: `${5 + Math.random() * 50}%`}}></div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
