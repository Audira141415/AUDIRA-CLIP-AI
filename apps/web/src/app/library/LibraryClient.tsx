"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteVideo, renameVideo, bulkDeleteVideos, updateVideoTags, retryVideoProcessing } from "../actions/video";

export default function LibraryClient({ initialVideos }: { initialVideos: any[] }) {
  const router = useRouter();
  
  // Filters & Views
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  const [sortBy, setSortBy] = useState('NEWEST'); // 'NEWEST', 'OLDEST', 'TITLE', 'DURATION', 'CLIPS'
  
  // Auto-polling for processing videos
  const hasProcessingVideos = initialVideos.some(v => v.status === 'PROCESSING' || v.status === 'PENDING');
  useEffect(() => {
    if (!hasProcessingVideos) return;
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [hasProcessingVideos, router]);

  // Management State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Actions
  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.size} videos?`)) {
      setIsProcessing(true);
      await bulkDeleteVideos(Array.from(selectedIds));
      setSelectedIds(new Set());
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this video?")) {
      setIsProcessing(true);
      await deleteVideo(id);
      setIsProcessing(false);
    }
  };

  const handleRetry = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    await retryVideoProcessing(id);
    setIsProcessing(false);
  };

  const startEdit = (video: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(video.id);
    setEditTitle(video.title);
  };

  const saveEdit = async (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    if (e.type === 'submit') e.preventDefault();
    if (editTitle.trim()) {
      setIsProcessing(true);
      await renameVideo(id, editTitle.trim());
      setIsProcessing(false);
    }
    setEditingId(null);
  };

  const addTag = async (id: string, currentTags: string[], newTag: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim() || currentTags.includes(newTag.trim())) return;
    setIsProcessing(true);
    await updateVideoTags(id, [...currentTags, newTag.trim()]);
    setIsProcessing(false);
  };

  const removeTag = async (id: string, currentTags: string[], tagToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    await updateVideoTags(id, currentTags.filter(t => t !== tagToRemove));
    setIsProcessing(false);
  };

  // Derived Data
  const filteredVideos = initialVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (video.tags || []).some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" ? true : video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const now = new Date();
  const getGroup = (dateString: Date) => {
    const d = new Date(dateString);
    const diffTime = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0 || d.toDateString() === now.toDateString()) return "Today";
    if (diffDays <= 7) return "Last 7 Days";
    return "Older";
  };

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'OLDEST': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'TITLE': return a.title.localeCompare(b.title);
      case 'DURATION': return b.duration - a.duration;
      case 'CLIPS': return (b.clips?.length || 0) - (a.clips?.length || 0);
      case 'NEWEST':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  let groupedVideos: any = {};
  if (sortBy === 'NEWEST' || sortBy === 'OLDEST') {
    groupedVideos = sortedVideos.reduce((acc: any, video: any) => {
      const group = getGroup(video.createdAt);
      if (!acc[group]) acc[group] = [];
      acc[group].push(video);
      return acc;
    }, {});
  } else {
    groupedVideos = { 'All Videos': sortedVideos };
  }

  const groupOrder = sortBy === 'OLDEST' 
    ? ['Older', 'Last 7 Days', 'Today'] 
    : ['Today', 'Last 7 Days', 'Older', 'All Videos'];

  const totalClips = initialVideos.reduce((acc, v) => acc + (v.clips?.length || 0), 0);
  const readyVideos = initialVideos.filter(v => v.status === 'READY').length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="bg-white border-4 border-black p-6 shadow-neu mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter mb-2">Video Library</h2>
            <p className="text-sm md:text-base font-bold text-gray-700 uppercase bg-primary/20 inline-block px-2 py-1 border-2 border-black">
              Manage your imported videos and AI clips
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#F4F4F0] border-2 border-black px-4 py-2 flex flex-col items-center">
              <span className="text-2xl font-black text-black">{readyVideos}</span>
              <span className="text-[10px] font-black uppercase">Ready</span>
            </div>
            <div className="bg-accent-teal border-2 border-black px-4 py-2 flex flex-col items-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-2xl font-black text-white">{totalClips}</span>
              <span className="text-[10px] font-black uppercase text-black">Total Clips</span>
            </div>
            <Link href="/upload" className="bg-primary text-black text-sm md:text-base font-black uppercase px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="square" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              Upload New
            </Link>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 text-9xl opacity-5 pointer-events-none font-black select-none">
          LIBRARY
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#F4F4F0] border-4 border-black p-4 shadow-neu">
        <div className="flex-1 w-full relative">
          <input 
            type="text" 
            placeholder="SEARCH VIDEOS OR TAGS..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-black px-4 py-3 text-sm font-black uppercase placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.1)]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black font-black"
            >×</button>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <select 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
            className="text-xs font-black uppercase px-2 py-3 border-2 border-black bg-white focus:outline-none"
          >
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="TITLE">Name (A-Z)</option>
            <option value="DURATION">Duration</option>
            <option value="CLIPS">Most Clips</option>
          </select>
          <div className="h-full w-0.5 bg-black mx-1 hidden md:block"></div>
          {['ALL', 'READY', 'PROCESSING', 'PENDING', 'FAILED'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs font-black uppercase px-4 py-3 border-2 border-black transition-all ${statusFilter === status ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
            >
              {status}
            </button>
          ))}
          <div className="h-full w-0.5 bg-black mx-2 hidden md:block"></div>
          <button onClick={() => setViewMode('GRID')} className={`p-3 border-2 border-black transition-all ${viewMode === 'GRID' ? 'bg-black text-white' : 'bg-white text-black'}`}>🔲</button>
          <button onClick={() => setViewMode('LIST')} className={`p-3 border-2 border-black transition-all ${viewMode === 'LIST' ? 'bg-black text-white' : 'bg-white text-black'}`}>📄</button>
        </div>
      </div>

      {/* Grid/List */}
      {filteredVideos.length === 0 ? (
        <div className="bg-white border-4 border-black p-12 text-center shadow-neu">
          <span className="text-6xl mb-4 block">📭</span>
          <h3 className="text-2xl font-black uppercase mb-2">No videos found</h3>
          <p className="font-bold text-gray-500 uppercase">Try adjusting your filters or upload a new video.</p>
        </div>
      ) : (
        groupOrder.map(groupName => {
          const groupVideos = groupedVideos[groupName];
          if (!groupVideos || groupVideos.length === 0) return null;

          return (
            <div key={groupName} className="mb-10">
              <h3 className="text-xl font-black uppercase border-b-4 border-black inline-block pr-8 mb-6">{groupName}</h3>
              <div className={viewMode === 'GRID' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
                {groupVideos.map((video: any) => {
                  const hasClips = video.clips && video.clips.length > 0;
                  const firstClipThumb = hasClips ? video.clips[0].thumbnailUrl : null;
                  const displayThumb = firstClipThumb?.startsWith('local://') 
                    ? firstClipThumb.replace('local://', 'http://localhost:3001/') 
                    : firstClipThumb;
                  
                  const isSelected = selectedIds.has(video.id);

                  // Preview logic
                  const videoPlayUrl = video.url?.startsWith('local://') 
                    ? video.url.replace('local://', 'http://localhost:3001/') 
                    : (video.url && video.url !== 'pending' ? video.url : null);

                  return viewMode === 'GRID' ? (
                    <div 
                      key={video.id} 
                      onClick={() => !editingId && router.push(`/clipper/${video.id}`)}
                      className={`group bg-white border-4 border-black flex flex-col shadow-neu transition-all relative ${editingId === video.id ? 'cursor-default' : 'cursor-pointer hover:shadow-none hover:translate-y-[4px] hover:translate-x-[4px]'} ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => {}}
                        onClick={(e) => toggleSelection(video.id, e)}
                        className="absolute top-3 left-3 z-30 w-5 h-5 accent-primary border-2 border-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      />
                      
                      <div className={`absolute -top-3 -right-3 px-3 py-1 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10 ${video.status === 'READY' ? 'bg-accent-teal text-white' : video.status === 'PROCESSING' ? 'bg-yellow-400 text-black animate-pulse' : video.status === 'FAILED' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}>
                        {video.status}
                      </div>

                      <div className="w-full aspect-video bg-[#13131A] border-b-4 border-black relative overflow-hidden flex items-center justify-center">
                        {/* Progress Overlay */}
                        {(video.status === 'PROCESSING' || video.status === 'PENDING') && (
                          <div className="absolute inset-0 z-40 bg-black/85 flex flex-col items-center justify-center p-4">
                            <div className="w-full bg-gray-700 h-2 mb-2 border border-black overflow-hidden">
                              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${video.progress || 0}%` }}></div>
                            </div>
                            <span className="text-primary font-black text-[10px] uppercase text-center px-2">
                              {video.progress || 0}% - {video.statusMessage || 'Processing...'}
                            </span>
                          </div>
                        )}

                        {/* Hover Preview */}
                        {displayThumb ? (
                          <>
                            <img src={displayThumb} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 z-10" />
                            {videoPlayUrl && (
                              <video src={videoPlayUrl} muted autoPlay loop playsInline className="w-full h-full object-cover opacity-0 group-hover:opacity-80 transition-opacity duration-300 absolute inset-0 z-0" />
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <span className="text-5xl group-hover:scale-125 transition-transform duration-300">🎬</span>
                          </div>
                        )}
                        
                        {video.duration > 0 && (
                          <div className="absolute bottom-2 left-2 bg-black border-2 border-primary px-1.5 py-0.5 text-[10px] font-black text-primary z-20">
                            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                          </div>
                        )}

                        {/* Actions Overlay */}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                          {(video.status === 'FAILED' || video.status === 'PROCESSING') && (
                            <button onClick={(e) => handleRetry(video.id, e)} className="bg-white border-2 border-black p-1 hover:bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Retry Processing">🔄</button>
                          )}
                          <button onClick={(e) => startEdit(video, e)} className="bg-white border-2 border-black p-1 hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Rename">✏️</button>
                          <button onClick={(e) => handleDelete(video.id, e)} disabled={isProcessing} className="bg-white border-2 border-black p-1 hover:bg-red-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">🗑️</button>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between bg-[#F4F4F0]">
                        <div>
                          {editingId === video.id ? (
                            <form onSubmit={(e) => saveEdit(video.id, e)} className="flex gap-2 mb-2">
                              <input autoFocus value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onClick={(e) => e.stopPropagation()} className="flex-1 border-2 border-black px-2 py-1 text-sm font-black focus:outline-none uppercase" />
                              <button type="submit" onClick={(e) => saveEdit(video.id, e)} className="bg-black text-white px-2 py-1 font-black text-xs">OK</button>
                            </form>
                          ) : (
                            <h3 className="font-black text-lg uppercase leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">{video.title}</h3>
                          )}
                          
                          {/* Tags Area */}
                          <div className="flex flex-wrap gap-1 mb-3" onClick={(e) => e.stopPropagation()}>
                            {(video.tags || []).map((tag: string) => (
                              <span key={tag} className="bg-primary/20 border border-primary text-primary text-[10px] font-black uppercase px-1.5 py-0.5 flex items-center gap-1">
                                {tag} <button onClick={(e) => removeTag(video.id, video.tags || [], tag, e)} className="hover:text-black">×</button>
                              </span>
                            ))}
                            <form onSubmit={(e) => {
                              const input = e.currentTarget.elements.namedItem('newtag') as HTMLInputElement;
                              addTag(video.id, video.tags || [], input.value, e);
                              input.value = '';
                            }}>
                              <input name="newtag" placeholder="+ TAG" className="bg-transparent border border-gray-400 text-[10px] font-black uppercase px-1.5 py-0.5 w-16 focus:outline-none focus:border-black" />
                            </form>
                          </div>
                        </div>

                        <div className="flex justify-between items-end border-t-2 border-black pt-3 mt-2">
                          <div className="bg-black text-white text-[10px] font-black px-2 py-1 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                            {video.clips?.length || 0} CLIPS
                          </div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase">{new Date(video.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // LIST VIEW
                    <div 
                      key={video.id} 
                      onClick={() => !editingId && router.push(`/clipper/${video.id}`)}
                      className={`group bg-white border-2 border-black flex items-center p-2 shadow-sm hover:shadow-neu transition-all cursor-pointer ${isSelected ? 'bg-primary/10' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => {}}
                        onClick={(e) => toggleSelection(video.id, e)}
                        className="mx-3 w-4 h-4 accent-primary border-2 border-black cursor-pointer"
                      />
                      
                      <div className="w-24 aspect-video bg-[#13131A] border-2 border-black overflow-hidden flex-shrink-0 relative">
                        {displayThumb ? <img src={displayThumb} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xl">🎬</div>}
                        {videoPlayUrl && <video src={videoPlayUrl} muted autoPlay loop playsInline className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 z-10" />}
                      </div>

                      <div className="flex-1 px-4 min-w-0 flex flex-col justify-center">
                        {editingId === video.id ? (
                           <form onSubmit={(e) => saveEdit(video.id, e)} className="flex gap-2">
                              <input autoFocus value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onClick={(e) => e.stopPropagation()} className="border-2 border-black px-2 py-1 text-sm font-black focus:outline-none uppercase w-full max-w-sm" />
                              <button type="submit" onClick={(e) => saveEdit(video.id, e)} className="bg-black text-white px-2 py-1 font-black text-xs">OK</button>
                           </form>
                        ) : (
                          <h3 className="font-black text-sm uppercase truncate group-hover:text-primary">{video.title}</h3>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-1.5 py-0.5 border border-black font-black text-[8px] uppercase ${video.status === 'READY' ? 'bg-accent-teal text-white' : video.status === 'FAILED' ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}>{video.status}</span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">{video.duration > 0 ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : ''}</span>
                        </div>
                        {(video.status === 'PROCESSING' || video.status === 'PENDING') && (
                          <div className="w-full max-w-sm mt-1">
                            <div className="w-full bg-gray-200 h-1 overflow-hidden border border-black">
                              <div className="bg-primary h-full transition-all duration-500" style={{ width: `${video.progress || 0}%` }}></div>
                            </div>
                            <p className="text-[8px] text-gray-500 truncate mt-0.5">{video.progress || 0}% - {video.statusMessage}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 px-4 w-48" onClick={e => e.stopPropagation()}>
                        {(video.tags || []).map((tag: string) => (
                           <span key={tag} className="bg-primary/20 border border-primary text-primary text-[8px] font-black uppercase px-1 py-0.5 flex items-center gap-1">
                             {tag} <button onClick={(e) => removeTag(video.id, video.tags || [], tag, e)}>×</button>
                           </span>
                        ))}
                        <form onSubmit={(e) => {
                          const input = e.currentTarget.elements.namedItem('newtag') as HTMLInputElement;
                          addTag(video.id, video.tags || [], input.value, e);
                          input.value = '';
                        }}>
                          <input name="newtag" placeholder="+ TAG" className="bg-transparent border border-gray-400 text-[8px] font-black uppercase px-1 py-0.5 w-12 focus:outline-none" />
                        </form>
                      </div>

                      <div className="px-4 text-[10px] font-black w-24 text-center border-l-2 border-black">
                        {video.clips?.length || 0} CLIPS
                      </div>
                      
                      <div className="flex gap-1 pr-2 opacity-0 group-hover:opacity-100">
                        {(video.status === 'FAILED' || video.status === 'PROCESSING') && (
                          <button onClick={(e) => handleRetry(video.id, e)} className="bg-white border-2 border-black p-1 hover:bg-green-400">🔄</button>
                        )}
                        <button onClick={(e) => startEdit(video, e)} className="bg-white border-2 border-black p-1 hover:bg-yellow-400">✏️</button>
                        <button onClick={(e) => handleDelete(video.id, e)} className="bg-white border-2 border-black p-1 hover:bg-red-400">🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black border-4 border-primary p-4 shadow-[8px_8px_0px_0px_rgba(139,92,246,1)] flex items-center gap-6 z-50">
          <span className="text-white font-black uppercase">{selectedIds.size} Selected</span>
          <div className="flex gap-2">
            <button onClick={() => setSelectedIds(new Set())} className="bg-white text-black font-black uppercase px-4 py-2 border-2 border-black hover:bg-gray-200">Cancel</button>
            <button onClick={handleBulkDelete} disabled={isProcessing} className="bg-red-500 text-white font-black uppercase px-4 py-2 border-2 border-white hover:bg-red-600 disabled:opacity-50">🗑️ Delete All</button>
          </div>
        </div>
      )}
    </div>
  );
}
