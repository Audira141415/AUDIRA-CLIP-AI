// @ts-nocheck
'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Send, Zap, Image as ImageIcon, Music, Video, RefreshCw, Wand2, ArrowUpRight, MessageSquare, Bot, Sparkles, Plus, Play, Pause, Square, Trash2, Edit2, Download, Copy, Share2, CornerDownRight, Check, VolumeX, Type, Smartphone, Mic, ArrowRight, Lock, Eye, MousePointer2, Undo, Redo, Scissors, Maximize, Settings2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { useVideoStore } from '@/store/useVideoStore';

export default function CopilotPage() {
  const actions = [
    { title: "Auto Highlight", desc: "Find the best moments in your video", icon: Zap, bg: "bg-[#F5A623]" },
    { title: "Auto Cut Silence", desc: "Remove silent parts automatically", icon: VolumeX, bg: "bg-[#00E5FF]" },
    { title: "Add Captions", desc: "Generate accurate captions", icon: Type, bg: "bg-[#FFEDF4]" },
    { title: "Reframe for Shorts", desc: "Convert to vertical format", icon: Smartphone, bg: "bg-white" },
    { title: "Auto B-Roll", desc: "Find and insert relevant B-roll", icon: Video, bg: "bg-[#F5A623]" },
    { title: "Improve Audio", desc: "Enhance voice and reduce noise", icon: Mic, bg: "bg-[#00E5FF]" }
  ];

  const { videos, fetchVideos } = useVideoStore();
  const [selectedVideoId, setSelectedVideoId] = useState<string>('');
  
  // Ollama Models State
  const [availableModels, setAvailableModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');

  useEffect(() => {
    fetchVideos();
    // Fetch Ollama models
    fetch('/api/ai/models')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.models.length > 0) {
          setAvailableModels(data.models);
          // Coba baca dari localStorage dulu
          const savedModel = localStorage.getItem('audira_selected_llm');
          
          if (savedModel && data.models.some((m: any) => m.name === savedModel)) {
            setSelectedModel(savedModel);
          } else {
            setSelectedModel(data.models[0].name); // Select first model by default
          }
        }
      })
      .catch(err => console.error("Ollama API Error:", err));
  }, [fetchVideos]);

  // Fungsi untuk menyimpan pilihan
  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    localStorage.setItem('audira_selected_llm', modelName);
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { videoId: selectedVideoId, modelName: selectedModel }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const history = [
    { action: "Created highlights", time: "2 minutes ago" },
    { action: "Added captions", time: "10 minutes ago" },
    { action: "Removed silences", time: "25 minutes ago" },
    { action: "Reframed for Shorts", time: "1 hour ago" }
  ];

  return (
    <DashboardLayout>
      <div className="flex h-full bg-[#FAFAFA] text-black font-sans -m-8">
        
        {/* Main Content Area (Left) */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto h-[calc(100vh-80px)]">
          
          <PageHero
            title="AI Copilot"
            description="Your creative AI assistant for video editing and content generation."
            badge="BETA"
            className="shrink-0"
            imageSrc="/images/hero_copilot.png"
            imageAlt="Copilot Hero"
          />

          {/* Video Selector */}
          <div className="mb-6 p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <label className="block text-sm font-black uppercase text-black mb-2">1. Pilih Video untuk Dianalisis</label>
            <select 
              value={selectedVideoId}
              onChange={(e) => setSelectedVideoId(e.target.value)}
              className="w-full border-4 border-black p-3 font-bold text-black outline-none cursor-pointer focus:bg-[#FFEDF4] transition-colors"
            >
              <option value="" disabled>-- Pilih Video --</option>
              {videos.map(v => (
                <option key={v.id} value={v.id}>{v.title}</option>
              ))}
            </select>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {actions.map((item, i) => (
              <button 
                key={i} 
                onClick={() => {
                  if (!selectedVideoId) return alert('Silakan pilih video terlebih dahulu');
                  handleInputChange({ target: { value: item.title } } as any);
                }}
                className="bg-white border-4 border-black p-5 flex items-start gap-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all group"
              >
                <div className={`w-12 h-12 border-4 border-black flex items-center justify-center shrink-0 ${item.bg} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-12 transition-transform`}>
                  <item.icon className="w-6 h-6 text-black" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-lg uppercase">{item.title}</h3>
                  <p className="font-bold text-sm text-gray-600 leading-tight">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 border-4 border-black bg-white mb-6 p-6 overflow-y-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <Bot className="w-16 h-16 mb-4" />
                <h3 className="font-black text-xl uppercase">Mulai Percakapan</h3>
                <p className="font-bold">Tanyakan sesuatu atau minta AI melakukan aksi pada video Anda.</p>
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] p-4 border-4 border-black font-bold ${
                    m.role === 'user' 
                      ? 'bg-[#00E5FF] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                      : 'bg-[#FAFAFA] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}>
                    {m.content}
                    
                    {/* Generative UI / Tool Invocations Render */}
                    {m.toolInvocations && m.toolInvocations.map(toolInvocation => {
                      const toolCallId = toolInvocation.toolCallId;
                      if ('result' in toolInvocation) {
                        // Tool has finished execution
                        return (
                          <div key={toolCallId} className="mt-4 p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(245,166,35,1)]">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                              <span className="font-black uppercase text-sm">{toolInvocation.result.message}</span>
                            </div>
                            
                            {toolInvocation.toolName === 'findFunnyMoments' && toolInvocation.result.results && toolInvocation.result.results.length > 0 && (
                              <div className="flex flex-col gap-2 mt-2 max-h-48 overflow-y-auto border-2 border-black p-2 bg-white">
                                {toolInvocation.result.results.map((r: any) => (
                                  <div key={r.id} className="flex justify-between items-center bg-[#FAFAFA] p-2 border-2 border-black hover:bg-[#FFEDF4] transition-colors">
                                    <span className="text-xs font-black bg-black text-white px-2 py-1">{r.time}</span>
                                    <span className="text-sm font-bold uppercase truncate max-w-[200px]">{r.title}</span>
                                    <button className="bg-[#00E5FF] border-2 border-black p-1 hover:bg-white transition-colors" title="Buka Klip">
                                      <Play className="w-4 h-4"/>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {toolInvocation.toolName === 'generateSubtitles' && toolInvocation.result.status === 'processing' && (
                              <div className="w-full mt-2 bg-[#FFEDF4] border-2 border-black font-black uppercase text-xs py-2 px-3 text-center">
                                Silakan periksa halaman Clipper nanti untuk meninjau subtitle
                              </div>
                            )}
                          </div>
                        );
                      } else {
                        // Tool is executing
                        return (
                          <div key={toolCallId} className="mt-4 p-4 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] opacity-70 flex items-center gap-3">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span className="font-black uppercase text-sm text-gray-500">
                              {toolInvocation.toolName === 'findFunnyMoments' ? 'Mencari Momen Lucu...' : 
                               toolInvocation.toolName === 'generateSubtitles' ? 'Membuat Subtitle...' : 
                               toolInvocation.toolName === 'autoReframe' ? 'Me-reframe Video...' : 'Memproses...'}
                            </span>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Box */}
          <form onSubmit={handleSubmit} className="bg-white border-4 border-[#F5A623] p-4 mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative shrink-0">
            <div className="flex items-center gap-3">
              <input 
                value={input}
                onChange={handleInputChange}
                className="flex-1 bg-transparent font-bold text-lg outline-none placeholder:text-gray-400"
                placeholder="Minta Copilot melakukan sesuatu..."
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading || !(input || '').trim()}
                className="bg-[#F5A623] w-12 h-12 border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <RefreshCw className="w-6 h-6 animate-spin text-black" strokeWidth={3} /> : <ArrowRight className="w-6 h-6 text-black" strokeWidth={3} />}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {["Carikan momen lucu di video ini", "Buatkan subtitle bahasa Indonesia", "Reframe untuk TikTok"].map((pill, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => handleInputChange({ target: { value: pill } } as any)}
                  className="text-xs font-black uppercase bg-[#FAFAFA] border-2 border-black px-3 py-1.5 hover:bg-[#F5A623] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  {pill}
                </button>
              ))}
            </div>
          </form>

          {/* Timeline UI Removed as part of AI Copilot Backend Integration */}
        </div>

        {/* Right Sidebar */}
        <div className="w-[340px] shrink-0 border-l-4 border-black bg-white flex flex-col h-[calc(100vh-80px)]">
          <div className="p-6 border-b-4 border-black flex items-center justify-between">
            <h2 className="font-black uppercase text-xl">Copilot History</h2>
            <button className="text-xs font-black uppercase text-[#F5A623] hover:underline decoration-2 underline-offset-2">See all</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.map((item, i) => (
              <div key={i} className="p-3 border-2 border-black flex justify-between items-center hover:bg-[#FAFAFA] transition-colors cursor-pointer group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:-translate-x-0.5">
                <div>
                  <h4 className="font-black text-sm">{item.action}</h4>
                  <p className="text-xs font-bold text-gray-500">{item.time}</p>
                </div>
                <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center group-hover:bg-[#00E5FF] transition-colors">
                  <Play className="w-4 h-4 fill-current" />
                </div>
              </div>
            ))}
          </div>

          {/* Info Panel */}
          <div className="p-6 border-y-4 border-black bg-[#FAFAFA]">
            <h3 className="font-black uppercase text-lg mb-4">Info</h3>
            <div className="space-y-2 text-sm font-bold">
              {selectedVideoId ? (() => {
                const sv = videos.find(v => v.id === selectedVideoId);
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Video</span>
                      <span className="truncate max-w-[120px]">{sv?.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Duration</span>
                      <span>{sv?.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className="uppercase text-[#F5A623]">{sv?.status}</span>
                    </div>
                  </>
                );
              })() : (
                <div className="text-gray-500 text-xs italic">Pilih video untuk melihat detail.</div>
              )}
            </div>
          </div>

          {/* Copilot Settings */}
          <div className="p-6 bg-white">
            <h3 className="font-black uppercase text-lg mb-4 flex items-center gap-2">
              <Settings2 className="w-5 h-5" /> Copilot Settings
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">Local LLM (Ollama)</label>
                <select 
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-[#FAFAFA] border-2 border-black p-2 font-bold outline-none cursor-pointer focus:border-[#F5A623] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  {availableModels.length === 0 ? (
                    <option value="" disabled>Memuat AI Lokal...</option>
                  ) : (
                    availableModels.map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-black uppercase text-gray-500">Creativity</label>
                  <span className="text-xs font-black bg-[#FFEDF4] border-2 border-black px-1">Medium</span>
                </div>
                <input type="range" className="w-full accent-[#F5A623]" min="0" max="100" defaultValue="50" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <label className="block text-sm font-black uppercase">Auto-apply results ⚡</label>
                  <span className="text-xs font-bold text-gray-500">Automatically apply safe changes</span>
                </div>
                {/* Custom Toggle */}
                <div className="w-12 h-6 bg-[#F5A623] border-2 border-black rounded-full p-0.5 cursor-pointer relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-4 h-4 bg-white border-2 border-black rounded-full absolute right-1"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
