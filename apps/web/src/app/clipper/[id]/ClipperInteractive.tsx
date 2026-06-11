"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const USER_ID = 'afc0b322-bb98-47b0-9879-e4ffc8361a80';
const WORKSPACE_ID = 'f7e53531-8f05-418a-9869-931cf994183a';

export default function ClipperInteractive({ videoData, initialVideoUrl }: { videoData: any, initialVideoUrl: string }) {
  const router = useRouter();
  const [activeVideoUrl, setActiveVideoUrl] = useState(initialVideoUrl);
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [aspectFilter, setAspectFilter] = useState<string>("All");

  // ── Clip selection state ──────────────────────────────
  const [selectedClipIds, setSelectedClipIds] = useState<Set<string>>(new Set());

  // ── Create Project modal state ────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  
  // ── Custom Clip modal state ────────────────────────
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customDuration, setCustomDuration] = useState("15");
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  
  // Subtitle Customizer State
  const [subColor, setSubColor] = useState("Yellow"); // Yellow, Green, Cyan
  const [subFont, setSubFont] = useState("Impact"); // Impact, Montserrat, Arial Black

  const isProcessing = videoData.status === 'PENDING' || videoData.status === 'PROCESSING';

  // Poll for updates if video is processing
  useEffect(() => {
    if (!isProcessing) return;
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [isProcessing, router]);

  const handleClipClick = (clip: any) => {
    const clipUrl = clip.url.startsWith("local://")
      ? clip.url.replace("local://", "http://localhost:3001/")
      : clip.url;
    setActiveVideoUrl(clipUrl);
    setActiveClipId(clip.id);
  };

  const handleOriginalClick = () => {
    setActiveVideoUrl(initialVideoUrl);
    setActiveClipId(null);
  };

  const toggleClipSelection = (clipId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedClipIds(prev => {
      const next = new Set(prev);
      if (next.has(clipId)) next.delete(clipId);
      else next.add(clipId);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedClipIds.size === videoData.clips.length) {
      setSelectedClipIds(new Set());
    } else {
      setSelectedClipIds(new Set(videoData.clips.map((c: any) => c.id)));
    }
  };

  const handleOpenModal = () => {
    if (selectedClipIds.size === 0) {
      alert("Pilih minimal 1 clip terlebih dahulu!");
      return;
    }
    setProjectName(`Project - ${videoData.title}`);
    setCreateError("");
    setShowModal(true);
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      setCreateError("Nama project tidak boleh kosong.");
      return;
    }
    setIsCreating(true);
    setCreateError("");
    try {
      const res = await fetch("http://localhost:3001/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          userId: USER_ID,
          workspaceId: WORKSPACE_ID,
          clipIds: Array.from(selectedClipIds),
          subtitleStyle: { color: subColor, font: subFont }
        }),
      });
      const data = await res.json();
      if (res.ok && data.project?.id) {
        router.push(`/editor?projectId=${data.project.id}`);
      } else {
        setCreateError(data.message || "Gagal membuat project.");
      }
    } catch {
      setCreateError("Network error. Pastikan server berjalan.");
      } finally {
        setIsCreating(false);
      }
    };

    const handleCreateCustomClip = async () => {
      if (!customStart.trim() || !customDuration.trim()) {
        alert("Start Time and Duration must be filled.");
        return;
      }
      setIsCreatingCustom(true);
      try {
        const res = await fetch(`http://localhost:3001/video/${videoData.id}/clip/custom`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            startTime: parseFloat(customStart),
            duration: parseFloat(customDuration)
          }),
        });
        if (res.ok) {
          setShowCustomModal(false);
          setCustomStart("");
          setCustomDuration("15");
          router.refresh();
        } else {
          alert("Gagal membuat custom clip.");
        }
      } catch (e) {
        alert("Network error.");
      } finally {
        setIsCreatingCustom(false);
      }
    };

  const allSelected = videoData.clips.length > 0 && selectedClipIds.size === videoData.clips.length;

  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
      {/* Top header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-700 hover:text-black font-bold text-sm flex items-center gap-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            BACK TO DASHBOARD
          </Link>
          <h2 className="text-xl font-black text-black tracking-tight flex items-center gap-2 border-l-4 border-black pl-3">
            AI Clipper - {videoData.title} <span className="text-xs text-black font-bold font-mono bg-yellow-100 border-2 border-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Duration: {videoData.duration}s</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-white border-2 border-black text-black font-black px-4 py-2 text-sm flex items-center gap-2 hover:bg-[#F4F4F0] shadow-neu hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-neu-hover active:translate-y-[4px] active:translate-x-[4px] active:shadow-neu-active transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            REFRESH
          </button>

          {/* Badge jumlah clip terpilih */}
          {selectedClipIds.size > 0 && (
            <span className="text-xs font-black bg-black text-primary border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">
              {selectedClipIds.size} CLIP SELECTED
            </span>
          )}

          <button
            onClick={handleOpenModal}
            disabled={selectedClipIds.size === 0 || isProcessing}
            className={`text-black text-sm font-black px-4 py-2 border-2 border-black transition-all ${
              selectedClipIds.size > 0 && !isProcessing
                ? 'bg-primary shadow-neu hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-neu-hover active:translate-y-[4px] active:translate-x-[4px] active:shadow-neu-active cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            CREATE PROJECT
            {selectedClipIds.size > 0 && (
              <span className="ml-1 bg-black text-primary text-[10px] px-1 py-0.5 font-mono">
                {selectedClipIds.size}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="flex flex-col lg:flex-row flex-none lg:h-[55vh] min-h-[400px] gap-4">
        {/* Left: Video Player */}
        <div className="flex-[3] bg-white border-4 border-black rounded-none flex flex-col overflow-hidden relative shadow-neu">
          <div className="flex-1 bg-yellow-50 border-b-4 border-black relative flex items-center justify-center overflow-hidden p-4">
            {!activeVideoUrl || activeVideoUrl === 'pending' ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-primary font-black uppercase text-xl gap-4 p-8">
                <div className="w-12 h-12 border-4 border-white border-t-primary rounded-full animate-spin" />
                <div className="text-center w-full max-w-md">
                  <div className="mb-4 text-lg">{videoData?.statusMessage || "Video is processing or downloading..."}</div>
                  {(videoData?.progress !== undefined && videoData.progress > 0) && (
                    <div className="w-full h-6 border-2 border-white bg-black overflow-hidden relative">
                      <div className="h-full bg-primary transition-all duration-300" style={{ width: `${videoData.progress}%` }} />
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white mix-blend-difference">{videoData.progress}%</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <video
                key={activeVideoUrl}
                src={activeVideoUrl}
                controls
                autoPlay
                preload="metadata"
                className="h-full max-w-full object-contain outline-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black mx-auto"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={handleOriginalClick}
              className={`px-4 py-2 text-xs font-black uppercase transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${activeClipId === null ? 'bg-primary text-black translate-y-[1px] translate-x-[1px] shadow-none' : 'bg-white text-black hover:bg-[#F4F4F0]'}`}
            >
              Original Video
            </button>
            {activeClipId !== null && (
              <div className="px-4 py-2 text-xs font-black uppercase border-2 border-black bg-accent-teal text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Previewing AI Clip
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Analysis Results */}
        <div className="flex-1 bg-white border-4 border-black rounded-none p-5 flex flex-col shadow-neu">
          <h3 className="font-black text-black text-sm uppercase mb-4 border-b-2 border-black pb-2">AI Analysis Results</h3>

          {isProcessing ? (
            <div className="flex flex-col items-center justify-center flex-1 space-y-4 w-full">
              <div className="w-12 h-12 border-4 border-black border-t-primary rounded-full animate-spin shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
              <div className="w-full px-4">
                <p className="text-black font-bold text-sm bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-center mb-3">
                  {videoData?.statusMessage || "AI is analyzing video..."}
                </p>
                {(videoData?.progress !== undefined && videoData.progress > 0) && (
                  <div className="w-full h-4 border-2 border-black bg-white overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="h-full bg-primary transition-all duration-300 border-r-2 border-black" style={{ width: `${videoData.progress}%` }} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between text-[11px] mb-2 font-black uppercase">
                  <span className="text-black">100% Analysis Complete</span>
                </div>
                <div className="w-full h-3 border-2 border-black bg-white overflow-hidden">
                  <div className="h-full bg-accent-teal border-r-2 border-black w-[100%]" />
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { label: "Detected Clips", icon: "🔥", count: videoData.clips.length, color: "text-black", bg: "bg-primary border-black" },
                  { label: "Selected Clips", icon: "✅", count: selectedClipIds.size, color: "text-black", bg: "bg-accent-teal border-black" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F4F4F0] hover:translate-y-[-1px] transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 flex items-center justify-center border-2 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${item.bg}`}>{item.icon}</span>
                      <span className="text-xs font-black uppercase text-black">{item.label}</span>
                    </div>
                    <span className={`text-xl font-black ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>

              {/* CTA jika belum pilih clip */}
              {selectedClipIds.size === 0 && videoData.clips.length > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border-2 border-dashed border-black text-xs font-bold text-black">
                  👇 Klik checkbox pada clip di bawah untuk memilih, lalu tekan <strong>CREATE PROJECT</strong>.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom: Detected Clips Gallery */}
      <div className="shrink-0 mt-4 bg-white border-4 border-black p-4 flex flex-col shadow-neu mb-4 w-full overflow-hidden">
        <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-3">
          <div className="flex items-center gap-6">
            <h3 className="font-black text-black text-sm uppercase">Detected Clips <span className="bg-primary border border-black px-1 text-[10px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">CLICK TO PLAY</span></h3>
            <div className="hidden md:flex gap-2 border-l-2 border-black pl-6">
              {['All', 'TikTok/Reels', 'IG Story', 'YT Shorts'].map(platform => (
                <button
                  key={platform}
                  onClick={() => setAspectFilter(platform)}
                  className={`text-xs font-black uppercase px-2 py-1 border-2 border-black transition-all ${aspectFilter === platform ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-[#F4F4F0]'}`}
                >
                  {platform === 'All' ? 'All Formats' : platform === 'TikTok/Reels' ? '📱 TikTok' : platform === 'IG Story' ? '📸 IG Story' : '🖥️ YT Shorts'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs font-black text-black cursor-pointer hover:bg-[#F4F4F0] p-1 border-2 border-transparent hover:border-black transition-colors select-none"
            >
              <div className={`w-4 h-4 border-2 border-black flex items-center justify-center ${allSelected ? 'bg-black' : 'bg-white'}`}>
                {allSelected && <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
              </div>
              SELECT ALL
            </label>
            <button
              onClick={() => setShowCustomModal(true)}
              className="border-2 border-black text-xs font-black uppercase px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-black hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu transition-all"
            >
              ✂️ ADD CUSTOM CLIP
            </button>
            <button
              onClick={handleOpenModal}
              disabled={selectedClipIds.size === 0}
              className={`border-2 border-black text-xs font-black uppercase px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${selectedClipIds.size > 0 ? 'bg-primary text-black hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-neu' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              + CREATE PROJECT ({selectedClipIds.size})
            </button>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-6 w-full custom-scrollbar scroll-smooth">
          {isProcessing ? (
            <p className="text-black font-black text-sm py-8 bg-yellow-50 border-2 border-black px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">WAITING FOR AI TO GENERATE CLIPS...</p>
          ) : videoData.clips.length === 0 ? (
            <p className="text-black font-black text-sm py-8 bg-red-50 border-2 border-black px-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">NO CLIPS DETECTED.</p>
          ) : (
            videoData.clips
              .filter((clip: any) => aspectFilter === "All" || clip.platform === aspectFilter)
              .map((clip: any, i: number) => {
              const thumbUrl = clip.thumbnailUrl?.startsWith("local://")
                ? clip.thumbnailUrl.replace("local://", "http://localhost:3001/")
                : clip.thumbnailUrl;

              const isVertical = clip.aspectRatio === "9:16";
              const isSquare = clip.aspectRatio === "1:1";
              const cardWidth = isVertical ? "w-44" : isSquare ? "w-52" : "w-64";
              const imgAspect = isVertical ? "aspect-[9/16]" : isSquare ? "aspect-square" : "aspect-video";
              const platformIcon = isVertical ? "📱" : isSquare ? "📸" : "🖥️";
              const isActive = activeClipId === clip.id;
              const isSelected = selectedClipIds.has(clip.id);

              return (
                <div
                  key={i}
                  onClick={() => handleClipClick(clip)}
                  className={`${cardWidth} shrink-0 bg-white border-2 overflow-hidden group transition-all cursor-pointer flex flex-col relative ${
                    isSelected
                      ? 'border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-4px] translate-x-[-4px] ring-2 ring-primary'
                      : isActive
                      ? 'border-black bg-[#F4F4F0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px] translate-x-[-2px]'
                      : 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#F4F4F0]'
                  }`}
                >
                  {/* Checkbox pilih clip */}
                  <button
                    onClick={(e) => toggleClipSelection(clip.id, e)}
                    className={`absolute top-2 left-2 z-20 w-6 h-6 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${isSelected ? 'bg-primary scale-110' : 'bg-white hover:bg-yellow-100'}`}
                  >
                    {isSelected && (
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                    )}
                  </button>

                  <div className={`${imgAspect} relative overflow-hidden bg-black flex items-center justify-center border-b-2 border-black`}>
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={clip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-4xl">🎬</span>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-yellow-400/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 border-2 border-black bg-white text-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 bg-white border-2 border-black text-[10px] font-black text-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 uppercase">
                      {platformIcon} {clip.platform || clip.aspectRatio}
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black border-2 border-white text-[10px] font-black text-white px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.3)] flex items-center gap-1 uppercase">
                      {clip.aspectRatio === '9:16' ? '1080x1920' : clip.aspectRatio === '1:1' ? '1080x1080' : '1920x1080'}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black text-[10px] text-primary px-1.5 py-0.5 border-2 border-primary font-black shadow-[2px_2px_0px_0px_rgba(139,92,246,1)]">{clip.duration}s</div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-black text-black mb-0.5 truncate uppercase">{clip.title}</h4>
                      <p className="text-[10px] text-gray-700 font-bold mb-2.5 bg-gray-100 border border-black inline-block px-1">AUTO-GENERATED</p>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] font-black flex items-center gap-1 text-black uppercase">
                        Score <span className="text-white bg-accent-teal border border-black px-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">{clip.score ?? 0}%</span>
                      </span>
                      <button
                        onClick={(e) => toggleClipSelection(clip.id, e)}
                        className={`text-[11px] font-black uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all ${isSelected ? 'bg-black text-primary' : 'bg-primary text-black hover:bg-white'}`}
                      >
                        {isSelected ? '✓ Selected' : '+ Select'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {videoData.clips.length > 0 && videoData.clips.filter((clip: any) => aspectFilter === "All" || clip.aspectRatio === aspectFilter).length === 0 && (
            <p className="text-gray-500 font-bold text-sm py-8 uppercase">NO CLIPS FOUND FOR FORMAT {aspectFilter}</p>
          )}
        </div>
      </div>

      {/* ── CREATE PROJECT MODAL ──────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white border-4 border-black w-full max-w-2xl shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col transform transition-all scale-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b-4 border-black bg-primary relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
              <h2 className="text-xl font-black uppercase text-black flex items-center gap-3 relative z-10">
                <span className="text-2xl">🎬</span> Project Setup
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
              
              {/* Project Title Section */}
              <div className="space-y-3">
                <label className="text-sm font-black uppercase text-black flex items-center gap-2">
                  <span className="bg-black text-white px-2 py-0.5 text-[10px]">01</span> Project Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
                    placeholder="Enter project name (e.g. Viral Shorts Vol 1)"
                    className="w-full border-4 border-black pl-11 pr-4 py-4 text-sm font-bold text-black bg-white focus:outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Selected Clips Summary */}
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase text-black flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-[10px]">02</span> Selected Clips ({selectedClipIds.size})
                  </label>
                  
                  <div className="bg-[#F4F4F0] border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-48 flex flex-col">
                    <div className="grid grid-cols-3 gap-2 overflow-y-auto custom-scrollbar pr-1 flex-1">
                      {Array.from(selectedClipIds).map(id => {
                        const clip = videoData.clips.find((c: any) => c.id === id);
                        if (!clip) return null;
                        const thumbUrl = clip.thumbnailUrl?.startsWith("local://")
                          ? clip.thumbnailUrl.replace("local://", "http://localhost:3001/")
                          : clip.thumbnailUrl;
                        
                        return (
                          <div key={id} className="relative aspect-[9/16] bg-black border-2 border-black overflow-hidden group shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] hover:border-primary transition-colors">
                            {thumbUrl ? (
                              <img src={thumbUrl} className="w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl bg-gray-900">🎬</div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 pt-4">
                              <p className="text-[8px] font-black text-white truncate uppercase leading-tight text-shadow-sm">
                                {clip.title}
                              </p>
                              <p className="text-[7px] text-primary font-bold mt-0.5">{clip.duration}s</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Subtitle Style Customizer */}
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase text-black flex items-center gap-2">
                    <span className="bg-black text-white px-2 py-0.5 text-[10px]">03</span> Style
                  </label>
                  
                  <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-5 h-48 flex flex-col justify-between">
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* Color */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Highlight Color</p>
                        <div className="flex gap-2">
                          {[
                            { name: 'Yellow', bg: 'bg-[#FFD700]' },
                            { name: 'Green', bg: 'bg-[#00FF66]' },
                            { name: 'Cyan', bg: 'bg-[#00FFFF]' }
                          ].map(color => (
                            <button
                              key={color.name}
                              onClick={() => setSubColor(color.name)}
                              className={`w-8 h-8 rounded-none border-2 transition-transform ${color.bg} ${
                                subColor === color.name 
                                ? 'border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] scale-110 z-10' 
                                : 'border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:scale-105'
                              }`}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Font */}
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Font Family</p>
                        <select 
                          value={subFont}
                          onChange={(e) => setSubFont(e.target.value)}
                          className="w-full border-2 border-black bg-[#F4F4F0] px-2 py-1.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer hover:bg-white transition-colors"
                        >
                          <option value="Impact">Impact</option>
                          <option value="Montserrat Black">Montserrat</option>
                          <option value="Arial Black">Arial Black</option>
                        </select>
                      </div>
                    </div>

                    {/* Preview Box */}
                    <div className="bg-black border-2 border-black relative overflow-hidden flex flex-col items-center justify-center p-3 mt-auto h-20 group">
                      <p className="text-[8px] text-gray-500 absolute top-1 left-1.5 uppercase font-black z-10">Live Preview</p>
                      
                      <div className="relative z-10 text-center w-full transform group-hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center mt-2">
                        <span className="text-white text-sm md:text-base font-black uppercase tracking-tight leading-none" style={{ 
                          fontFamily: subFont.includes('Impact') ? 'Impact, sans-serif' : subFont.includes('Montserrat') ? '"Montserrat Black", sans-serif' : '"Arial Black", sans-serif',
                          textShadow: '2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' 
                        }}>
                          SEMPAT <span className={`
                            ${subColor === 'Yellow' ? 'text-[#FFD700]' : ''}
                            ${subColor === 'Green' ? 'text-[#00FF66]' : ''}
                            ${subColor === 'Cyan' ? 'text-[#00FFFF]' : ''}
                          `}>HANCUR</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error */}
              {createError && (
                <div className="bg-red-50 border-4 border-red-500 p-3 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] flex items-start gap-3 animate-bounce">
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-700 text-sm font-black uppercase tracking-wide mt-0.5">
                    {createError}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-4 p-5 md:p-6 border-t-4 border-black bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                disabled={isCreating}
                className="flex-1 border-4 border-black bg-white text-black font-black uppercase py-4 text-sm md:text-base hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={isCreating || !projectName.trim()}
                className={`flex-[2] border-4 border-black font-black uppercase py-4 text-sm md:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  isCreating || !projectName.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-black hover:bg-yellow-400 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {isCreating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    Creating Project...
                  </span>
                ) : (
                  '🚀 OPEN EDITOR'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOM CLIP MODAL ──────────────────────────────────── */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-accent-teal">
              <h2 className="text-lg font-black uppercase text-white flex items-center gap-2">
                ✂️ Custom Segment
              </h2>
              <button
                onClick={() => setShowCustomModal(false)}
                className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center hover:bg-red-100 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border-2 border-dashed border-black p-3 text-xs font-bold mb-4">
                Buat klip secara manual jika AI melewatkan momen favoritmu.
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black">Start Time (Seconds)</label>
                <input
                  type="number"
                  value={customStart}
                  onChange={e => setCustomStart(e.target.value)}
                  placeholder="e.g. 120 (for 02:00)"
                  className="w-full border-2 border-black px-4 py-3 font-bold text-black bg-[#F4F4F0] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-black">Duration (Seconds)</label>
                <input
                  type="number"
                  value={customDuration}
                  onChange={e => setCustomDuration(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full border-2 border-black px-4 py-3 font-bold text-black bg-[#F4F4F0] focus:outline-none focus:bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t-4 border-black bg-[#F4F4F0]">
              <button
                onClick={handleCreateCustomClip}
                disabled={isCreatingCustom || !customStart.trim()}
                className={`flex-1 border-2 border-black font-black uppercase py-3 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                  isCreatingCustom || !customStart.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-black hover:bg-yellow-400 hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {isCreatingCustom ? '⏳ Cutting...' : '✂️ CUT CLIP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
