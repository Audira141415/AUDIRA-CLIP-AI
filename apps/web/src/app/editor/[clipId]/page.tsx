"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Loader2, Save, Play, CheckCircle2, ChevronLeft, Type } from "lucide-react";

export default function SubtitleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const clipId = params.clipId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [clip, setClip] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);

  // Subtitle Style Customizer State
  const [subColor, setSubColor] = useState("Yellow"); // Yellow, Green, Cyan
  const [subFont, setSubFont] = useState("Impact");

  useEffect(() => {
    if (clipId) fetchClipData();
  }, [clipId]);

  const fetchClipData = async () => {
    try {
      // Assuming GET /video/clip/:id doesn't exist directly, but we can get it from video?
      // Wait, we need an endpoint to get a single clip.
      // We can get subtitles first:
      const subRes = await api.get(`/video/clip/${clipId}/subtitles`);
      if (subRes.data.success) {
        setSegments(subRes.data.segments);
      }
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    try {
      const res = await api.post(`/video/clip/${clipId}/transcribe`);
      if (res.data.success) {
        setSegments(res.data.segments);
      } else {
        alert("Gagal mentranskripsi klip.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saat mentranskripsi.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTextChange = (index: number, newText: string) => {
    const updated = [...segments];
    updated[index].text = newText;
    setSegments(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post(`/video/clip/${clipId}/subtitles`, segments);
      alert("Subtitle berhasil disimpan!");
      router.back();
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan subtitle.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 pb-32 min-h-full bg-[#FAFAFA]">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black font-bold uppercase text-sm">
          <ChevronLeft className="w-4 h-4" /> Kembali ke Clipper
        </button>

        <div className="flex justify-between items-end mb-8 border-b-4 border-black pb-4">
          <div>
            <h1 className="text-4xl font-black uppercase text-black">Interactive Subtitle Editor</h1>
            <p className="text-gray-500 font-bold uppercase text-sm mt-2">Koreksi ejaan AI dan atur gaya visual subtitle Anda</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleTranscribe}
              disabled={isTranscribing}
              className="bg-white border-4 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2"
            >
              {isTranscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Type className="w-5 h-5" />}
              {segments.length > 0 ? "Transkrip Ulang (AI)" : "Mulai Transkripsi AI"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || segments.length === 0}
              className="bg-[#00FF66] border-4 border-black px-8 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Simpan & Kembali
            </button>
          </div>
        </div>

        {segments.length === 0 && !isTranscribing && (
          <div className="bg-white border-4 border-dashed border-gray-300 rounded-2xl p-16 flex flex-col items-center justify-center text-center">
            <Type className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-black uppercase text-gray-400">Belum Ada Subtitle</h3>
            <p className="text-gray-400 font-bold max-w-sm mt-2">Klik tombol "Mulai Transkripsi AI" di atas untuk meminta AI mendengarkan klip ini dan mengubahnya menjadi teks.</p>
          </div>
        )}

        {segments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Timeline Editor */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-black uppercase border-l-8 border-[#FFD700] pl-3 mb-6">Timeline Editor</h2>
              
              <div className="space-y-3">
                {segments.map((seg, idx) => (
                  <div key={idx} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-4 items-start group hover:border-[#00E5FF] transition-colors">
                    
                    {/* Timestamp */}
                    <div className="shrink-0 w-24 bg-black text-white text-[10px] font-black py-1 px-2 rounded-sm text-center tabular-nums self-center">
                      {seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s
                    </div>
                    
                    {/* Text Input */}
                    <div className="flex-1">
                      <textarea
                        value={seg.text}
                        onChange={(e) => handleTextChange(idx, e.target.value)}
                        className="w-full bg-transparent border-none outline-none font-bold text-lg resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Style Customizer */}
            <div>
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-8">
                <h2 className="text-xl font-black uppercase border-b-4 border-black pb-4 mb-6">Style Customizer</h2>
                
                {/* Color */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Highlight Color</p>
                  <div className="flex gap-3">
                    {[
                      { name: 'Yellow', bg: 'bg-[#FFD700]' },
                      { name: 'Green', bg: 'bg-[#00FF66]' },
                      { name: 'Cyan', bg: 'bg-[#00FFFF]' },
                      { name: 'White', bg: 'bg-white' }
                    ].map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSubColor(color.name)}
                        className={`w-10 h-10 border-4 transition-transform ${color.bg} ${
                          subColor === color.name 
                          ? 'border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] scale-110 z-10' 
                          : 'border-gray-200 hover:border-black hover:scale-105'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Font */}
                <div className="space-y-3 mb-8">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wider">Font Family</p>
                  <select 
                    value={subFont}
                    onChange={(e) => setSubFont(e.target.value)}
                    className="w-full border-4 border-black bg-[#F4F4F0] px-4 py-3 text-sm font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none cursor-pointer"
                  >
                    <option value="Impact">Impact (Hormozi Style)</option>
                    <option value="Montserrat Black">Montserrat</option>
                    <option value="Arial Black">Arial Black</option>
                  </select>
                </div>

                {/* Live Preview */}
                <div className="bg-black border-4 border-black relative overflow-hidden flex flex-col items-center justify-center p-6 h-48 group">
                  <p className="text-[10px] text-gray-500 absolute top-2 left-2 uppercase font-black z-10">Live Preview</p>
                  
                  <div className="relative z-10 text-center w-full transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white text-3xl font-black uppercase tracking-tight leading-none block" style={{ 
                      fontFamily: subFont.includes('Impact') ? 'Impact, sans-serif' : subFont.includes('Montserrat') ? '"Montserrat Black", sans-serif' : '"Arial Black", sans-serif',
                      textShadow: '3px 3px 0px #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000' 
                    }}>
                      RAHASIA <span className={`
                        ${subColor === 'Yellow' ? 'text-[#FFD700]' : ''}
                        ${subColor === 'Green' ? 'text-[#00FF66]' : ''}
                        ${subColor === 'Cyan' ? 'text-[#00FFFF]' : ''}
                        ${subColor === 'White' ? 'text-white' : ''}
                      `}>BESAR</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
