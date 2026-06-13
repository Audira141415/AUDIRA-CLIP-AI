"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

interface EditorClientProps {
  project: any;
  clips: any[];
}

export default function EditorClient({ project, clips }: EditorClientProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  // Subtitle Style Customizer States
  const [subtitleStyle, setSubtitleStyle] = useState("hormozi");
  const [subFont, setSubFont] = useState("Impact");
  const [subColor, setSubColor] = useState("Yellow");
  const [subLocation, setSubLocation] = useState("bottom");
  const [outputRatio, setOutputRatio] = useState("9:16");
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("Media");
  const [isGeneratingBRoll, setIsGeneratingBRoll] = useState(false);
  
  // AI Reframing States
  const [reframingMode, setReframingMode] = useState("auto_face");
  const [showTrackingBox, setShowTrackingBox] = useState(true);
  const [manualXOffset, setManualXOffset] = useState(50);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const projectName = project?.name ?? 'Untitled Project';

  // Format local URLs correctly
  const formattedClips = clips.map((clip) => {
    let url = clip.url;
    if (url.startsWith('local://')) {
      url = url.replace('local://', 'http://localhost:3345/');
    }
    return { ...clip, url };
  });

  const timelineClips = formattedClips.length > 0 ? formattedClips : [];
  const totalDuration = timelineClips.reduce((acc, clip) => acc + (clip.duration || 15), 0);

  // Determine which clip is active based on currentTime
  let activeClipIndex = 0;
  let accumulatedTime = 0;
  let localClipTime = 0;

  for (let i = 0; i < timelineClips.length; i++) {
    const clipDur = timelineClips[i].duration || 15;
    if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clipDur) {
      activeClipIndex = i;
      localClipTime = currentTime - accumulatedTime;
      break;
    }
    accumulatedTime += clipDur;
  }
  
  // If we reach the exact end, stay on the last clip
  if (currentTime >= totalDuration && timelineClips.length > 0) {
    activeClipIndex = timelineClips.length - 1;
    localClipTime = timelineClips[activeClipIndex].duration || 15;
  }

  const activeClip = timelineClips[activeClipIndex];

  // Handle Video Playback logic
  useEffect(() => {
    if (!videoRef.current || !activeClip) return;
    
    // When active clip changes, update the src
    if (videoRef.current.src !== activeClip.url) {
      videoRef.current.src = activeClip.url;
      videoRef.current.currentTime = localClipTime;
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Play prevented", e));
      }
    }
  }, [activeClipIndex, activeClip?.url]);

  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeClip) return;
    
    // Calculate global time based on this clip's time
    let clipStartOffset = 0;
    for (let i = 0; i < activeClipIndex; i++) {
      clipStartOffset += (timelineClips[i].duration || 15);
    }
    
    let newGlobalTime = clipStartOffset + videoRef.current.currentTime;
    
    // Check if we hit the end of the current clip
    if (videoRef.current.currentTime >= (activeClip.duration || 15)) {
      if (activeClipIndex < timelineClips.length - 1) {
        // Automatically move to next clip
        // State will update, triggering the useEffect above to change src
        newGlobalTime = clipStartOffset + (activeClip.duration || 15) + 0.01;
      } else {
        // End of timeline
        setIsPlaying(false);
        videoRef.current.pause();
        newGlobalTime = totalDuration;
      }
    }
    
    setCurrentTime(newGlobalTime);
  };

  const togglePlay = () => {
    if (!videoRef.current || !activeClip?.url) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!videoRef.current.src) {
        videoRef.current.src = activeClip.url;
        videoRef.current.load();
      }

      if (currentTime >= totalDuration) {
        // Restart from beginning
        setCurrentTime(0);
        videoRef.current.currentTime = 0;
      }
      
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.error("Play error", e);
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);
    }
  };

  const handleGenerateBRoll = async () => {
    if (!activeClip) return;
    setIsGeneratingBRoll(true);
    try {
      const response = await api.post(`/video/clip/${activeClip.id}/broll`, {
        keyword: activeClip.title || 'viral broll'
      });
      const data = response.data;
      if (data.success) {
        alert('B-Roll generated successfully! URL: ' + data.url);
        // In a real app we'd update the clip's broll segments in the state or timeline
      } else {
        alert('Failed to generate B-Roll: ' + data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Error generating B-Roll.');
    } finally {
      setIsGeneratingBRoll(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    // We must manually update the video currentTime so it reflects immediately while dragging
    if (videoRef.current && activeClip) {
      let offset = 0;
      let targetIndex = 0;
      for (let i = 0; i < timelineClips.length; i++) {
        const d = timelineClips[i].duration || 15;
        if (newTime >= offset && newTime < offset + d) {
          targetIndex = i;
          break;
        }
        offset += d;
      }
      
      // If we seeked into the SAME clip, just update currentTime
      if (targetIndex === activeClipIndex) {
         videoRef.current.currentTime = newTime - offset;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 100).toString().padStart(2, '0');
    return `00:${m}:${s}:${ms}`;
  };

  const handleExport = async () => {
    if (!activeClip) return;
    setIsExporting(true);
    try {
      const res = await api.post(`/video/clip/${activeClip.id}/export`, {
        subtitleConfig: { font: subFont, color: subColor, style: subtitleStyle, location: subLocation, aspectRatio: outputRatio },
        reframingMode: reframingMode
      });
      const data = res.data;
      if ((res.status === 200 || res.status === 201) && data.url) {
        // Mock update the active clip URL
        activeClip.url = data.url;
        if (videoRef.current) {
          const wasPlaying = isPlaying;
          videoRef.current.src = data.url;
          if (wasPlaying) videoRef.current.play();
        }
        alert("Export Complete! Video updated in player. You can now download it.");
      } else {
        alert("Export failed: " + data.message);
      }
    } catch (e) {
      alert("Network error during export.");
    } finally {
      setIsExporting(false);
    }
  };

  // Subtitle Logic (Mock)
  const getMockSubtitle = () => {
    if (!activeClip) return "";
    const sec = Math.floor(localClipTime);
    if (sec % 4 === 0) return "WAIT WHAT?! 🤯";
    if (sec % 4 === 1) return "This is actually crazy...";
    if (sec % 4 === 2) return "You need to see this!";
    return "Link in bio 🔥";
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col text-black overflow-hidden font-sans">
      {/* HEADER */}
      <header className="h-14 border-b-4 border-black bg-white flex items-center justify-between px-4 shrink-0 z-10 shadow-neu">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-8 h-8 rounded-none border-2 border-black bg-primary flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase">{projectName}</span>
            <span className="text-[10px] text-gray-600 font-bold">
              {timelineClips.length > 0 ? `${timelineClips.length} clips in timeline` : 'No clips loaded'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-1.5 rounded-none bg-white border-2 border-black text-sm font-black uppercase hover:bg-[#F4F4F0] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all">
            AI Copilot
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="relative overflow-hidden px-5 py-1.5 rounded-none bg-primary border-2 border-black text-black font-black text-sm uppercase hover:bg-yellow-400 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none disabled:opacity-50 group"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:animate-pulse transition-all duration-1000" />
            <span className="relative z-10 flex items-center gap-2">
              {isExporting ? '⏳ Rendering...' : 'Export 🚀'}
            </span>
          </button>
        </div>
      </header>

      {/* MIDDLE WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: Media Bin */}
        <aside className="w-72 border-r-4 border-black bg-white flex flex-col shrink-0">
          <div className="flex border-b-2 border-black">
            {['Media', 'Audio', 'Text', 'AI Effects'].map((tab, i) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-[10px] font-black uppercase text-center border-r-2 border-black last:border-r-0 ${activeTab === tab ? 'bg-primary text-black' : 'bg-white text-black hover:bg-yellow-100'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F4F4F0]">
            {activeTab === 'Media' && (
              <div className="p-4 grid grid-cols-2 gap-3 content-start">
                {timelineClips.map((clip, i) => (
                  <div 
                    key={i} 
                    onClick={() => {
                      let offset = 0;
                      for(let j=0; j<i; j++) offset += (timelineClips[j].duration || 15);
                      setCurrentTime(offset);
                    }}
                    className={`aspect-[9/16] bg-black border-4 ${activeClipIndex === i ? 'border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1' : 'border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-blue hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none'} cursor-pointer transition-all relative group overflow-hidden`}
                  >
                    <img src={"https://images.unsplash.com/photo-1598550473332-411bd1da080a?w=400&q=80"} alt="Thumb" className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-1">
                      <p className="text-[9px] text-white font-bold truncate">{clip.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Audio' && (
              <div className="p-4 space-y-6 animate-in slide-in-from-left-4 duration-300">
                <div>
                  <h3 className="font-black uppercase mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">🎙️</span> Voice Enhancement
                  </h3>
                  <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 accent-primary border-2 border-black" defaultChecked />
                      <span className="font-bold text-sm group-hover:text-primary transition-colors">AI Voice Isolation</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 accent-primary border-2 border-black" />
                      <span className="font-bold text-sm group-hover:text-primary transition-colors">Remove Filler Words (um, ah)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="font-black uppercase mb-3 text-sm flex items-center gap-2">
                    <span className="text-xl">🎵</span> Background Music
                  </h3>
                  <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors">
                    <span className="font-bold text-sm">Lo-Fi Chill Beat 1</span>
                    <button className="text-xs bg-primary border border-black px-2 py-1 font-bold">CHANGE</button>
                  </div>
                  <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 accent-primary border-2 border-black" defaultChecked />
                      <span className="font-bold text-sm group-hover:text-primary transition-colors">Auto-Ducking</span>
                    </label>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span>BGM Volume</span>
                        <span>15%</span>
                      </div>
                      <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-primary h-2 bg-black/20 rounded-full appearance-none" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Text' && (
              <div className="p-4 space-y-4 animate-in slide-in-from-left-4 duration-300 flex flex-col h-full">
                <div className="flex justify-between items-center">
                  <h3 className="font-black uppercase text-sm flex items-center gap-2"><span className="text-xl">📝</span> Transcript</h3>
                  <button className="bg-primary border-2 border-black px-2 py-1 text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none hover:bg-yellow-400 transition-colors">
                    ✨ Auto Fix
                  </button>
                </div>
                <div className="bg-white border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-medium leading-relaxed flex-1 overflow-y-auto">
                  <p className="leading-loose">
                    {(activeClip?.title || "So here is the secret to making viral videos. First, you need a strong hook. If they don't stop scrolling, you've lost.")
                      .split(' ').map((word: string, idx: number) => (
                        <span key={idx} className="cursor-pointer hover:bg-yellow-200 px-1 rounded transition-colors text-black">{word} </span>
                      ))}
                    <br/><br/>
                    <span className="text-red-500 font-bold text-[10px] border border-red-500 px-1 mx-1 cursor-pointer hover:bg-red-500 hover:text-white transition-colors" title="Silence detected">[✂️ 0.5s pause]</span>
                  </p>
                </div>
                <div className="text-[10px] text-black/60 font-bold italic bg-yellow-100 border border-yellow-300 p-2 rounded-none">
                  💡 Tip: Highlight to cut, double click to edit typo.
                </div>
              </div>
            )}

            {activeTab === 'AI Effects' && (
              <div className="p-4 space-y-4 animate-in slide-in-from-left-4 duration-300">
                <div className="bg-primary border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group cursor-pointer hover:bg-yellow-400 transition-colors hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none active:scale-95">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform">🔥</div>
                  <h3 className="font-black uppercase text-lg mb-1 relative z-10">Viral Hook Score</h3>
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <div className="flex-1 h-3 bg-white border-2 border-black overflow-hidden relative">
                      <div className="absolute top-0 bottom-0 left-0 bg-green-500 transition-all duration-1000" style={{ width: `${activeClip?.score || 85}%` }} />
                    </div>
                    <span className="font-black text-sm">{Math.round(activeClip?.score || 85)}/100</span>
                  </div>
                  <p className="text-[10px] font-bold leading-tight relative z-10">{activeClip?.title || "Strong emotional opening detected! High probability of viewer retention."}</p>
                </div>

                <div 
                  onClick={handleGenerateBRoll}
                  className={`bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3 ${isGeneratingBRoll ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:bg-gray-50 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none'} transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-blue border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      {isGeneratingBRoll ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : '🎞️'}
                    </div>
                    <div>
                      <h4 className="font-black text-sm uppercase">{isGeneratingBRoll ? 'Generating...' : 'Auto B-Roll'}</h4>
                      <p className="text-[10px] font-bold text-black/60">Generate matching visuals</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3 cursor-pointer hover:bg-gray-50 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-400 border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">🎥</div>
                    <div>
                      <h4 className="font-black text-sm uppercase">Ken Burns Zoom</h4>
                      <p className="text-[10px] font-bold text-black/60">Auto push-in on keywords</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-3 cursor-pointer hover:bg-gray-50 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-400 border-2 border-black flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">💥</div>
                    <div>
                      <h4 className="font-black text-sm uppercase">Sound Effects</h4>
                      <p className="text-[10px] font-bold text-black/60">Auto-sfx on popups & emojis</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER PANEL: Canvas / Video Player */}
        <main className="flex-1 flex flex-col bg-[#F4F4F0] relative min-w-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
            {/* Video Player Canvas */}
            <div className="h-full aspect-[9/16] bg-black shadow-neu rounded-none border-4 border-black relative flex items-center justify-center overflow-hidden">
              {timelineClips.length > 0 ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center w-full h-full">
                    <video 
                      ref={videoRef}
                      src={activeClip?.url || ""}
                      className="h-full w-full object-cover transition-transform duration-300 ease-out"
                      style={{
                        objectPosition: reframingMode === 'manual' ? `${manualXOffset}% center` : 
                                        reframingMode === 'auto_face' && isPlaying ? `calc(50% + ${Math.sin(currentTime) * 20}%) center` : 'center',
                        transform: reframingMode === 'auto_face' && isPlaying ? `scale(1.1)` : 'scale(1)',
                      }}
                      onTimeUpdate={handleTimeUpdate}
                      onEnded={handleTimeUpdate}
                      playsInline
                      preload="auto"
                    />
                  </div>

                  {/* AI Tracking Box Overlay (Cyberpunk Style) */}
                  {showTrackingBox && reframingMode === 'auto_face' && (
                    <div className="absolute border-2 border-primary pointer-events-none z-10 transition-all duration-100 ease-linear w-40 h-56 border-dashed shadow-[0_0_20px_rgba(250,204,21,0.5)] overflow-hidden"
                    style={{
                      left: `calc(50% + ${Math.sin(currentTime * 1.5) * 30}px)`,
                      top: `calc(50% + ${Math.cos(currentTime * 0.8) * 10}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}>
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary" />
                      
                      {/* Scanning Laser tied to video time */}
                      {isPlaying && (
                        <div 
                          className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(250,204,21,1)] blur-[0.5px]" 
                          style={{ top: `${50 + Math.sin(currentTime * 4) * 45}%` }} 
                        />
                      )}

                      <div className={`absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-black text-[9px] font-black px-2 border-2 border-black whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${isPlaying ? 'bg-yellow-400' : ''}`}>
                        {isPlaying ? '⚡ TRACKING ACTIVE' : 'AI TRACKING'}
                      </div>
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-primary text-[8px] font-mono whitespace-nowrap drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                        X: {Math.floor(50 + Math.sin(currentTime * 1.5) * 30)} Y: {Math.floor(50 + Math.cos(currentTime * 0.8) * 10)}
                      </div>
                    </div>
                  )}
                  {/* Mock Subtitle Overlay */}
                  <div className="absolute bottom-32 left-0 right-0 flex justify-center pointer-events-none px-4 text-center">
                    {subtitleStyle === 'neo-brutalism' && (
                      <span className={`bg-${subColor.toLowerCase()}-400 text-black border-4 border-black px-4 py-2 text-2xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2`} style={{ fontFamily: subFont }}>
                        {getMockSubtitle()}
                      </span>
                    )}
                    {subtitleStyle === 'hormozi' && (
                      <span className="text-white text-3xl font-black uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]" style={{ WebkitTextStroke: '1.5px black', fontFamily: subFont }}>
                        <span className={`text-${subColor.toLowerCase()}-400`}>{getMockSubtitle().split(' ')[0]}</span> {getMockSubtitle().substring(getMockSubtitle().indexOf(' ') + 1)}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-white font-black text-xl uppercase">No Clips</span>
              )}
            </div>
          </div>

          {/* Player Controls */}
          <div className="h-14 border-t-4 border-black bg-white flex items-center justify-center gap-6 shadow-[0px_-2px_0px_0px_rgba(0,0,0,1)] z-10">
            <button 
              onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
              className="text-black hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={togglePlay}
              className={`relative w-12 h-12 border-4 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all active:scale-95 z-10 ${isPlaying ? 'bg-yellow-400' : 'bg-primary'}`}
            >
              {isPlaying && (
                <div className="absolute inset-0 border-4 border-yellow-400 rounded-none animate-ping opacity-40 pointer-events-none scale-[1.3]"></div>
              )}
              {isPlaying ? (
                <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
              ) : (
                <svg className="w-6 h-6 ml-1 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button 
               onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 5))}
               className="text-black hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            </button>
            <span className="text-xs font-black bg-yellow-100 border-2 border-black px-2 py-1 text-black absolute right-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
          </div>
        </main>

        {/* RIGHT PANEL: Properties / Subtitle Studio */}
        <aside className="w-72 border-l-4 border-black bg-white flex flex-col shrink-0 z-10">
          <div className="p-3 border-b-4 border-black bg-primary">
            <h3 className="text-sm font-black uppercase text-black flex items-center gap-2">
              <span>✍️</span> Subtitle Studio
            </h3>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto bg-[#F4F4F0] flex-1">
            
            <div>
               <h4 className="text-xs font-black text-black mb-2 uppercase">Active Text (Mock)</h4>
               <textarea 
                  className="w-full bg-white border-2 border-black p-2 font-bold text-sm h-20 focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  value={getMockSubtitle()}
                  readOnly
               />
            </div>

            <hr className="border-t-4 border-black border-dashed" />
            
            {/* AI REFRAMING SECTION */}
            <div>
              <h4 className="text-xs font-black text-black mb-3 flex items-center gap-2 uppercase">
                <span className="bg-secondary border border-black px-1 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">🎯</span> AI Auto-Framing
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                   <label className="flex items-center gap-2 cursor-pointer group flex-1">
                     <div className={`w-5 h-5 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors ${showTrackingBox ? 'bg-primary' : 'bg-white group-hover:bg-yellow-100'}`}>
                       <input type="checkbox" checked={showTrackingBox} onChange={(e) => setShowTrackingBox(e.target.checked)} className="sr-only" />
                       {showTrackingBox && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
                     </div>
                     <span className="font-bold text-[10px] text-black uppercase">Show Tracking UI</span>
                   </label>
                </div>
                
                <div className="flex flex-col gap-1.5">
                   <span className="text-black font-bold uppercase text-[10px]">Tracking Mode</span>
                   <select 
                     value={reframingMode}
                     onChange={(e) => setReframingMode(e.target.value)}
                     className="w-full bg-white border-2 border-black p-1.5 font-black text-[11px] focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase"
                   >
                     <option value="auto_face">🤖 Auto-Face Track</option>
                     <option value="center">📌 Static Center</option>
                     <option value="manual">⚙️ Manual Offset</option>
                   </select>
                </div>

                {reframingMode === 'manual' && (
                  <div className="bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center text-[10px] mb-2">
                      <span className="text-black font-bold uppercase">Pan X Offset</span>
                      <span className="text-black font-black bg-primary px-1 border border-black">{manualXOffset}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={manualXOffset} 
                      onChange={(e) => setManualXOffset(parseInt(e.target.value))}
                      className="w-full accent-black" 
                    />
                    <div className="flex justify-between text-[8px] font-bold text-gray-500 uppercase mt-1">
                      <span>Left</span>
                      <span>Center</span>
                      <span>Right</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-t-4 border-black border-dashed" />
            
            <div>
              <h4 className="text-xs font-black text-black mb-3 flex items-center gap-2 uppercase">
                <span className="bg-secondary border border-black px-1 py-0.5">🎨</span> Text Style
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-600 uppercase">Font Family</p>
                  <select 
                    value={subFont}
                    onChange={(e) => setSubFont(e.target.value)}
                    className="w-full border-2 border-black bg-white px-2 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
                  >
                    <option value="Impact">Impact (Hormozi)</option>
                    <option value="Montserrat Black">Montserrat (Modern)</option>
                    <option value="Arial Black">Arial Black (Classic)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-600 uppercase">Primary Color</p>
                  <div className="flex gap-3">
                    {[
                      { name: 'Yellow', bg: 'bg-yellow-400' },
                      { name: 'Green', bg: 'bg-green-400' },
                      { name: 'Cyan', bg: 'bg-cyan-400' },
                      { name: 'White', bg: 'bg-white' }
                    ].map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSubColor(color.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${color.bg} ${
                          subColor === color.name 
                          ? 'border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-110 ring-2 ring-primary' 
                          : 'border-transparent hover:border-black'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button 
                    onClick={() => setSubtitleStyle('neo-brutalism')}
                    className={`py-2 text-[10px] font-black uppercase border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${subtitleStyle === 'neo-brutalism' ? 'bg-primary border-black text-black -translate-y-1 -translate-x-1' : 'bg-white border-black text-black hover:bg-yellow-100'}`}
                  >
                    Neo-Brutalism
                  </button>
                  <button 
                    onClick={() => setSubtitleStyle('hormozi')}
                    className={`py-2 text-[10px] font-black uppercase border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${subtitleStyle === 'hormozi' ? 'bg-primary border-black text-black -translate-y-1 -translate-x-1' : 'bg-white border-black text-black hover:bg-yellow-100'}`}
                  >
                    Hormozi
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-t-4 border-black border-dashed" />

            <div>
              <h4 className="text-xs font-black text-black mb-3 flex items-center gap-2 uppercase">
                <span className="bg-secondary border border-black px-1 py-0.5">📐</span> Layout & Ratio
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-600 uppercase">Output Ratio</p>
                  <div className="flex bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {['9:16', '1:1', '16:9'].map(ratio => (
                      <button
                        key={ratio}
                        onClick={() => setOutputRatio(ratio)}
                        className={`flex-1 py-1 text-[10px] font-black uppercase transition-all ${outputRatio === ratio ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-600 uppercase">Subtitle Position</p>
                  <select 
                    value={subLocation}
                    onChange={(e) => setSubLocation(e.target.value)}
                    className="w-full border-2 border-black bg-white px-2 py-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
                  >
                    <option value="bottom">⬇️ Bottom (Default)</option>
                    <option value="center">🎯 Center (Middle)</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-t-4 border-black border-dashed" />

            <div>
              <h4 className="text-xs font-black text-black mb-3 uppercase">Transform</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-black font-bold uppercase text-xs">Scale</span>
                  <span className="text-black font-black bg-white border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-[10px]">100%</span>
                </div>
                <input type="range" className="w-full accent-black" />
              </div>
            </div>

          </div>
        </aside>
      </div>

      {/* BOTTOM PANEL: Timeline */}
      <footer className="h-64 border-t-4 border-black bg-white flex flex-col shrink-0 z-20">
        <div className="h-10 bg-[#F4F4F0] border-b-4 border-black flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button className="p-1 border-2 border-transparent hover:border-black hover:bg-white text-black transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14.121 14.121L19 19m-4.879-4.879l-4.242-4.242m4.242 4.242L9 19m5.121-5.121L19 5m-4.879 4.879L9 5" /></svg></button>
            <div className="w-0.5 h-4 bg-black mx-1" />
            <button className="px-2 py-1 bg-white border-2 border-black text-black hover:bg-secondary hover:text-black flex items-center gap-1 text-[10px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"><span className="text-black">✨</span> Generate B-Roll</button>
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase">
            <span>Zoom</span>
            <input type="range" className="w-24 accent-black" />
          </div>
        </div>

        {/* Timeline Tracks Area */}
        <div className="flex-1 overflow-auto relative p-2 space-y-2 bg-[#F4F4F0] custom-scrollbar">
          
          {/* Global Range Input acting as seek bar */}
          <input 
            type="range" 
            min={0} 
            max={totalDuration > 0 ? totalDuration : 100} 
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="absolute top-0 left-16 right-4 z-30 opacity-0 cursor-ew-resize h-full"
            style={{ width: 'calc(100% - 4.5rem)' }}
          />

          {/* Time Ruler */}
          <div className="h-6 flex items-end px-2 border-b-2 border-black mb-2 pl-16">
            <div className="flex-1 flex justify-between text-[10px] text-black font-black font-mono relative">
              {/* Draw ruler ticks based on 10 segments */}
              {[...Array(11)].map((_, i) => (
                <span key={i} className="absolute" style={{ left: `${(i/10)*100}%`, transform: 'translateX(-50%)' }}>
                  {formatTime((i/10) * totalDuration)}
                </span>
              ))}
            </div>
          </div>

          {/* Playhead Marker */}
          <div 
            className={`absolute top-0 bottom-0 w-0.5 z-20 pointer-events-none transition-all duration-75 ease-linear ${isPlaying ? 'bg-primary shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'}`}
            style={{ left: `calc(4rem + ${(currentTime / (totalDuration || 1)) * 100}%)` }}
          >
            <div className={`w-4 h-4 border-2 border-black transform -translate-x-1/2 -mt-1 polygon-[50%_100%,0_0,100%_0] transition-transform ${isPlaying ? 'bg-primary scale-110 shadow-[0_0_10px_rgba(250,204,21,1)]' : 'bg-red-500'}`} />
            {isPlaying && <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white opacity-50 mix-blend-overlay" />}
          </div>

          {/* Subtitle Track */}
          <div className="flex gap-2 h-10 items-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none px-2 relative">
            <div className="w-14 shrink-0 flex items-center gap-1 text-[10px] text-black font-black uppercase border-r-2 border-black h-full pr-1">TXT</div>
            <div className="flex-1 relative h-full">
              {/* Mock subtitle blocks spanning the whole timeline */}
              <div className="absolute top-1 bottom-1 bg-yellow-300 border-2 border-black flex items-center justify-center text-[9px] font-black uppercase shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] truncate px-1" style={{ left: '0%', width: '100%' }}>
                AI Generated Subtitles Active
              </div>
            </div>
          </div>

          {/* Video Track */}
          <div className="flex gap-2 h-16 items-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none px-2 relative">
            <div className="w-14 shrink-0 flex items-center gap-1 text-[10px] text-black font-black uppercase border-r-2 border-black h-full pr-1">VID</div>
            <div className="flex-1 relative h-12 bg-[#F4F4F0] border-2 border-black flex">
               {timelineClips.map((clip, i) => {
                 const widthPct = ((clip.duration || 15) / totalDuration) * 100;
                 const isActive = activeClipIndex === i;
                 return (
                   <div 
                     key={i} 
                     className={`h-full border-r-2 border-black flex flex-col justify-end overflow-hidden transition-colors relative group ${isActive ? 'bg-primary' : 'bg-accent-blue'}`}
                     style={{ width: `${widthPct}%` }}
                   >
                     {/* Active Clip Glow Overlay */}
                     {isActive && isPlaying && <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />}
                     
                     <p className={`text-[8px] font-black px-1 truncate mb-1 border-b-2 border-black/20 relative z-10 ${isActive && isPlaying ? 'text-black drop-shadow-sm' : ''}`}>
                       {clip.title}
                     </p>
                     <div className="h-4 bg-white/30 w-full flex items-end gap-[1px] relative z-10 px-0.5">
                       {/* Audio Waveform mock */}
                       {[...Array(Math.max(5, Math.floor(widthPct/2)))].map((_, j) => {
                          // When playing, add a dynamic jitter to the wave based on time, otherwise static
                          const baseHeight = Math.abs(Math.sin(j * 0.8)) * 50 + 20;
                          const dynamicHeight = isPlaying && isActive ? baseHeight + (Math.sin(currentTime * 10 + j) * 20) : baseHeight;
                          return (
                            <div 
                              key={j} 
                              className={`flex-1 transition-all duration-75 ${isPlaying && isActive ? 'bg-black' : 'bg-black/70'}`} 
                              style={{ height: `${Math.max(10, Math.min(100, dynamicHeight)).toFixed(1)}%` }} 
                            />
                          )
                       })}
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
