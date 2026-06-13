import { create } from 'zustand';
import { api } from '@/lib/api';

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: number;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';
  progress: number;
  createdAt: string;
  thumbnailUrl?: string; // Using clip thumbnail or generated one
}

interface FetchOptions {
  tab?: string;
  sortBy?: string;
  folder?: string;
  search?: string;
  tag?: string;
  duration?: string;
  userId?: string;
  workspaceId?: string;
  owner?: string;
}

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  isLoading: boolean;
  error: string | null;
  
  // Editor State
  currentTime: number;
  isPlaying: boolean;
  editorClips: any[];
  activeClipId: string | null;
  
  // Actions
  fetchVideos: (options?: FetchOptions) => Promise<void>;
  fetchVideoDetails: (id: string) => Promise<void>;
  uploadVideo: (file: File, options?: any) => Promise<void>;
  exportClip: (clipId: string, subtitleConfig?: any, reframingMode?: string) => Promise<void>;
  renameMedia: (type: string, id: string, newTitle: string) => Promise<void>;
  mergeClips: (clipIds: string[], userId?: string, workspaceId?: string) => Promise<void>;
  setVideos: (videos: Video[]) => void;
  
  // Editor Actions
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setEditorClips: (clips: any[]) => void;
  setActiveClipId: (id: string | null) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videos: [],
  currentVideo: null,
  isLoading: false,
  error: null,
  
  currentTime: 0,
  isPlaying: false,
  editorClips: [],
  activeClipId: null,
  
  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setEditorClips: (clips) => set({ editorClips: clips }),
  setActiveClipId: (id) => set({ activeClipId: id }),
  
  setVideos: (videos) => set({ videos }),

  fetchVideos: async (options) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('userId', options?.userId || '1');
      params.append('workspaceId', options?.workspaceId || 'test-workspace');
      if (options?.tab) params.append('tab', options.tab);
      if (options?.sortBy) params.append('sortBy', options.sortBy);
      if (options?.folder) params.append('folder', options.folder);
      if (options?.search) params.append('search', options.search);
      if (options?.tag) params.append('tag', options.tag);
      if (options?.duration) params.append('duration', options.duration);
      if (options?.owner) params.append('owner', options.owner);

      const response = await api.get(`/video/library?${params.toString()}`);
      
      const data = response.data;
      if (Array.isArray(data)) {
        set({ videos: data, isLoading: false });
      } else if (data.videos && data.clips) {
        set({ videos: [...data.videos, ...data.clips], isLoading: false });
      } else {
        set({ videos: [], isLoading: false });
      }
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch videos', 
        isLoading: false 
      });
    }
  },

  uploadVideo: async (file: File, options: any = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const params = new URLSearchParams();
      params.append('userId', options.userId || '1');
      params.append('workspaceId', options.workspaceId || 'test-workspace');
      if (options.aspect) params.append('aspects', options.aspect);
      if (options.intent) params.append('intent', options.intent);
      if (options.lang) params.append('lang', options.lang);
      if (options.layoutMode) params.append('layoutMode', options.layoutMode);
      if (options.captions !== undefined) params.append('captions', String(options.captions));
      if (options.broll !== undefined) params.append('broll', String(options.broll));
      if (options.timeStart) params.append('timeStart', options.timeStart);
      if (options.timeEnd) params.append('timeEnd', options.timeEnd);
      if (options.subtitleStyle) params.append('subtitleStyle', options.subtitleStyle);
      if (options.topic) params.append('topic', options.topic);
      
      // Upload endpoint
      await api.post(`/video/upload?${params.toString()}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (options.onProgress && progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            options.onProgress(percentCompleted);
          }
        }
      });
      
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to upload video' });
      throw error;
    }
  },

  fetchVideoDetails: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/video/${id}`);
      set({ currentVideo: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch video details', 
        isLoading: false 
      });
      throw error;
    }
  },

  exportClip: async (clipId: string, subtitleConfig: any = {}, reframingMode: string = 'center') => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/video/clip/${clipId}/export`, {
        subtitleConfig,
        reframingMode
      });
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to export clip', 
        isLoading: false 
      });
      throw error;
    }
  },

  renameMedia: async (type: string, id: string, newTitle: string) => {
    try {
      await api.post(`/video/rename/${type}/${id}`, { title: newTitle });
      // Optimistic update
      set((state) => ({
        videos: state.videos.map(v => v.id === id ? { ...v, title: newTitle, name: newTitle } as any : v)
      }));
    } catch (error: any) {
      console.error('Failed to rename media', error);
      throw error;
    }
  },

  mergeClips: async (clipIds: string[], userId?: string, workspaceId?: string) => {
    try {
      await api.post(`/video/merge?userId=${userId || '1'}&workspaceId=${workspaceId || 'test-workspace'}`, { clipIds });
    } catch (error: any) {
      console.error('Failed to merge clips', error);
      throw error;
    }
  }
}));
