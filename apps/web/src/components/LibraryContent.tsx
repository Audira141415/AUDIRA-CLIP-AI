// @ts-nocheck
'use client';

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Plus, FolderPlus, Play, LayoutGrid, List, ChevronDown, MoreVertical, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';

import { useVideoStore } from '@/store/useVideoStore';
import PageHero from "@/components/ui/PageHero";

export default function LibraryContent({ activeTab }: { activeTab: string }) {
  const [sortBy, setSortBy] = useState('Sort: Newest');
  const [folder, setFolder] = useState('All Folders');
  const [tag, setTag] = useState('All Tags');
  const [duration, setDuration] = useState('All Durations');
  const [owner, setOwner] = useState('All Owners');
  const [openFilterDropdown, setOpenFilterDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { videos: items, isLoading, fetchVideos, setVideos: setItems, renameMedia, mergeClips } = useVideoStore();

  // Helper to transform internal DB URL to HTTP
  const getMediaUrl = (url: string | undefined | null) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('local://')) return url.replace('local://', 'http://localhost:3345/');
    // Fallback if it's stored as raw filename
    return `http://localhost:3345/uploads/${url.split('/').pop()}`;
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
        await api.post(`/video/${finalAction}/${type}/${item.id}`);
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
        await api.post(`/video/trash/${type}/${id}`);
        // Refresh by removing locally
        setItems(items.filter(item => item.id !== id));
      } else if (action === 'delete') {
        await api.post(`/video/delete/${type}/${id}`);
        setItems(items.filter(item => item.id !== id));
      } else if (action === 'restore') {
        await api.post(`/video/restore/${type}/${id}`);
        setItems(items.filter(item => item.id !== id));
      } else if (action === 'favorite') {
        await api.post(`/video/favorite/${type}/${id}`);
        // Refresh by toggling locally
        setItems(items.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
      }
    } catch (e) {
      console.error(e);
    }
    setOpenDropdownId(null);
  };

  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "1";
  const workspaceId = "test-workspace";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const tabMap: any = {
      'ALL VIDEOS': 'ALL',
      'CLIPS': 'CLIPS',
      'PROJECTS': 'PROJECTS',
      'FAVORITES': 'FAVORITES',
      'TRASH': 'TRASH'
    };
    fetchVideos({ tab: tabMap[activeTab], sortBy, folder, search: debouncedSearch, tag, duration, owner, userId, workspaceId });
  }, [activeTab, sortBy, folder, debouncedSearch, tag, duration, owner, fetchVideos, userId, workspaceId]);

  // Polling mechanism
  useEffect(() => {
    const hasProcessing = items.some(item => item.status === 'PROCESSING');
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      const tabMap: any = {
        'ALL VIDEOS': 'ALL',
        'CLIPS': 'CLIPS',
        'PROJECTS': 'PROJECTS',
        'FAVORITES': 'FAVORITES',
        'TRASH': 'TRASH'
      };
      fetchVideos({ tab: tabMap[activeTab], sortBy, folder, search: debouncedSearch, tag, duration, owner, userId, workspaceId });
    }, 2000);

    return () => clearInterval(interval);
  }, [items, activeTab, sortBy, folder, debouncedSearch, tag, duration, owner]);

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
        
        <PageHero
          title="Video Library"
          description="Manage, organize, and find all your videos and clips."
          imageSrc="/images/hero_library.png"
          imageAlt="Library Hero"
          rightContent={
            <>
              <Link href="/upload" className="flex items-center gap-2 bg-white hover:bg-secondary border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] px-6 py-3 font-black uppercase text-lg transition-all">
                Upload <ChevronDown className="w-5 h-5" strokeWidth={3} />
              </Link>
              <button 
                onClick={async () => {
                  const folder = prompt('Masukkan nama folder lokal (contoh: my-videos, atau path absolut D:/Videos):', 'videos');
                  if (!folder) return;
                  try {
                    const res = await fetch('/api/video/local-sync', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ folderPath: folder })
                    });
                    const data = await res.json();
                    if (data.success) {
                      alert(`Berhasil tersinkronisasi: ${data.syncedCount} video baru!`);
                      fetchVideos({ tab: 'ALL' }); // refresh
                    } else {
                      alert('Gagal: ' + data.error);
                    }
                  } catch(e) {
                    alert('Error syncing folder');
                  }
                }}
                className="flex items-center gap-2 bg-[#00E5FF] hover:bg-white border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] px-6 py-3 font-black uppercase text-lg transition-all"
              >
                <FolderPlus className="w-5 h-5" strokeWidth={3} /> Sync Local Folder
              </button>
            </>
          }
        />

        {/* Tabs */}
        <div className="flex gap-6 border-b-4 border-black pb-0 mb-8">
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
              <div className="flex gap-2">
                {selectedIds.size > 1 && (
                  <button 
                    onClick={async () => {
                      if(confirm('Gabungkan klip terpilih ke dalam satu proyek?')) {
                        await mergeClips(Array.from(selectedIds), userId, workspaceId);
                        alert('Proyek berhasil dibuat! Cek tab PROJECTS.');
                        setSelectedIds(new Set());
                      }
                    }}
                    className="bg-[#00E5FF] hover:bg-white text-black border-4 border-black font-black uppercase px-4 py-2 shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] transition-colors"
                  >
                    Merge ({selectedIds.size})
                  </button>
                )}
                <button 
                  onClick={() => handleBulkAction('trash')}
                  className="bg-primary hover:bg-white text-black border-4 border-black font-black uppercase px-4 py-2 shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] transition-colors"
                >
                  Delete ({selectedIds.size})
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" strokeWidth={3} />
              <input 
                type="text" 
                placeholder="Cari video..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-white border-4 border-black font-bold focus:outline-none focus:bg-[#FFEDF4] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors"
              />
            </div>

            {
              [
                { id: 'folder', value: folder, options: ['All Folders', 'Important', 'Drafts'], setter: setFolder },
                { id: 'tag', value: tag, options: ['All Tags', 'Gaming', 'Podcast', 'Vlog', 'Tutorial'], setter: setTag },
                { id: 'duration', value: duration, options: ['All Durations', '< 1 Menit', '1-5 Menit', '> 5 Menit'], setter: setDuration },
                { id: 'owner', value: owner, options: ['All Owners', 'Hanya Saya', 'Tim'], setter: setOwner },
              ].map((filterDef) => (
                <div key={filterDef.id} className="relative">
                  <button 
                    onClick={() => setOpenFilterDropdown(openFilterDropdown === filterDef.id ? null : filterDef.id)}
                    className="flex items-center gap-2 bg-white hover:bg-accent-teal border-4 border-black shadow-neu hover:translate-y-[-2px] hover:translate-x-[-2px] px-4 py-2 text-md font-bold text-black uppercase transition-all"
                  >
                    {filterDef.value} <ChevronDown className="w-5 h-5 text-black" strokeWidth={3} />
                  </button>
                  {openFilterDropdown === filterDef.id && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col font-black uppercase text-sm">
                      {filterDef.options.map((opt, i) => (
                        <button
                          key={opt}
                          onClick={() => {
                            filterDef.setter(opt);
                            setOpenFilterDropdown(null);
                          }}
                          className={`p-3 text-left hover:bg-[#00E5FF] ${i !== filterDef.options.length - 1 ? 'border-b-4 border-black' : ''} ${filterDef.value === opt ? 'bg-secondary' : ''}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSortBy(sortBy === 'Sort: Newest' ? 'Sort: Oldest' : 'Sort: Newest')}
              className="flex items-center gap-2 text-md font-black text-black bg-white border-4 border-black px-4 py-2 shadow-neu uppercase hover:translate-y-[-2px] hover:translate-x-[-2px] transition-all"
            >
              {sortBy} <ChevronDown className="w-5 h-5" strokeWidth={3} />
            </button>
            <div className="flex items-center gap-2 border-4 border-black p-1 bg-secondary shadow-neu">
              <button onClick={() => setViewMode('grid')} className={`p-2 border-2 text-black transition-all ${viewMode === 'grid' ? 'bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-transparent hover:border-black hover:bg-white'}`}><LayoutGrid className="w-5 h-5" strokeWidth={3} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 border-2 text-black transition-all ${viewMode === 'list' ? 'bg-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-transparent border-transparent hover:border-black hover:bg-white'}`}><List className="w-5 h-5" strokeWidth={3} /></button>
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
          <div className={`grid gap-8 items-start ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
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
                              {!item.videoId && (
                                <>
                                  <button onClick={async () => {
                                    try {
                                      alert('Membangunkan AI Whisper. Subtitle sedang dibuat di latar belakang...');
                                      await fetch(`/api/video/process/${item.id}?captions=true&lang=id`, { method: 'POST' });
                                    } catch(e) {
                                      alert('Gagal membuat subtitle');
                                    }
                                  }} className="p-3 text-left hover:bg-[#00E5FF] border-b-4 border-black flex items-center gap-2">
                                    🎙️ Generate Subtitle
                                  </button>
                                  <button onClick={async () => {
                                    try {
                                      alert('Menganalisis naskah. Klip viral sedang dicari di latar belakang...');
                                      await fetch(`/api/video/process/${item.id}?intent=Funny Moments`, { method: 'POST' });
                                    } catch(e) {
                                      alert('Gagal mengekstrak klip');
                                    }
                                  }} className="p-3 text-left hover:bg-primary text-black border-b-4 border-black flex items-center gap-2">
                                    ✂️ Auto-Extract Clips
                                  </button>
                                </>
                              )}
                              <Link href={`/editor?videoId=${item.id}`} className="p-3 text-left hover:bg-accent-blue border-b-4 border-black">
                                Buka di Editor
                              </Link>
                              <Link href={`/subtitles?videoId=${item.id}`} className="p-3 text-left hover:bg-[#D8B4E2] border-b-4 border-black">
                                Buka Subtitle Studio
                              </Link>
                              <button onClick={() => {
                                const newTitle = prompt('Masukkan nama baru:', title);
                                if (newTitle && newTitle !== title) renameMedia(item.videoId ? 'clip' : 'video', item.id, newTitle);
                              }} className="p-3 text-left hover:bg-[#00E5FF] border-b-4 border-black">
                                Ganti Nama
                              </button>
                              <a href={getMediaUrl(item.url) || '#'} download target="_blank" rel="noreferrer" className="p-3 text-left hover:bg-[#FFEDF4] border-b-4 border-black">
                                Unduh MP4
                              </a>
                              <button onClick={() => {
                                navigator.clipboard.writeText(`http://localhost:3344/share/${item.id}`);
                                alert('Tautan publik disalin!');
                              }} className="p-3 text-left hover:bg-accent-teal border-b-4 border-black">
                                Salin Tautan
                              </button>
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
                      <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs font-black uppercase inline-block px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.status === 'FAILED' ? 'bg-warning text-black' : 'bg-white text-black'}`}>
                          {item.status || 'READY'}
                        </div>
                        {item.url && item.status !== 'FAILED' && (
                          <a 
                            href={getMediaUrl(item.url) || '#'}
                            download={`${title}.mp4`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#00E5FF] hover:bg-primary border-2 border-black text-black font-black text-[10px] uppercase px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-none transition-all flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            UNDUH
                          </a>
                        )}
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
