'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Plus, FolderPlus, Play, LayoutGrid, List, ChevronDown, MoreVertical, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LibraryContent({ activeTab }: { activeTab: string }) {
  const [sortBy, setSortBy] = useState('Sort: Newest');
  const [folder, setFolder] = useState('All Folders');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to transform internal DB URL to HTTP
  const getMediaUrl = (url: string | undefined | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('local://')) return url.replace('local://', 'http://localhost:3001/');
    // Fallback if it's stored as raw filename
    return `http://localhost:3001/uploads/${url.split('/').pop()}`;
  };
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);

  const formatTime = (seconds: number | undefined | null) => {
    if (seconds == null || isNaN(seconds)) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = () => {
    if (items.length === 0) return;
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkAction = async (action: string) => {
    if (!confirm(`Are you sure you want to ${action} ${selectedIds.size} items?`)) return;
    try {
      const selectedItemsData = items.filter(i => selectedIds.has(i.id));
      for (const item of selectedItemsData) {
        const type = item.videoId ? 'clip' : 'video';
        const finalAction = activeTab === 'TRASH' && action === 'trash' ? 'delete' : action;
        await fetch(`http://localhost:3001/video/${finalAction}/${type}/${item.id}`, { method: 'POST' });
      }
      if (action === 'trash') {
        setItems(items.filter(item => !selectedIds.has(item.id)));
      }
      setSelectedIds(new Set());
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (action: string, type: string, id: string) => {
    try {
      if (action === 'trash') {
        await fetch(`http://localhost:3001/video/trash/${type}/${id}`, { method: 'POST' });
        // Refresh by removing locally
        setItems(items.filter(item => item.id !== id));
      } else if (action === 'delete') {
        await fetch(`http://localhost:3001/video/delete/${type}/${id}`, { method: 'POST' });
        setItems(items.filter(item => item.id !== id));
      } else if (action === 'restore') {
        await fetch(`http://localhost:3001/video/restore/${type}/${id}`, { method: 'POST' });
        setItems(items.filter(item => item.id !== id));
      } else if (action === 'favorite') {
        await fetch(`http://localhost:3001/video/favorite/${type}/${id}`, { method: 'POST' });
        // Refresh by toggling locally
        setItems(items.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
      }
    } catch (e) {
      console.error(e);
    }
    setOpenDropdownId(null);
  };

  // Mock Auth
  const userId = "test-user";
  const workspaceId = "test-workspace";

  const fetchLibrary = async () => {
    try {
      const tabMap: any = {
        'ALL VIDEOS': 'ALL',
        'CLIPS': 'CLIPS',
        'PROJECTS': 'PROJECTS',
        'FAVORITES': 'FAVORITES',
        'TRASH': 'TRASH'
      };
      
      const params = new URLSearchParams({
        userId,
        workspaceId,
        tab: tabMap[activeTab],
        sortBy,
        folder
      });

      const res = await fetch(`http://localhost:3001/video/library?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
        } else if (data.videos && data.clips) {
          setItems([...data.videos, ...data.clips]);
        } else {
          setItems([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch library", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchLibrary().finally(() => setIsLoading(false));
  }, [activeTab, sortBy, folder]);

  // Polling mechanism
  useEffect(() => {
    const hasProcessing = items.some(item => item.status === 'PROCESSING');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchLibrary();
    }, 2000);

    return () => clearInterval(interval);
  }, [items, activeTab, sortBy, folder]);

  const tabs = [
    { name: 'ALL VIDEOS', href: '/library', count: activeTab === 'ALL VIDEOS' ? items.length : '?' },
    { name: 'CLIPS', href: '/library/clips', count: activeTab === 'CLIPS' ? items.length : '?' },
    { name: 'PROJECTS', href: '/library/projects', count: activeTab === 'PROJECTS' ? items.length : '?' },
    { name: 'FAVORITES', href: '/library/favorites', count: activeTab === 'FAVORITES' ? items.length : '?' },
    { name: 'TRASH', href: '/library/trash', count: activeTab === 'TRASH' ? items.length : '?' },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 bg-background min-h-screen text-black font-sans p-8">
        
        {/* Top Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-5xl font-heading font-black uppercase tracking-tight mb-6">Video Library</h1>
            
            {/* Tabs */}
            <div className="flex gap-6 border-b-4 border-black pb-0">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`pb-4 px-2 flex items-center gap-2 text-lg font-black transition-colors border-b-4 ${
                    activeTab === tab.name ? 'border-primary text-black bg-white shadow-neu translate-y-[-4px] translate-x-[-4px]' : 'border-transparent text-gray-600 hover:text-black hover:bg-secondary'
                  }`}
                >
                  {tab.name}
                  <span className={`text-sm py-0.5 px-2 border-2 border-black font-bold ${activeTab === tab.name ? 'bg-primary text-black' : 'bg-white text-black'}`}>
                    {tab.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/upload" className="flex items-center gap-2 bg-white hover:bg-secondary border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] px-6 py-3 font-black uppercase text-lg transition-all">
              Upload <ChevronDown className="w-5 h-5" strokeWidth={3} />
            </Link>
            <button className="flex items-center gap-2 bg-primary hover:bg-white border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] px-6 py-3 font-black uppercase text-lg transition-all">
              <FolderPlus className="w-5 h-5" strokeWidth={3} /> New Folder
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4 items-center">
            {/* Select All Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer bg-white border-4 border-black px-4 py-2 font-black uppercase hover:bg-secondary transition-colors shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px]">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-primary border-2 border-black cursor-pointer"
                checked={items.length > 0 && selectedIds.size === items.length}
                onChange={handleSelectAll}
              />
              Select All
            </label>

            {selectedIds.size > 0 && (
              <button 
                onClick={() => handleBulkAction('trash')}
                className="bg-primary hover:bg-white text-black border-4 border-black font-black uppercase px-4 py-2 shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] transition-colors"
              >
                Delete Selected ({selectedIds.size})
              </button>
            )}

            {['All Folders', 'All Tags', 'All Durations', 'All Owners'].map((filter) => (
              <button 
                key={filter} 
                onClick={() => filter === 'All Folders' && setFolder(folder === 'All Folders' ? 'Important' : 'All Folders')}
                className="flex items-center gap-2 bg-white hover:bg-accent-teal border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] px-4 py-2 text-md font-bold text-black uppercase transition-all"
              >
                {filter === 'All Folders' ? folder : filter} <ChevronDown className="w-5 h-5 text-black" strokeWidth={3} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSortBy(sortBy === 'Sort: Newest' ? 'Sort: Oldest' : 'Sort: Newest')}
              className="flex items-center gap-2 text-md font-black text-black bg-white border-4 border-black px-4 py-2 shadow-neu uppercase"
            >
              {sortBy} <ChevronDown className="w-5 h-5" strokeWidth={3} />
            </button>
            <div className="flex items-center gap-2 border-4 border-black p-1 bg-secondary shadow-neu">
              <button className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black"><LayoutGrid className="w-5 h-5" strokeWidth={3} /></button>
              <button className="p-2 bg-transparent text-black hover:bg-white border-2 border-transparent hover:border-black"><List className="w-5 h-5" strokeWidth={3} /></button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-20 bg-white border-4 border-black shadow-neu">
            <h3 className="text-2xl font-black uppercase mb-2">No items found</h3>
            <p className="font-bold">Try uploading a new video or changing your filters.</p>
          </div>
        )}

        {/* Video Grid */}
        {!isLoading && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {items.map((item) => {
              // Handle mixed items (videos, clips, projects) gracefully
              const title = item.title || item.name || 'Untitled';
              const date = new Date(item.createdAt).toLocaleDateString();
              const size = item.size || 'N/A'; // Mock size since db doesn't have it
              const duration = item.duration ? Math.round(item.duration) + 's' : '00:00';
              const isFav = item.isFavorite;
              
              let aspectClass = "aspect-video"; // default 16:9
              if (item.aspectRatio === "9:16") aspectClass = "aspect-[9/16]";
              if (item.aspectRatio === "1:1") aspectClass = "aspect-square";

              return (
                <div key={item.id} className="group flex flex-col gap-0 bg-white border-4 border-black shadow-neu hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-neu-hover transition-all relative">
                  
                  {/* Selection Checkbox */}
                  <div className="absolute top-2 left-2 z-20">
                    <input 
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      className="w-6 h-6 accent-primary cursor-pointer border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white"
                    />
                  </div>

                  {/* Thumbnail Container */}
                    <div 
                    className={`relative ${aspectClass} bg-black border-b-4 border-black overflow-hidden cursor-pointer`}
                    onClick={() => item.url ? setPlayingVideoUrl(item.url) : alert('Video URL belum tersedia')}
                  >
                    {item.thumbnailUrl || item.url ? (
                      // Note: We use img tag here safely because it's a dynamic user URL
                      <img 
                        src={getMediaUrl(item.thumbnailUrl) || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000'} 
                        className="absolute inset-0 w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 ease-in-out" 
                        alt={title} 
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-secondary" />
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <div className="w-16 h-16 bg-primary border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-black ml-1" fill="currentColor" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-black px-2 py-1 text-black">
                      {duration}
                    </div>

                    {/* Viral Score Badge */}
                    {item.score && (
                      <div className="absolute top-2 right-2 bg-primary text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-sm font-black px-2 py-1 uppercase z-20">
                        🔥 {Math.round(item.score)} VIRAL
                      </div>
                    )}

                    {/* Pacing Badge */}
                    {item.pacing && (
                      <div className="absolute top-10 right-2 bg-accent-teal text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black px-2 py-1 uppercase z-20">
                        {item.wpm} WPM • {item.pacing}
                      </div>
                    )}
                    {/* Vibe Badge */}
                    {item.vibe && (
                      <div className="absolute top-10 left-2 bg-[#ff00ff] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black px-2 py-1 uppercase z-20">
                        {item.vibe}
                      </div>
                    )}

                    {/* B-Roll Keyword Badge */}
                    {item.brollKeyword && (
                      <div className="absolute bottom-10 left-2 bg-[#00ffcc] text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[10px] font-black px-2 py-1 uppercase z-20">
                        🎥 B-ROLL: {item.brollKeyword}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-background">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-black text-lg text-black uppercase truncate pr-2 cursor-pointer group-hover:underline">
                        {title} {isFav && '⭐'}
                      </h3>
                    <div className="relative">
                      <button 
                        onClick={() => toggleDropdown(item.id)}
                        className="text-black hover:bg-primary border-2 border-transparent hover:border-black p-1 transition-all"
                      >
                        <MoreVertical className="w-5 h-5" strokeWidth={3} />
                      </button>

                      {openDropdownId === item.id && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col font-black uppercase text-sm">
                          {activeTab === 'TRASH' ? (
                            <>
                              <button onClick={() => handleAction('restore', item.videoId ? 'clip' : 'video', item.id)} className="p-3 text-left hover:bg-[#00ffcc] border-b-4 border-black">
                                Kembalikan (Restore)
                              </button>
                              <button onClick={() => handleAction('delete', item.videoId ? 'clip' : 'video', item.id)} className="p-3 text-left hover:bg-primary text-black">
                                Hapus Permanen
                              </button>
                            </>
                          ) : (
                            <>
                              <Link href={`/clipper?videoId=${item.id}`} className="p-3 text-left hover:bg-accent-blue border-b-4 border-black">
                                Buka di Clipper (Edit)
                              </Link>
                              <button onClick={() => handleAction('favorite', item.videoId ? 'clip' : 'video', item.id)} className="p-3 text-left hover:bg-warning border-b-4 border-black">
                                {isFav ? 'Hapus Favorit' : 'Jadikan Favorit'}
                              </button>
                              <button onClick={() => handleAction('trash', item.videoId ? 'clip' : 'video', item.id)} className="p-3 text-left hover:bg-primary text-black">
                                Buang ke Sampah
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    </div>
                    {/* AI Insights Box */}
                    {(item.alternativeTitle || item.hookStrength || item.hashtags) && (
                      <div className="flex flex-col gap-2 mt-2 p-2 bg-secondary border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        
                        {/* A/B Test & BGM */}
                        <div className="flex flex-col gap-1">
                          {item.alternativeTitle && (
                            <p className="text-[10px] font-bold text-black truncate">
                              <span className="font-black bg-white px-1 border-2 border-black mr-1">A/B</span> 
                              {item.alternativeTitle}
                            </p>
                          )}
                          {item.bgmSuggestion && (
                            <p className="text-[10px] font-bold text-black truncate">
                              <span className="font-black bg-white px-1 border-2 border-black mr-1">🎵</span> 
                              {item.bgmSuggestion}
                            </p>
                          )}
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.hookStrength && (
                            <span className="text-[9px] font-black uppercase bg-[#fffaaa] border-2 border-black px-1">
                              {item.hookStrength}
                            </span>
                          )}
                          {item.targetDemographic && (
                            <span className="text-[9px] font-black uppercase bg-[#ddddff] border-2 border-black px-1">
                              🎯 {item.targetDemographic}
                            </span>
                          )}
                          {item.ctaOverlay && (
                            <span className="text-[9px] font-black uppercase bg-accent-blue border-2 border-black px-1 text-black">
                              👉 {item.ctaOverlay}
                            </span>
                          )}
                          {item.brandSafety === "⚠️ Risiko (Sensitif/Kasar)" && (
                            <span className="text-[9px] font-black uppercase bg-red-500 border-2 border-black px-1 text-white">
                              {item.brandSafety}
                            </span>
                          )}
                          {item.retentionRisk && (
                            <span className="text-[9px] font-black uppercase bg-[#ffdddd] border-2 border-black px-1">
                              Risk: {item.retentionRisk}
                            </span>
                          )}
                        </div>

                        {/* Hashtags */}
                        {item.hashtags && (
                          <div className="text-[9px] font-bold text-black/60 truncate mt-1">
                            {item.hashtags}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Meta Data */}
                    <div className="mt-3 flex flex-col gap-1">
                      {item.startTime != null && item.duration != null && item.videoId && (
                        <div className="text-[10px] font-black text-black bg-accent-teal px-1 inline-block border-2 border-black w-fit uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          ⏱️ SUMBER: {formatTime(item.startTime)} - {formatTime(item.startTime + item.duration)}
                        </div>
                      )}
                      <div className="text-xs font-black text-black/60 uppercase">
                        {date} {item.size && item.size !== 'N/A' && `• ${item.size}`}
                      </div>
                    </div>
                    
                    {item.status === 'PROCESSING' ? (
                      <div className="w-full mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-black uppercase">{item.statusMessage || 'Sedang Diproses...'}</span>
                          <span className="text-xs font-black">{item.progress || 0}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 border-2 border-black">
                          <div className="h-full bg-primary" style={{ width: `${item.progress || 0}%`, transition: 'width 0.5s ease-in-out' }}></div>
                        </div>
                      </div>
                    ) : (
                      <div className={`text-xs font-black uppercase inline-block px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-2 ${item.status === 'FAILED' ? 'bg-warning text-black' : 'bg-white text-black'}`}>
                        {item.status || 'READY'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Video Player Modal */}
        {playingVideoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,204,0,1)] w-full max-w-5xl h-[80vh] relative flex flex-col">
              <button 
                onClick={() => setPlayingVideoUrl(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-primary border-4 border-black text-black font-black text-2xl flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50"
              >
                X
              </button>
              <div className="bg-black flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
                {!playingVideoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
                    <Loader2 className="w-12 h-12 animate-spin mb-4" />
                    <p className="font-bold">Memuat Video...</p>
                  </div>
                )}
                <video 
                  src={getMediaUrl(playingVideoUrl) || ''} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain relative z-10"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
