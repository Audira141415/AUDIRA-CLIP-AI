'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { UploadCloud, MonitorPlay, Smartphone, Settings2, Sparkles, Loader2, Link as LinkIcon, CheckCircle2, PlayCircle, MoreHorizontal } from 'lucide-react';
import PageHero from "@/components/ui/PageHero";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useVideoStore } from '@/store/useVideoStore';
import { api } from '@/lib/api';

export default function UploadCenter() {
  const router = useRouter();
  const [importMode, setImportMode] = useState<'LOCAL' | 'YOUTUBE' | 'SOCIAL'>('LOCAL');
  const [urlInput, setUrlInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<{duration: number, w: number, h: number} | null>(null);
  
  // Settings State
  const [intent, setIntent] = useState('Viral Clips');
  const [lang, setLang] = useState('id');
  const [aspect, setAspect] = useState('9:16');
  const [enableCaptions, setEnableCaptions] = useState(true);
  const [subtitleStyle, setSubtitleStyle] = useState('hormozi');
  const [enableBroll, setEnableBroll] = useState(false);
  const [brollKeyword, setBrollKeyword] = useState('');
  const [layoutMode, setLayoutMode] = useState('auto_face');
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "1";
  const workspaceId = "test-workspace";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(selected));
      setVideoMeta(null); // Reset metadata
    }
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.target as HTMLVideoElement;
    setVideoMeta({
      duration: video.duration,
      w: video.videoWidth,
      h: video.videoHeight
    });
  };

  const { uploadVideo } = useVideoStore();

  const handleSubmit = async () => {
    if (importMode === 'LOCAL' && !file) {
      alert("Pilih file video terlebih dahulu!");
      return;
    }
    if (importMode !== 'LOCAL' && !urlInput) {
      alert("Masukkan URL video terlebih dahulu!");
      return;
    }

    if (importMode === 'LOCAL' && file) {
      if (file.size > 10 * 1024 * 1024 * 1024) {
        alert("Ukuran file melebihi batas 10GB!");
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (importMode === 'LOCAL' && file) {
        await uploadVideo(file, {
          userId,
          workspaceId,
          aspect,
          intent,
          lang,
          layoutMode,
          captions: enableCaptions,
          subtitleStyle: enableCaptions ? subtitleStyle : undefined,
          broll: enableBroll,
          topic: enableBroll ? brollKeyword : undefined,
          timeStart: timeStart || undefined,
          timeEnd: timeEnd || undefined,
          onProgress: (progress: number) => {
            setUploadProgress(progress);
          }
        });
        
        setTimeout(() => router.push('/library'), 1000);

      } else if (importMode === 'YOUTUBE' || importMode === 'SOCIAL') {
        setUploadProgress(10); // Start artificial progress for URL import
        const urlToProcess = urlInput;
        const res = await api.post(`/video/import-url?url=${encodeURIComponent(urlToProcess)}&userId=${userId}&workspaceId=${workspaceId}&aspects=${aspect}&intent=${intent}&layoutMode=${layoutMode}&lang=${lang}&captions=${enableCaptions}&subtitleStyle=${subtitleStyle}&broll=${enableBroll}&topic=${encodeURIComponent(brollKeyword)}&timeStart=${timeStart}&timeEnd=${timeEnd}`);

        if (res.status === 200 || res.status === 201) {
          setUploadProgress(100);
          setTimeout(() => router.push('/library'), 1000);
        } else {
          throw new Error('Import gagal');
        }
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memproses video. Pastikan backend menyala.");
      setIsUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 bg-background min-h-screen text-black font-sans p-8">
        
        <PageHero
          title="Tambah Video Baru"
          description="Upload file lokal atau import dari platform lain untuk diproses."
          imageSrc="/images/hero_upload.png"
          imageAlt="Upload Hero"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Main Input Zone */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Import Mode Tabs */}
            <div className="flex gap-4">
              <button 
                onClick={() => setImportMode('LOCAL')}
                className={`flex-1 py-3 px-4 font-black uppercase text-lg border-4 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] flex items-center justify-center gap-2
                  ${importMode === 'LOCAL' ? 'bg-primary border-black text-black' : 'bg-white border-black text-black'}`}
              >
                <UploadCloud className="w-6 h-6" strokeWidth={2.5} /> File Lokal
              </button>
              <button 
                onClick={() => setImportMode('YOUTUBE')}
                className={`flex-1 py-3 px-4 font-black uppercase text-lg border-4 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] flex items-center justify-center gap-2
                  ${importMode === 'YOUTUBE' ? 'bg-accent-blue border-black text-black' : 'bg-white border-black text-black'}`}
              >
                <MonitorPlay className="w-6 h-6" strokeWidth={2.5} /> YouTube Link
              </button>
              <button 
                onClick={() => setImportMode('SOCIAL')}
                className={`flex-1 py-3 px-4 font-black uppercase text-lg border-4 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] flex items-center justify-center gap-2
                  ${importMode === 'SOCIAL' ? 'bg-secondary border-black text-black' : 'bg-white border-black text-black'}`}
              >
                <Smartphone className="w-6 h-6" strokeWidth={2.5} /> TikTok / IG
              </button>
            </div>

            {/* Input Area based on Mode */}
            <div className="bg-white border-4 border-black p-8 shadow-neu min-h-[300px] flex flex-col items-center justify-center transition-all">
              
              {importMode === 'LOCAL' && (
                <div className="w-full relative border-4 border-dashed border-black bg-background p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[400px]">
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title=""
                  />
                  
                  {!previewUrl ? (
                    <>
                      <div className="w-20 h-20 bg-primary border-4 border-black mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
                        <UploadCloud className="w-10 h-10 text-black" strokeWidth={2.5} />
                      </div>
                      <h2 className="text-2xl font-black uppercase mb-2">
                        Drag & Drop atau Klik Disini
                      </h2>
                      <p className="font-bold text-gray-600">
                        Support: MP4, MOV, MKV (Max 10GB)
                      </p>
                    </>
                  ) : (
                    <div className="relative z-20 w-full flex flex-col items-center justify-center gap-6 text-left cursor-default max-w-3xl mx-auto">
                      {/* Video Player Section */}
                      <div className="w-full flex flex-col items-center">
                        <div className="w-full aspect-video bg-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4 relative">
                          <video 
                            src={previewUrl} 
                            controls 
                            onLoadedMetadata={handleLoadedMetadata}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-2">
                          <div className="flex-1 min-w-0 text-center sm:text-left w-full">
                            <h2 className="text-xl font-black uppercase mb-1 truncate w-full" title={file?.name}>{file?.name}</h2>
                            <p className="font-bold text-gray-600">{(file!.size / (1024*1024)).toFixed(2)} MB</p>
                          </div>
                          <button 
                            onClick={(e) => { 
                              e.preventDefault(); 
                              e.stopPropagation(); 
                              setFile(null); 
                              setPreviewUrl(null); 
                              setVideoMeta(null);
                            }}
                            className="bg-primary px-6 py-2 border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all flex-shrink-0"
                          >
                            Ganti Video
                          </button>
                        </div>
                      </div>

                      {/* Horizontal Metadata Box */}
                      {videoMeta && (
                        <div className="w-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-black" fill="currentColor" />
                            <h3 className="font-black text-lg uppercase whitespace-nowrap">Metadata</h3>
                          </div>
                          
                          <div className="flex gap-4 w-full md:w-auto">
                            <div className="bg-secondary p-2 px-4 border-2 border-black flex-1 text-center">
                              <p className="text-xs font-bold text-gray-600 uppercase">Resolusi</p>
                              <p className="font-black text-lg">{videoMeta.w} x {videoMeta.h}</p>
                            </div>
                            
                            <div className="bg-secondary p-2 px-4 border-2 border-black flex-1 text-center">
                              <p className="text-xs font-bold text-gray-600 uppercase">Durasi</p>
                              <p className="font-black text-lg">{Math.round(videoMeta.duration)}s</p>
                            </div>
                          </div>

                          <div className="bg-accent-teal border-2 border-black p-2 px-4 w-full md:w-auto text-center">
                            <p className="font-bold text-sm text-black">🔥 AI Siap Memproses!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {importMode === 'YOUTUBE' && (
                <div className="w-full text-center">
                  <div className="w-20 h-20 bg-accent-blue border-4 border-black mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <MonitorPlay className="w-10 h-10 text-black" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-black uppercase mb-4">Paste Link YouTube</h2>
                  <div className="relative max-w-lg mx-auto mb-6">
                    <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-black" />
                    <input 
                      type="text" 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-12 pr-4 py-4 border-4 border-black font-bold text-lg bg-background outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  
                  {/* Time Range for YouTube */}
                  <div className="max-w-lg mx-auto bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black uppercase text-sm mb-3 text-left">Batasi Rentang Waktu (Opsional)</p>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 flex flex-col items-start">
                        <label className="text-[10px] font-bold uppercase mb-1">Mulai (HH:MM:SS)</label>
                        <input 
                          type="text" 
                          value={timeStart}
                          onChange={(e) => setTimeStart(e.target.value)}
                          placeholder="00:00:00"
                          className="w-full p-2 border-2 border-black font-bold bg-background text-center outline-none focus:bg-white"
                        />
                      </div>
                      <span className="font-black text-xl mt-4">-</span>
                      <div className="flex-1 flex flex-col items-start">
                        <label className="text-[10px] font-bold uppercase mb-1">Selesai (HH:MM:SS)</label>
                        <input 
                          type="text" 
                          value={timeEnd}
                          onChange={(e) => setTimeEnd(e.target.value)}
                          placeholder="00:05:00"
                          className="w-full p-2 border-2 border-black font-bold bg-background text-center outline-none focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {importMode === 'SOCIAL' && (
                <div className="w-full text-center">
                  <div className="w-20 h-20 bg-secondary border-4 border-black mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Smartphone className="w-10 h-10 text-black" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-black uppercase mb-4">Paste Link Reels / TikTok</h2>
                  <div className="relative max-w-lg mx-auto">
                    <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-black" />
                    <input 
                      type="text" 
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://tiktok.com/@user/video/..."
                      className="w-full pl-12 pr-4 py-4 border-4 border-black font-bold text-lg bg-background outline-none focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  </div>
                  <p className="mt-4 font-bold bg-warning inline-block px-2 border-2 border-black">Sistem akan mengunduh video publik secara otomatis</p>
                </div>
              )}

            </div>
          </div>

          {/* AI Settings Column */}
          <div className="bg-primary border-4 border-black shadow-neu p-6 flex flex-col h-fit">
            <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
              <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Settings2 className="w-6 h-6 text-black" strokeWidth={3} />
              </div>
              <h3 className="font-black text-2xl uppercase">Konfigurasi AI</h3>
            </div>
            
            <div className="space-y-6">
              
              {/* Aspect Ratio */}
              <div>
                <label className="block font-black uppercase mb-2 bg-white px-2 border-2 border-black w-fit">Target Aspect</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { ratio: '9:16', label: 'Tiktok/Reels', w: 'w-4', h: 'h-7' },
                    { ratio: '1:1', label: 'Instagram', w: 'w-6', h: 'h-6' },
                    { ratio: '16:9', label: 'YouTube', w: 'w-7', h: 'h-4' }
                  ].map(asp => (
                    <button 
                      key={asp.ratio}
                      onClick={() => setAspect(asp.ratio)}
                      className={`py-3 flex flex-col items-center justify-center gap-2 border-4 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] ${aspect === asp.ratio ? 'bg-black text-white' : 'bg-white text-black hover:bg-secondary'}`}
                    >
                      <div className={`${asp.w} ${asp.h} border-2 border-current rounded-sm ${aspect === asp.ratio ? 'bg-white/20' : 'bg-black/10'}`}></div>
                      <div className="flex flex-col items-center">
                        <span className="font-black leading-none">{asp.ratio}</span>
                        <span className="text-[10px] font-bold mt-1 uppercase opacity-80">{asp.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intent */}
              <div>
                <label className="block font-black uppercase mb-2 bg-white px-2 border-2 border-black w-fit">Tujuan Pemotongan</label>
                <select 
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  className="w-full p-3 border-4 border-black font-bold bg-white outline-none cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="Viral Clips">🔥 Viral Clips (Default)</option>
                  <option value="Educational Highlights">📚 Edukasi / Tutorial</option>
                  <option value="Funny Moments">😂 Momen Lucu</option>
                  <option value="Podcast Teaser">🎙️ Podcast Teaser</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block font-black uppercase mb-2 bg-white px-2 border-2 border-black w-fit">Bahasa Utama</label>
                <select 
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full p-3 border-4 border-black font-bold bg-white outline-none cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="id">🇮🇩 Indonesia</option>
                  <option value="en">🇬🇧 English</option>
                  <option value="auto">🤖 Deteksi Otomatis</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col gap-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={enableCaptions} onChange={(e) => setEnableCaptions(e.target.checked)} className="w-5 h-5 accent-black border-2 border-black cursor-pointer" />
                    <span className="font-black uppercase flex items-center gap-2"><Sparkles className="w-4 h-4"/> Auto-Subtitle</span>
                  </label>
                  {enableCaptions && (
                    <select 
                      value={subtitleStyle}
                      onChange={(e) => setSubtitleStyle(e.target.value)}
                      className="w-full mt-2 p-2 border-2 border-black font-bold bg-background outline-none cursor-pointer text-sm"
                    >
                      <option value="hormozi">💛 Hormozi Style (Bold Yellow)</option>
                      <option value="minimalist">⬜ Minimalist (White Clean)</option>
                      <option value="gaming">🎮 Gaming (Dynamic Colors)</option>
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 hover:bg-accent-teal transition-colors">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={enableBroll} onChange={(e) => setEnableBroll(e.target.checked)} className="w-5 h-5 accent-black border-2 border-black cursor-pointer" />
                    <span className="font-black uppercase flex items-center gap-2"><Sparkles className="w-4 h-4"/> Sisipkan B-Rolls</span>
                  </label>
                  {enableBroll && (
                    <input 
                      type="text" 
                      value={brollKeyword}
                      onChange={(e) => setBrollKeyword(e.target.value)}
                      placeholder="Kata kunci spesifik (opsional)"
                      className="w-full mt-2 p-2 border-2 border-black font-bold bg-background outline-none text-sm"
                    />
                  )}
                </div>
              </div>

              {/* AI Reframing Mode */}
              <div className="mb-4">
                <p className="text-xs font-bold bg-white inline-block px-2 border-2 border-black mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  AI REFRAMING MODE
                </p>
                <select 
                  value={layoutMode}
                  onChange={(e) => setLayoutMode(e.target.value)}
                  className="w-full bg-white border-4 border-black p-3 font-bold cursor-pointer"
                >
                  <option value="auto_face">🧑 AI Face Tracking (Dynamic)</option>
                  <option value="center">🎯 Center Crop (Static)</option>
                  <option value="split_left">✂️ Split Screen (Gameplay/React)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit}
                disabled={isUploading}
                className="w-full mt-4 py-4 bg-black text-white font-black uppercase text-xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> Memproses... {uploadProgress}%</>
                ) : (
                  <>Proses Sekarang <Sparkles className="w-6 h-6" /></>
                )}
              </button>

            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
