'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Upload, MoreHorizontal, Wand2, Search, Plus, Play, Trash2, Copy, AlignLeft, AlignCenter, AlignRight, Maximize, ClosedCaption, Settings, ChevronDown, ChevronRight, Eye, Volume2, Type, SkipBack, SkipForward, Music } from "lucide-react";

import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useVideoStore } from "@/store/useVideoStore";
import PageHero from "@/components/ui/PageHero";

function SubtitleStudioContent() {
  const [subtitles, setSubtitles] = useState([
    { id: 1, start: "00:00:01,200", end: "00:00:04,000", text: "Welcome to Audra Clip,\nyour AI-powered video editing platform.", active: true },
    { id: 2, start: "00:00:04,200", end: "00:00:07,000", text: "Edit faster, smarter,\nand create amazing content.", active: false },
    { id: 3, start: "00:00:07,200", end: "00:00:10,000", text: "From auto reframing to smart captions,\nwe've got you covered.", active: false },
    { id: 4, start: "00:00:10,200", end: "00:00:13,000", text: "Let's build something\nextraordinary together.", active: false },
    { id: 5, start: "00:00:13,200", end: "00:00:16,000", text: "Get started now\nand bring your ideas to life.", active: false }
  ]);
  const searchParams = useSearchParams();
  const videoId = searchParams.get('videoId');
  const { currentVideo, fetchVideoDetails, exportClip } = useVideoStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAutoSubtitleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    const formData = new FormData();
    formData.append('audio', file);
    if (videoId) formData.append('videoId', videoId);

    try {
      const res = await fetch('http://localhost:3004/subtitles/generate', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('Subtitles generated successfully! (VTT saved to DB)');
        // In a real app we'd parse data.data.vtt to update the subtitles array
        // For demonstration, we'll just add the raw response as one block
        setSubtitles(prev => [...prev, { id: Date.now(), start: "00:00:00", end: "00:00:05", text: data.data.vtt, active: false }]);
      } else {
        alert('Failed to generate subtitles.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to subtitle service.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Subtitle configs
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState('#FFFFFF');
  const [bgOpacity, setBgOpacity] = useState(60);

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails(videoId);
    }
  }, [videoId, fetchVideoDetails]);

  const handleApplyAndRender = async () => {
    if (!videoId) return;
    setIsExporting(true);
    try {
      await exportClip(videoId, {
        fontFamily,
        fontSize,
        color,
        bgOpacity
      }, 'center');
      alert('Subtitle styles applied and export started!');
    } catch (e) {
      alert('Failed to start export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-[#FAFAFA] text-black font-sans -m-8 relative overflow-hidden">
        
        {/* Background Dot Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

        <div className="px-8 pt-8 z-10 bg-[#FAFAFA]">
          <PageHero
            title="Subtitle Studio"
            description="Create, edit, and style subtitles with ease."
            badge="BETA"
            imageSrc="/images/hero_subtitles.png"
            imageAlt="Subtitles Hero"
            rightContent={
              <>
                <button className="flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Upload className="w-4 h-4" strokeWidth={3} /> Import Subtitle
                </button>
                <button className="flex items-center justify-center bg-white border-4 border-black w-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <MoreHorizontal className="w-5 h-5" strokeWidth={3} />
                </button>
                <button onClick={() => fileInputRef.current?.click()} disabled={isGenerating} className="flex items-center gap-2 bg-[#00E5FF] border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50">
                  <Wand2 className="w-4 h-4" strokeWidth={3} /> {isGenerating ? 'Generating...' : 'Auto Subtitle'}
                </button>
                <input type="file" accept="audio/*,video/*" className="hidden" ref={fileInputRef} onChange={handleAutoSubtitleUpload} />
              </>
            }
          />
        </div>

        {/* Global Tabs */}
        <div className="flex border-b-4 border-black px-8 bg-white z-10">
          <button className="px-6 py-3 font-black uppercase text-sm border-b-4 border-[#F5A623] text-black -mb-1 bg-[#FAFAFA]">Editor</button>
          <button className="px-6 py-3 font-bold uppercase text-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-all">Styles</button>
          <button className="px-6 py-3 font-bold uppercase text-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-all">Templates</button>
          <button className="px-6 py-3 font-bold uppercase text-sm text-gray-500 hover:text-black hover:bg-gray-50 transition-all">Preferences</button>
        </div>

        {/* Main Work Area */}
        <div className="flex-1 flex overflow-hidden z-10">
          
          {/* Left Panel: Subtitle List */}
          <div className="w-[380px] border-r-4 border-black bg-white flex flex-col shrink-0">
            {/* Search & Filter */}
            <div className="p-4 border-b-4 border-black flex gap-2">
              <div className="relative w-1/3">
                <select className="w-full h-full bg-[#FAFAFA] border-2 border-black px-2 py-2 text-xs font-black appearance-none outline-none cursor-pointer">
                  <option>English (Default)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" strokeWidth={3} />
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search subtitle..." 
                  className="w-full bg-[#FAFAFA] border-2 border-black py-2 pl-8 pr-2 text-xs font-bold outline-none focus:border-[#F5A623] focus:bg-white"
                />
              </div>
              <button className="w-10 h-10 shrink-0 bg-black text-white border-2 border-black flex items-center justify-center hover:bg-[#F5A623] hover:text-black transition-colors">
                <Plus className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>

            {/* Subtitle Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAFA]">
              {subtitles.map((sub) => (
                <div key={sub.id} className={`p-4 border-4 border-black relative transition-all cursor-pointer ${sub.active ? 'bg-[#FFEDF4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'bg-white hover:bg-gray-50'}`}>
                  {sub.active && (
                    <div className="absolute right-4 top-4">
                      <Play className="w-5 h-5 text-[#F5A623] fill-[#F5A623]" />
                    </div>
                  )}
                  <div className="flex gap-4">
                    <div className={`font-black text-lg ${sub.active ? 'text-[#F5A623]' : 'text-gray-400'}`}>{sub.id}</div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-gray-500 mb-2 flex items-center gap-2">
                        {sub.start} <ChevronRight className="w-3 h-3" strokeWidth={3} /> {sub.end}
                      </div>
                      <textarea 
                        className={`w-full bg-transparent resize-none outline-none font-bold text-sm leading-snug ${sub.active ? 'text-black' : 'text-gray-600'}`} 
                        rows={2} 
                        defaultValue={sub.text}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Toolbar Bottom */}
            <div className="p-2 border-t-4 border-black bg-white flex justify-center gap-4">
              <button className="p-2 hover:bg-[#00E5FF] border-2 border-transparent hover:border-black transition-all"><Plus className="w-5 h-5" strokeWidth={2.5}/></button>
              <button className="p-2 hover:bg-[#F5A623] border-2 border-transparent hover:border-black transition-all"><Copy className="w-5 h-5" strokeWidth={2.5}/></button>
              <button className="p-2 hover:bg-[#FFEDF4] border-2 border-transparent hover:border-black transition-all"><Trash2 className="w-5 h-5 text-red-500" strokeWidth={2.5}/></button>
            </div>
          </div>

          {/* Center Panel: Video Player */}
          <div className="flex-1 bg-gray-200 flex flex-col border-r-4 border-black relative">
            {/* Fake Video Box */}
            <div className="flex-1 bg-gray-900 m-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-center">
              {currentVideo ? (
                <video src={currentVideo.url} className="absolute inset-0 w-full h-full object-contain mix-blend-luminosity opacity-60" autoPlay loop muted />
              ) : (
                <img src="/feature_clipping.png" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" />
              )}
              
              {/* Subtitle Overlay */}
              <div className="relative z-10 mt-auto mb-16 border-2 border-white border-dashed p-4 cursor-move group">
                {/* Handles */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="text-center">
                  <span className="text-3xl font-bold text-white leading-tight" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                    Welcome to Audra Clip,<br/>your AI-powered video editing platform.
                  </span>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="h-16 border-t-4 border-black bg-white px-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="hover:text-[#F5A623] transition-colors"><SkipBack className="w-5 h-5 fill-current" strokeWidth={2}/></button>
                <button className="hover:text-[#00E5FF] transition-colors"><Play className="w-6 h-6 fill-current" strokeWidth={2}/></button>
                <button className="hover:text-[#F5A623] transition-colors"><SkipForward className="w-5 h-5 fill-current" strokeWidth={2}/></button>
                <div className="font-black text-sm ml-4 border-l-4 border-black pl-4 py-1">00:00:00 / {currentVideo?.duration ? Math.round(currentVideo.duration) + 's' : '00:00'}</div>
              </div>
              
              <div className="flex items-center gap-6">
                <button className="flex items-center justify-center border-2 border-black px-2 py-0.5 font-black text-xs hover:bg-[#F5A623] transition-colors"><ClosedCaption className="w-5 h-5 mr-1" strokeWidth={3}/> CC</button>
                <span className="font-black text-sm uppercase">16:9</span>
                <button className="hover:text-[#F5A623] transition-colors"><Maximize className="w-5 h-5" strokeWidth={3}/></button>
              </div>
            </div>
          </div>

          {/* Right Panel: Settings */}
          <div className="w-[320px] bg-white flex flex-col shrink-0">
            <div className="p-6 border-b-4 border-black bg-[#FAFAFA]">
              <h2 className="font-black uppercase text-xl mb-4">Subtitle Settings</h2>
              <div className="flex gap-6 border-b-2 border-black">
                <button className="pb-2 font-black text-sm border-b-4 border-[#F5A623] -mb-0.5">Style</button>
                <button className="pb-2 font-bold text-sm text-gray-500 hover:text-black transition-colors">Animation</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div>
                <label className="block text-xs font-black uppercase mb-2">Font Family</label>
                <div className="relative">
                  <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-[#FAFAFA] border-4 border-black px-3 py-2 font-bold outline-none appearance-none cursor-pointer">
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Outfit">Outfit</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" strokeWidth={3} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase">Font Size</label>
                <div className="flex items-center">
                  <button onClick={() => setFontSize(f => Math.max(12, f - 2))} className="w-8 h-8 border-4 border-r-0 border-black flex items-center justify-center font-black bg-[#FAFAFA] hover:bg-gray-200">-</button>
                  <div className="w-12 h-8 border-4 border-black flex items-center justify-center font-black">{fontSize}</div>
                  <button onClick={() => setFontSize(f => Math.min(120, f + 2))} className="w-8 h-8 border-4 border-l-0 border-black flex items-center justify-center font-black bg-[#FAFAFA] hover:bg-gray-200">+</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-2">Text Color</label>
                  <div className="flex items-center gap-2 border-4 border-black p-1 bg-[#FAFAFA]">
                    <div className="w-6 h-6 border-2 border-black bg-white"></div>
                    <span className="font-bold text-xs">#FFFFFF</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-2">Background</label>
                  <div className="flex items-center gap-2 border-4 border-black p-1 bg-[#FAFAFA]">
                    <div className="w-6 h-6 border-2 border-black bg-black"></div>
                    <span className="font-bold text-xs truncate">Semi-Trans</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase">Bg Opacity</label>
                  <span className="text-xs font-black">{bgOpacity}%</span>
                </div>
                <div className="w-full h-4 bg-gray-200 border-2 border-black relative">
                  <div className="absolute top-0 left-0 h-full bg-[#F5A623] border-r-2 border-black" style={{width: `${bgOpacity}%`}}></div>
                  <input type="range" min="0" max="100" value={bgOpacity} onChange={(e) => setBgOpacity(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="absolute top-1/2 w-5 h-5 bg-black rounded-full -translate-y-1/2 -translate-x-1/2 border-2 border-white pointer-events-none" style={{left: `${bgOpacity}%`}}></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase">Alignment</label>
                <div className="flex border-4 border-black bg-[#FAFAFA]">
                  <button className="p-1.5 border-r-2 border-black hover:bg-white"><AlignLeft className="w-4 h-4" strokeWidth={3}/></button>
                  <button className="p-1.5 border-r-2 border-black bg-[#F5A623]"><AlignCenter className="w-4 h-4" strokeWidth={3}/></button>
                  <button className="p-1.5 hover:bg-white"><AlignRight className="w-4 h-4" strokeWidth={3}/></button>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <label className="text-xs font-black uppercase mt-2">Position</label>
                <div className="grid grid-cols-3 gap-1 p-2 border-4 border-black bg-[#FAFAFA]">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 border-2 border-black cursor-pointer hover:bg-[#00E5FF] ${i === 7 ? 'bg-[#F5A623]' : 'bg-white'}`}></div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t-4 border-black">
                <button onClick={handleApplyAndRender} disabled={isExporting} className="w-full bg-[#00E5FF] border-4 border-black py-3 font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-50">
                  {isExporting ? 'Applying...' : 'Apply & Render'}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Panel: Timeline */}
        <div className="h-64 border-t-4 border-black bg-[#FAFAFA] flex flex-col shrink-0 z-10 relative">
          
          {/* Timeline Toolbar */}
          <div className="h-10 border-b-4 border-black bg-white flex items-center px-4 justify-between">
            <div className="flex gap-4">
              <button className="p-1 hover:bg-[#F5A623] border-2 border-transparent hover:border-black rounded-sm transition-all"><Settings className="w-4 h-4" strokeWidth={3}/></button>
            </div>
            {/* Timeline scale */}
            <div className="flex-1 flex justify-between px-10 text-[10px] font-black text-gray-500 font-mono">
              <span>00:00:00</span><span>00:00:05</span><span>00:00:10</span><span>00:00:15</span><span>00:00:20</span><span>00:00:25</span><span>00:00:30</span><span>00:00:35</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg">-</span>
              <div className="w-24 h-2 bg-black border-2 border-black relative">
                <div className="absolute w-4 h-4 bg-[#F5A623] border-2 border-black top-1/2 -translate-y-1/2 left-1/2 cursor-pointer"></div>
              </div>
              <span className="font-black text-lg">+</span>
            </div>
          </div>

          {/* Tracks Container */}
          <div className="flex-1 overflow-y-auto relative">
            
            {/* Playhead Line */}
            <div className="absolute left-[20%] top-0 bottom-0 w-0.5 bg-[#00E5FF] z-30 pointer-events-none">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00E5FF] text-black text-[10px] font-black px-1 border-2 border-black whitespace-nowrap">00:00:01,200</div>
              <div className="w-3 h-3 bg-[#00E5FF] border-2 border-black absolute -top-1 left-1/2 -translate-x-1/2 rotate-45"></div>
            </div>

            {/* Track 1: Subtitle */}
            <div className="flex border-b-2 border-gray-200 group h-16">
              <div className="w-48 bg-white border-r-4 border-black shrink-0 flex items-center justify-between px-4">
                <span className="text-xs font-black uppercase flex items-center gap-2"><Type className="w-4 h-4"/> Subtitle</span>
                <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black" strokeWidth={3}/>
              </div>
              <div className="flex-1 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+PGxpbmUgeDE9IjE1IiB5MT0iMCIgeDI9IjE1IiB5Mj0iMzAiIHN0cm9rZT0iI2U1ZTVlNSIgc3Ryb2tlLXdpZHRoPSIxIiAvPjwvc3ZnPg==')]">
                
                {/* Subtitle Blocks */}
                <div className="absolute left-[10%] top-2 bottom-2 w-[15%] bg-[#F5A623] border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-1 overflow-hidden cursor-pointer flex items-center z-20">
                  <p className="text-[9px] font-black leading-tight text-black truncate">Welcome to Audra Clip...</p>
                </div>
                
                <div className="absolute left-[26%] top-2 bottom-2 w-[12%] bg-white border-2 border-black p-1 overflow-hidden cursor-pointer hover:bg-[#FFEDF4] transition-colors flex items-center z-10">
                  <p className="text-[9px] font-bold leading-tight text-gray-700 truncate">Edit faster, smarter...</p>
                </div>
                
                <div className="absolute left-[39%] top-2 bottom-2 w-[14%] bg-white border-2 border-black p-1 overflow-hidden cursor-pointer hover:bg-[#FFEDF4] transition-colors flex items-center z-10">
                  <p className="text-[9px] font-bold leading-tight text-gray-700 truncate">From auto reframing...</p>
                </div>

                <div className="absolute left-[54%] top-2 bottom-2 w-[12%] bg-white border-2 border-black p-1 overflow-hidden cursor-pointer hover:bg-[#FFEDF4] transition-colors flex items-center z-10">
                  <p className="text-[9px] font-bold leading-tight text-gray-700 truncate">Let's build something...</p>
                </div>

              </div>
            </div>

            {/* Track 2: Video */}
            <div className="flex border-b-2 border-gray-200 group h-16">
              <div className="w-48 bg-white border-r-4 border-black shrink-0 flex items-center justify-between px-4">
                <span className="text-xs font-black uppercase flex items-center gap-2"><Eye className="w-4 h-4"/> Video</span>
                <Eye className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black" strokeWidth={3}/>
              </div>
              <div className="flex-1 bg-gray-100 flex p-1 gap-1">
                {/* Fake video thumbnails */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex-1 border-2 border-black overflow-hidden relative opacity-80">
                     <img src="/feature_clipping.png" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Track 3: Audio */}
            <div className="flex group h-16">
              <div className="w-48 bg-white border-r-4 border-black shrink-0 flex items-center justify-between px-4">
                <span className="text-xs font-black uppercase flex items-center gap-2"><Music className="w-4 h-4"/> Audio</span>
                <Volume2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-black" strokeWidth={3}/>
              </div>
              <div className="flex-1 bg-[#1A1A1A] relative p-1 overflow-hidden flex items-center">
                 {/* Fake Audio Waveform */}
                 <div className="w-full h-10 flex items-center justify-between gap-[1px]">
                   {[...Array(150)].map((_, i) => (
                     <div key={i} className="w-1 bg-[#00E5FF]" style={{height: `${20 + (i * 13 % 80)}%`}}></div>
                   ))}
                 </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default function SubtitleStudioPage() {
  return (
    <Suspense fallback={<div>Loading subtitles...</div>}>
      <SubtitleStudioContent />
    </Suspense>
  );
}
