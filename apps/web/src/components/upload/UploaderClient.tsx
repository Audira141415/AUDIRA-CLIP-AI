"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function UploaderClient({ queue = [] }: { queue?: any[] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [selectedAspects, setSelectedAspects] = useState<string[]>(["9:16"]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [aiIntent, setAiIntent] = useState<string>("Viral Hook");
  const [videoLanguage, setVideoLanguage] = useState<string>("id-ID");
  const [autoCaptions, setAutoCaptions] = useState<boolean>(true);
  const [autoBroll, setAutoBroll] = useState<boolean>(false);
  const [videoQuality, setVideoQuality] = useState<string>("best");
  
  // Link Preview State
  const [previewData, setPreviewData] = useState<{title: string; thumbnail_url: string; author_name: string} | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  // Enterprise Features
  const [timeStart, setTimeStart] = useState<string>("");
  const [timeEnd, setTimeEnd] = useState<string>("");
  const [clipLength, setClipLength] = useState<string>("Auto");
  const [layoutMode, setLayoutMode] = useState<string>("Auto-Focus Speaker");
  const [topic, setTopic] = useState<string>("");

  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const USER_ID = 'afc0b322-bb98-47b0-9879-e4ffc8361a80';
  const WORKSPACE_ID = 'f7e53531-8f05-418a-9869-931cf994183a';

  useEffect(() => {
    api.get(`/video/library?userId=${USER_ID}&workspaceId=${WORKSPACE_ID}`)
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setRecentVideos(res.data.slice(0, 4));
        }
      })
      .catch(err => console.error("Failed to load library:", err));
  }, []);

  useEffect(() => {
    const checkUrl = async () => {
      if (!urlInput.trim()) {
        setPreviewData(null);
        return;
      }
      
      const ytRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      if (ytRegex.test(urlInput)) {
        setIsPreviewLoading(true);
        try {
          const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(urlInput)}&format=json`);
          if (res.ok) {
            const data = await res.json();
            setPreviewData({
              title: data.title,
              thumbnail_url: data.thumbnail_url,
              author_name: data.author_name
            });
          } else {
            setPreviewData(null);
          }
        } catch (e) {
          setPreviewData(null);
        }
        setIsPreviewLoading(false);
      } else {
        setPreviewData(null);
      }
    };

    const timeoutId = setTimeout(checkUrl, 500);
    return () => clearTimeout(timeoutId);
  }, [urlInput]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    
    setIsImporting(true);
    try {
      const aspectsParam = selectedAspects.length > 0 ? selectedAspects.join(',') : '9:16';
      const queryParams = new URLSearchParams({
        url: urlInput.trim(),
        userId: USER_ID,
        workspaceId: WORKSPACE_ID,
        aspects: aspectsParam,
        intent: aiIntent,
        lang: videoLanguage,
        captions: String(autoCaptions),
        broll: String(autoBroll),
        quality: videoQuality,
        ...(timeStart && { timeStart }),
        ...(timeEnd && { timeEnd }),
        clipLength,
        layoutMode,
        ...(topic && { topic })
      }).toString();
      
      const res = await api.post(`/video/import-url?${queryParams}`);
      const data = res.data;
      if (res.status === 200 || res.status === 201) {
        if (data && data.video && data.video.id) {
          router.push(`/clipper/${data.video.id}`);
        } else {
          window.location.reload();
        }
      } else {
        alert(data.message || "Failed to import URL");
        setIsImporting(false);
      }
    } catch (err) {
      alert("Network error");
      setIsImporting(false);
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const aspectsParam = selectedAspects.length > 0 ? selectedAspects.join(',') : '9:16';
      const queryParams = new URLSearchParams({
        userId: USER_ID,
        workspaceId: WORKSPACE_ID,
        aspects: aspectsParam,
        intent: aiIntent,
        lang: videoLanguage,
        captions: String(autoCaptions),
        broll: String(autoBroll)
      }).toString();

      const res = await api.post(`/video/upload?${queryParams}`, formData, {
        onUploadProgress: (e) => {
          if (e.total) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
          }
        }
      });
      const data = res.data;
      
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        if (data && data.video && data.video.id) {
          router.push(`/clipper/${data.video.id}`);
        } else {
          window.location.reload();
        }
      }, 1500);

    } catch (error) {
      console.error(error);
      alert("Upload failed. Check console.");
      setIsUploading(false);
    }
  };

  const toggleAspect = (aspect: string) => {
    setSelectedAspects([aspect]);
  };

  const ASPECT_OPTIONS = [
    { 
      id: '9:16', 
      label: 'Vertical', 
      wireframe: (
        <div className="w-8 h-12 bg-[#000000] border border-black relative overflow-hidden flex flex-col justify-end pb-1">
          {/* Mock TikTok UI */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0" />
          <div className="absolute right-1 bottom-1.5 flex flex-col gap-1 items-center z-10">
            <div className="w-2 h-2 rounded-full bg-white border border-gray-300" />
            <span className="text-red-500 text-[7px] leading-none">❤️</span>
            <span className="text-white text-[7px] leading-none">💬</span>
            <span className="text-white text-[7px] leading-none">↗️</span>
          </div>
          <div className="w-[60%] space-y-0.5 mb-0.5 ml-1 z-10">
            <div className="h-0.5 w-1/2 bg-white rounded font-bold text-[4px] text-white leading-none">@user</div>
            <div className="h-0.5 w-full bg-gray-200 rounded mt-1" />
            <div className="h-0.5 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      ), 
      desc: 'TikTok, IG Reels & Story, YT Shorts' 
    },
    { 
      id: '1:1', 
      label: 'Square', 
      wireframe: (
        <div className="w-10 h-12 bg-white border border-black flex flex-col overflow-hidden">
          {/* Mock Instagram UI */}
          <div className="h-2.5 border-b border-gray-200 flex items-center px-1 gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center"><div className="w-1 h-1 bg-white rounded-full" /></div>
            <div className="h-0.5 w-3 bg-black rounded" />
          </div>
          <div className="flex-1 bg-gray-100 flex items-center justify-center border-b border-gray-200">
            <div className="w-4 h-4 border-2 border-gray-300 rounded-sm flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full border border-gray-300" /></div>
          </div>
          <div className="h-2.5 flex items-center px-1 gap-1">
            <span className="text-red-500 text-[6px] leading-none">❤️</span>
            <span className="text-black text-[6px] leading-none">💬</span>
            <span className="text-black text-[6px] leading-none">↗️</span>
          </div>
        </div>
      ), 
      desc: 'Instagram Post' 
    },
    { 
      id: '16:9', 
      label: 'Landscape', 
      wireframe: (
        <div className="w-12 h-8 bg-black border border-black relative flex flex-col overflow-hidden justify-end">
          {/* Mock YouTube UI */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-3 bg-red-600 rounded flex items-center justify-center z-10 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
               <div className="w-0 h-0 border-t-[1.5px] border-t-transparent border-l-[2.5px] border-l-white border-b-[1.5px] border-b-transparent ml-0.5" />
            </div>
          </div>
          <div className="w-full h-0.5 bg-white/30 z-10 relative">
             <div className="absolute top-0 left-0 h-full w-1/3 bg-red-600" />
             <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-red-600 rounded-full transform -translate-y-1/2" />
          </div>
        </div>
      ), 
      desc: 'YouTube Standard' 
    },
  ];

  return (
    <>
      <div className="flex-[2] flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
        {/* Format Selection Card */}
      <div className="bg-white border-4 border-black rounded-none p-6 shadow-neu">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-black font-black uppercase flex items-center gap-2">
            <span>🎯</span> Select Target Formats
          </h3>
          <button 
            onClick={() => setShowPreviewModal(true)}
            className="bg-white border-2 border-black px-3 py-1 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-100 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all flex items-center gap-2"
          >
            👁️ Preview Sizes
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ASPECT_OPTIONS.map((opt) => {
            const isSelected = selectedAspects.includes(opt.id);
            return (
              <div 
                key={opt.id}
                onClick={() => toggleAspect(opt.id)}
                className={`p-3 rounded-none border-2 flex items-center gap-3 cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-primary border-black text-black shadow-neu translate-y-[-2px] translate-x-[-2px]' 
                    : 'bg-white border-black text-gray-700 hover:bg-[#F4F4F0] hover:shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px]'
                }`}
              >
                <div className={`w-14 h-14 shrink-0 flex items-center justify-center bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isSelected ? 'text-black' : 'text-gray-500 opacity-80'}`}>
                  {opt.wireframe}
                </div>
                <div>
                  <p className={`text-sm font-black ${isSelected ? 'text-black' : 'text-gray-800'}`}>{opt.label}</p>
                  <p className="text-[10px] text-gray-800 font-bold mt-0.5">{opt.desc}</p>
                </div>
                <div className="ml-auto">
                  <div className={`w-5 h-5 border-2 flex items-center justify-center ${isSelected ? 'bg-black border-black' : 'bg-white border-black'}`}>
                    {isSelected && <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selectedAspects.length === 0 && (
          <p className="text-red-600 bg-red-100 border-2 border-black p-2 font-bold text-xs mt-3 flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            Please select at least one format to proceed.
          </p>
        )}
      </div>

      {/* AI Clip Intent & Settings Card */}
      <div className="bg-white border-4 border-black rounded-none p-6 shadow-neu">
        <h3 className="text-black font-black uppercase mb-4 flex items-center gap-2">
          <span>🧠</span> AI Clip Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700">Clip Intent / Vibe</label>
            <select 
              value={aiIntent}
              onChange={(e) => setAiIntent(e.target.value)}
              className="w-full bg-[#F4F4F0] border-2 border-black p-2 font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <option value="Viral Hook">🔥 Viral Hook</option>
              <option value="Funny Moments">😂 Funny Moments</option>
              <option value="Educational">🎓 Educational / Podcast</option>
              <option value="Gaming Highlight">🎮 Gaming Highlight</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700">Spoken Language</label>
            <select 
              value={videoLanguage}
              onChange={(e) => setVideoLanguage(e.target.value)}
              className="w-full bg-[#F4F4F0] border-2 border-black p-2 font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <option value="id-ID">🇮🇩 Indonesian</option>
              <option value="en-US">🇺🇸 English</option>
              <option value="auto">🌐 Auto-Detect</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700">Clip Length</label>
            <select 
              value={clipLength}
              onChange={(e) => setClipLength(e.target.value)}
              className="w-full bg-[#F4F4F0] border-2 border-black p-2 font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <option value="Auto">Auto (AI Decides)</option>
              <option value="< 30s">&lt; 30 Seconds</option>
              <option value="30s-60s">30 - 60 Seconds</option>
              <option value="> 60s">&gt; 60 Seconds</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-gray-700">Layout Mode</label>
            <select 
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value)}
              className="w-full bg-[#F4F4F0] border-2 border-black p-2 font-bold text-black focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <option value="Auto-Focus Speaker">👤 Auto-Focus Speaker</option>
              <option value="Split-Screen">👥 Split-Screen</option>
              <option value="Gaming Mode">🎮 Gaming Mode</option>
            </select>
          </div>
          <div className="space-y-2 lg:col-span-2">
             <label className="text-xs font-bold uppercase text-gray-700">Focus Topic (Optional)</label>
             <input 
               type="text" 
               placeholder="e.g. Elon Musk, Crypto, specific joke..." 
               value={topic} 
               onChange={(e) => setTopic(e.target.value)} 
               className="w-full bg-[#F4F4F0] border-2 border-black p-2 font-bold text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
             />
          </div>
        </div>

        {/* TIME RANGE */}
        <div className="bg-[#F4F4F0] border-2 border-black p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
           <h4 className="text-xs font-black uppercase flex items-center gap-2 mb-3">⏱️ Time Range (Save Processing Time)</h4>
           <div className="flex items-center gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">Start Time</label>
                <input 
                  type="text" 
                  placeholder="00:00:00" 
                  value={timeStart} 
                  onChange={(e) => setTimeStart(e.target.value)} 
                  className="w-24 bg-white border-2 border-black p-1 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <span className="font-black text-xl">-</span>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-600 block mb-1">End Time</label>
                <input 
                  type="text" 
                  placeholder="00:10:00" 
                  value={timeEnd} 
                  onChange={(e) => setTimeEnd(e.target.value)} 
                  className="w-24 bg-white border-2 border-black p-1 text-sm font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <p className="text-[10px] text-gray-500 font-bold ml-4 hidden md:block">Leave blank to process full video.<br/>Format: HH:MM:SS or MM:SS</p>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-4 border-t-4 border-black border-dashed">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-6 h-6 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors ${autoCaptions ? 'bg-primary' : 'bg-white group-hover:bg-yellow-100'}`}>
              <input type="checkbox" checked={autoCaptions} onChange={(e) => setAutoCaptions(e.target.checked)} className="sr-only" />
              {autoCaptions && <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
            </div>
            <span className="font-bold text-sm text-black">Auto-Generate Captions</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-6 h-6 border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-colors ${autoBroll ? 'bg-primary' : 'bg-white group-hover:bg-yellow-100'}`}>
              <input type="checkbox" checked={autoBroll} onChange={(e) => setAutoBroll(e.target.checked)} className="sr-only" />
              {autoBroll && <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>}
            </div>
            <span className="font-bold text-sm text-black">Auto-Apply AI B-Roll</span>
          </label>
        </div>
      </div>

      {/* File Upload Card (Moved Up for better visibility) */}
      <div 
        className={`flex-none h-48 border-4 border-dashed rounded-none flex flex-col items-center justify-center relative overflow-hidden transition-all ${selectedAspects.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${isDragging ? 'border-black bg-primary/20 shadow-neu translate-y-[-4px] translate-x-[-4px]' : 'bg-white border-black hover:bg-[#F4F4F0] hover:shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px]'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={selectedAspects.length > 0 ? handleDrop : undefined}
        onClick={!(isUploading || isImporting) && selectedAspects.length > 0 ? onButtonClick : undefined}
      >
        <input type="file" ref={fileInputRef} onChange={handleChange} className="hidden" accept="video/mp4,video/quicktime" />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center w-full px-12 z-10">
              <div className="w-16 h-16 mb-4 rounded-full border-4 border-black border-t-primary animate-spin" />
              <h3 className="text-xl font-black text-black uppercase mb-2">Uploading...</h3>
              <div className="w-full h-4 bg-white border-2 border-black overflow-hidden mt-4">
                <div className="h-full bg-primary border-r-2 border-black transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-sm text-black font-bold mt-2 bg-white px-2 border-2 border-black">{uploadProgress}% Complete</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-6 z-10 pointer-events-none">
            <span className="text-5xl mb-2 grayscale group-hover:grayscale-0 transition-all">📁</span>
            <h3 className="text-xl font-black text-black uppercase text-center">Drag & Drop Video</h3>
            <p className="text-xs font-bold text-gray-500 mt-2 uppercase text-center bg-white px-2 border-2 border-black">or click to browse local files</p>
            <p className="text-[10px] text-gray-400 mt-2 font-bold">MP4, MOV up to 2GB</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 my-2">
         <div className="h-1 flex-1 bg-gray-200" />
         <span className="font-black text-gray-400 uppercase text-xs">OR</span>
         <div className="h-1 flex-1 bg-gray-200" />
      </div>

      {/* URL Import Card */}
      <div className="bg-white border-4 border-black rounded-none p-6 shadow-neu">
        <h3 className="text-black font-black uppercase mb-3 flex items-center gap-2">
          <span>🔗</span> Paste Video Link
        </h3>
        
        {previewData ? (
          <div className="flex flex-col gap-5 mt-4 p-5 bg-[#F4F4F0] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none relative">
            
            {/* Link Header */}
            <div className="bg-white border-2 border-black flex items-center justify-between p-3 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative z-10">
              <div className="flex items-center gap-3 overflow-hidden flex-1 mr-4">
                <span className="text-black text-xl">🔗</span>
                <span className="text-black text-sm font-black truncate">{urlInput}</span>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setUrlInput("");
                  setPreviewData(null);
                }}
                className="bg-red-400 hover:bg-red-500 text-black text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Remove
              </button>
            </div>
            
            {/* Form Actions */}
            <form onSubmit={handleUrlImport} className="flex flex-col items-center gap-5 relative z-10">
              <button 
                type="submit" 
                disabled={isImporting || isUploading}
                className="w-full max-w-xl bg-primary hover:bg-yellow-400 disabled:opacity-50 disabled:bg-gray-300 text-black px-6 py-4 border-4 border-black font-black text-2xl uppercase transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[6px] active:translate-x-[6px] active:shadow-none flex items-center justify-center gap-3"
              >
                {isImporting ? (
                  <>
                    <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    PROCESSING...
                  </>
                ) : 'GET CLIPS IN 1 CLICK'}
              </button>
              
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-black text-black uppercase w-full max-w-2xl bg-white border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="flex items-center gap-2">
                  SPEECH: 
                  <select 
                    value={videoLanguage} 
                    onChange={(e) => setVideoLanguage(e.target.value)}
                    className="bg-[#F4F4F0] text-black border-2 border-black px-2 py-1 outline-none cursor-pointer hover:bg-yellow-100"
                  >
                    <option value="id-ID">INDONESIAN</option>
                    <option value="en-US">ENGLISH</option>
                    <option value="auto">AUTO</option>
                  </select>
                </span>
                <span className="underline cursor-pointer hover:text-primary transition-colors">UPLOAD .SRT</span>
                <span className="flex items-center gap-1">COST: <span className="text-xl">⚡</span> <strong className="text-base">60</strong></span>
              </div>
              
              <div className="mt-4 relative w-full max-w-[320px] sm:max-w-[480px] aspect-video border-4 border-black rounded-none overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black group">
                <img src={previewData.thumbnail_url} alt={previewData.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
                <div className="absolute top-3 left-3 bg-white text-black text-sm font-black uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {videoQuality === 'best' ? '1080p' : videoQuality}
                </div>
              </div>
              <p className="text-[10px] text-gray-600 font-bold uppercase text-center max-w-md mt-2 leading-relaxed bg-yellow-100 border-2 border-black p-2">
                ⚠️ Using video you don't own may violate copyright laws. By continuing, you confirm this is your own original content.
              </p>
            </form>
          </div>
        ) : (
          <form onSubmit={handleUrlImport} className="flex gap-2">
            <select 
              value={videoQuality}
              onChange={(e) => setVideoQuality(e.target.value)}
              disabled={isImporting || isUploading}
              className="w-32 bg-[#F4F4F0] border-2 border-black px-2 py-3 text-sm font-black text-black focus:outline-none focus:shadow-neu transition-all uppercase"
            >
              <option value="best">Best Qty</option>
              <option value="1080p">1080p</option>
              <option value="720p">720p</option>
              <option value="480p">480p</option>
            </select>
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="YouTube, TikTok, or IG URL..." 
                className="w-full h-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-black placeholder:text-gray-600 font-bold focus:outline-none focus:shadow-neu transition-all pr-10"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isImporting || isUploading}
              />
              {isPreviewLoading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <button 
              type="submit" 
              disabled={Boolean(isImporting || isUploading || !urlInput || urlInput.trim() === "" || selectedAspects.length === 0)}
              className="bg-primary hover:bg-yellow-400 disabled:opacity-50 text-black px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none font-black text-sm transition-all flex items-center gap-2"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  IMPORTING...
                </>
              ) : 'GET VIDEO'}
            </button>
          </form>
        )}
      </div>


      {/* Recent Uploads Section */}
      {recentVideos.length > 0 && (
        <div className="bg-white border-4 border-black rounded-none p-6 shadow-neu mt-2">
          <h3 className="text-black font-black uppercase mb-4 flex items-center gap-2">
            <span>📚</span> Recent Library
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentVideos.map((video) => (
              <div 
                key={video.id} 
                onClick={() => router.push(`/clipper/${video.id}`)}
                className="bg-[#F4F4F0] border-2 border-black p-2 flex flex-col items-center cursor-pointer hover:bg-yellow-100 hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <div className="w-full aspect-video bg-black flex items-center justify-center border-2 border-black overflow-hidden relative">
                  {video.url.includes('youtube') ? (
                    <span className="text-2xl">▶️</span>
                  ) : (
                    <span className="text-2xl">🎬</span>
                  )}
                  {video.status === 'PROCESSING' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold text-center text-black line-clamp-1 w-full" title={video.title}>{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#F4F4F0] border-4 border-black w-full max-w-5xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b-4 border-black bg-white">
              <h2 className="text-2xl font-black uppercase text-black">Target Formats Preview</h2>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="w-10 h-10 bg-primary border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-400 hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8 items-center justify-center">
              {ASPECT_OPTIONS.map((opt) => (
                <div key={`preview-${opt.id}`} className={`flex flex-col items-center gap-4 transition-all ${selectedAspects.includes(opt.id) ? 'opacity-100 scale-105' : 'opacity-40 grayscale scale-95'}`}>
                  <h3 className="font-black text-xl bg-white border-2 border-black px-4 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{opt.label} ({opt.id})</h3>
                  
                  {opt.id === '9:16' && (
                    <div className="w-64 h-[455px] bg-[#000000] border-4 border-black relative overflow-hidden flex flex-col justify-end pb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0" />
                      <div className="absolute right-3 bottom-6 flex flex-col gap-4 items-center z-10">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-300" />
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-red-500 text-3xl leading-none drop-shadow-md">❤️</span>
                           <span className="text-white text-[10px] font-bold">124K</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-white text-3xl leading-none drop-shadow-md">💬</span>
                           <span className="text-white text-[10px] font-bold">4K</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                           <span className="text-white text-3xl leading-none drop-shadow-md">↗️</span>
                           <span className="text-white text-[10px] font-bold">Share</span>
                        </div>
                      </div>
                      <div className="w-[70%] space-y-2 mb-2 ml-4 z-10">
                        <div className="h-4 w-1/2 bg-white rounded font-bold text-sm text-white leading-none flex items-center bg-transparent drop-shadow-md">@audira_user</div>
                        <div className="h-3 w-full bg-gray-200 rounded mt-2 opacity-80" />
                        <div className="h-3 w-3/4 bg-gray-200 rounded opacity-80" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="bg-black/70 text-white font-black px-6 py-3 border-2 border-black text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-10deg]">1080 x 1920</span>
                      </div>
                    </div>
                  )}

                  {opt.id === '1:1' && (
                    <div className="w-80 h-[380px] bg-white border-4 border-black flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                      <div className="h-16 border-b-2 border-gray-200 flex items-center px-4 gap-3 bg-white">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] flex items-center justify-center"><div className="w-full h-full bg-white rounded-full" /></div>
                        <div className="h-4 w-24 bg-gray-800 rounded" />
                      </div>
                      <div className="flex-1 bg-gray-100 flex items-center justify-center border-b-2 border-gray-200 relative">
                        <div className="w-12 h-12 border-4 border-gray-300 rounded flex items-center justify-center"><div className="w-4 h-4 rounded-full border-4 border-gray-300" /></div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                          <span className="bg-black/70 text-white font-black px-4 py-2 border-2 border-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-5deg] mt-20">1080 x 1080</span>
                        </div>
                      </div>
                      <div className="h-14 flex items-center px-4 gap-4 bg-white">
                         <span className="text-red-500 text-3xl leading-none">❤️</span>
                         <span className="text-black text-3xl leading-none">💬</span>
                         <span className="text-black text-3xl leading-none">↗️</span>
                      </div>
                    </div>
                  )}

                  {opt.id === '16:9' && (
                    <div className="w-96 h-56 bg-black border-4 border-black relative flex flex-col overflow-hidden justify-end shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-12 bg-red-600 rounded-lg flex items-center justify-center z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 transition-colors cursor-pointer">
                          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                        </div>
                      </div>
                      <div className="w-full h-2 bg-white/30 z-10 relative">
                         <div className="absolute top-0 left-0 h-full w-1/3 bg-red-600" />
                         <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-red-600 rounded-full transform -translate-y-1/2" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                        <span className="bg-black/70 text-white font-black px-4 py-2 border-2 border-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[5deg] mt-24">1920 x 1080</span>
                      </div>
                    </div>
                  )}
                  
                  <p className="font-bold text-gray-700 bg-white border-2 border-black px-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{opt.desc}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t-4 border-black bg-white flex justify-center">
              <p className="text-sm font-bold text-black uppercase">Unselected formats are grayed out. Close this modal to continue uploading.</p>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* RIGHT COLUMN: Live Simulator & Queue */}
    <div className="flex-1 flex flex-col gap-4 h-full overflow-hidden">
      {/* Live Video Simulator */}
      <div className="bg-white border-4 border-black rounded-none p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center flex-1 overflow-hidden relative">
        <h3 className="text-black font-black uppercase mb-4 flex items-center gap-2 w-full border-b-4 border-black pb-2">
          <span>✨</span> Live Simulator
        </h3>
        
        {/* Simulator Canvas */}
        <div className="flex-1 w-full bg-[#F4F4F0] border-4 border-black border-dashed flex items-center justify-center relative overflow-hidden p-4">
          
          {selectedAspects.length === 0 ? (
            <p className="font-bold text-gray-500 uppercase text-center px-4">Select an aspect ratio to preview</p>
          ) : (
            <div className={`relative flex flex-col items-center justify-center bg-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-500
              ${selectedAspects[0] === '9:16' ? 'w-[160px] h-[284px]' : selectedAspects[0] === '1:1' ? 'w-[200px] h-[200px]' : 'w-[280px] h-[158px]'}
            `}>
              {/* Background gradient to simulate video */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60 animate-pulse" />
              
              {/* Layout Mode Overlays */}
              {layoutMode === 'Split-Screen' && (
                <>
                  <div className="absolute top-0 left-0 w-full h-1/2 border-b-4 border-black bg-blue-500/30 flex items-center justify-center">
                    <span className="text-white text-3xl opacity-50">👤</span>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-red-500/30 flex items-center justify-center">
                    <span className="text-white text-3xl opacity-50">👤</span>
                  </div>
                </>
              )}

              {layoutMode === 'Gaming Mode' && (
                <>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1/3 aspect-video border-2 border-white bg-blue-500/50 flex items-center justify-center z-10 shadow-md">
                     <span className="text-white text-xl opacity-80">👤</span>
                  </div>
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center pt-8">
                     <span className="text-white text-4xl opacity-30">🎮</span>
                  </div>
                </>
              )}

              {layoutMode === 'Auto-Focus Speaker' && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 border-2 border-white/50 rounded-full flex items-center justify-center animate-ping absolute" />
                   <span className="text-white text-4xl opacity-50 z-10">👤</span>
                </div>
              )}

              {/* Mock Subtitle Neo-Brutalism style */}
              <div className="absolute bottom-1/4 w-[90%] text-center z-20">
                <span className="bg-yellow-400 text-black font-black text-[10px] md:text-xs px-2 py-1 uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2">
                  {topic ? `"${topic.substring(0,15)}..."` : "VIRAL HOOK HERE!"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Condensed Upload Queue */}
      <div className="bg-white border-4 border-black rounded-none p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 max-h-[250px] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b-4 border-black pb-2">
          <h3 className="font-black text-black text-sm uppercase">Upload Queue</h3>
          <span className="text-xs font-bold bg-primary px-2 border-2 border-black">{queue?.length || 0}</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
          {(!queue || queue.length === 0) ? (
             <div className="bg-[#F4F4F0] border-2 border-black border-dashed p-4 text-center">
               <p className="text-xs text-black font-bold uppercase italic">Queue is empty</p>
             </div>
          ) : queue.map((item) => (
            <Link key={item.id} href={`/clipper/${item.id}`} className="bg-[#F4F4F0] border-2 border-black p-2 flex gap-3 items-center hover:bg-yellow-100 hover:translate-y-[-1px] hover:translate-x-[-1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
              <div className="w-8 h-8 bg-black flex items-center justify-center shrink-0 border border-black">
                <span className="text-white text-xs">⏳</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-black truncate mb-0.5">{item.title}</p>
                <div className="w-full h-1.5 bg-white border border-black overflow-hidden">
                  <div className="h-full bg-primary border-r border-black animate-pulse w-[50%]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
