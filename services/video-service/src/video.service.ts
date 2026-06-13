import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { prisma } from '@audira/database';
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as ffprobeInstaller from '@ffprobe-installer/ffprobe';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as util from 'util';
const execPromise = util.promisify(exec);

import { AITracker } from './ai-tracker';
import { SubtitleGenerator } from './subtitle-generator';
import { OllamaService } from './ollama.service';
import { TranscriptionService } from './transcription.service';
import { HeatmapService } from './heatmap.service';
import { BRollService } from './broll.service';

const ffmpeg = require('fluent-ffmpeg');
const youtubedl = require('youtube-dl-exec');

// Set ffmpeg paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  // Layer 2: The Bottleneck Queue (FFmpeg Concurrency Lock)
  private ffmpegQueue: Promise<any> = Promise.resolve();

  private async enqueueFfmpegTask<T>(taskName: string, task: () => Promise<T>): Promise<T> {
    this.logger.log(`Queueing FFmpeg Task: ${taskName}`);
    return new Promise((resolve, reject) => {
      this.ffmpegQueue = this.ffmpegQueue.then(async () => {
        this.logger.log(`Starting FFmpeg Task: ${taskName}`);
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }).catch(async () => {
        // Prevent queue from permanently breaking if a previous task failed
        this.logger.log(`Starting FFmpeg Task (after previous failure): ${taskName}`);
        try {
          const result = await task();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      });
    });
  }

  constructor(
    private readonly ollamaService: OllamaService,
    private readonly transcriptionService: TranscriptionService,
    private readonly heatmapService: HeatmapService,
    @Inject('GATEWAY_SERVICE') private readonly gatewayClient: ClientProxy
  ) {}

  async getDashboardStats(userId: string, workspaceId: string) {
    const [totalVideos, totalClips] = await Promise.all([
      prisma.video.count({ where: { userId, workspaceId } }),
      prisma.clip.count({ where: { video: { userId, workspaceId } } }),
    ]);

    return {
      totalVideos,
      totalClips,
      totalExports: 0, // Placeholder
      storageUsed: "256 MB", // Placeholder
      aiUsage: "12%", // Placeholder
      teamMembers: 1, // Placeholder
    };
  }

  async getLibrary(userId: string, workspaceId: string, query?: any) {
    const { tab, sortBy, folder, search, tag, duration, owner } = query || {};
    
    const videoWhere: any = { workspaceId, isDeleted: false };
    const clipWhere: any = { video: { workspaceId }, isDeleted: false };
    const projectWhere: any = { workspaceId };

    if (owner === 'Hanya Saya') {
      videoWhere.userId = userId;
      clipWhere.video.userId = userId;
      projectWhere.userId = userId;
    }

    if (folder && folder !== 'All Folders') {
      videoWhere.folder = folder;
      clipWhere.folder = folder;
    }

    if (tag && tag !== 'All Tags') {
      videoWhere.tags = { has: tag };
      // clips don't have tags array, they have hashtags string
      clipWhere.hashtags = { contains: tag, mode: 'insensitive' };
    }

    if (duration && duration !== 'All Durations') {
      if (duration === '< 1 Menit') {
        videoWhere.duration = { lt: 60 };
        clipWhere.duration = { lt: 60 };
      } else if (duration === '1-5 Menit') {
        videoWhere.duration = { gte: 60, lte: 300 };
        clipWhere.duration = { gte: 60, lte: 300 };
      } else if (duration === '> 5 Menit') {
        videoWhere.duration = { gt: 300 };
        clipWhere.duration = { gt: 300 };
      }
    }

    if (search) {
      videoWhere.title = { contains: search, mode: 'insensitive' };
      clipWhere.title = { contains: search, mode: 'insensitive' };
      projectWhere.name = { contains: search, mode: 'insensitive' };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'Sort: Oldest') orderBy = { createdAt: 'asc' };
    if (sortBy === 'Sort: Duration') orderBy = { duration: 'desc' };

    if (tab === 'CLIPS') {
      return prisma.clip.findMany({ where: clipWhere, orderBy, include: { video: true } });
    } else if (tab === 'PROJECTS') {
      return prisma.project.findMany({ where: projectWhere, orderBy });
    } else if (tab === 'FAVORITES') {
      const videos = await prisma.video.findMany({ where: { ...videoWhere, isFavorite: true }, orderBy, include: { _count: { select: { clips: true } } } });
      const clips = await prisma.clip.findMany({ where: { ...clipWhere, isFavorite: true }, orderBy, include: { video: true } });
      return { videos, clips };
    } else if (tab === 'TRASH') {
      const videos = await prisma.video.findMany({ where: { workspaceId, isDeleted: true }, orderBy, include: { _count: { select: { clips: true } } } });
      const clips = await prisma.clip.findMany({ where: { video: { workspaceId }, isDeleted: true }, orderBy, include: { video: true } });
      return { videos, clips };
    } else {
      return prisma.video.findMany({ where: videoWhere, orderBy, include: { _count: { select: { clips: true } } } });
    }
  }

  async toggleFavorite(type: string, id: string) {
    if (type === 'video') {
      const v = await prisma.video.findUnique({where: {id}});
      return prisma.video.update({ where: { id }, data: { isFavorite: !v?.isFavorite } });
    } else if (type === 'clip') {
      const c = await prisma.clip.findUnique({where: {id}});
      return prisma.clip.update({ where: { id }, data: { isFavorite: !c?.isFavorite } });
    }
  }

  async moveToTrash(type: string, id: string) {
    if (type === 'video') {
      return prisma.video.update({ where: { id }, data: { isDeleted: true } });
    } else if (type === 'clip') {
      return prisma.clip.update({ where: { id }, data: { isDeleted: true } });
    }
  }

  async restoreFromTrash(type: string, id: string) {
    if (type === 'video') {
      return prisma.video.update({ where: { id }, data: { isDeleted: false } });
    } else if (type === 'clip') {
      return prisma.clip.update({ where: { id }, data: { isDeleted: false } });
    }
  }

  async deletePermanently(type: string, id: string) {
    try {
      if (type === 'video') {
        return await prisma.video.delete({ where: { id } });
      } else if (type === 'clip') {
        return await prisma.clip.delete({ where: { id } });
      }
    } catch (e) {
      this.logger.warn(`Record already deleted or not found: ${id}`);
    }
  }

  async renameMedia(type: string, id: string, newTitle: string) {
    if (type === 'video') {
      return prisma.video.update({ where: { id }, data: { title: newTitle } });
    } else if (type === 'clip') {
      return prisma.clip.update({ where: { id }, data: { title: newTitle } });
    } else if (type === 'project') {
      return prisma.project.update({ where: { id }, data: { name: newTitle } });
    }
  }

  async mergeClips(clipIds: string[], userId: string, workspaceId: string) {
    const project = await prisma.project.create({
      data: {
        name: `Merged Project (${clipIds.length} clips)`,
        userId,
        workspaceId,
        clips: {
          create: clipIds.map((clipId, index) => ({
            clipId,
            order: index
          }))
        }
      }
    });
    return project;
  }

  async createVideoRecord(data: { title: string; url: string; userId: string; workspaceId: string }) {
    // Gracefully handle missing User or Workspace to prevent P2003 Foreign Key Constraint error
    let user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        user = await prisma.user.create({
          data: { id: data.userId, email: `dummy${Date.now()}@example.com`, name: 'Dummy User' }
        });
      } else {
        data.userId = user.id;
      }
    }

    let workspace = await prisma.workspace.findUnique({ where: { id: data.workspaceId } });
    if (!workspace) {
      workspace = await prisma.workspace.findFirst();
      if (!workspace) {
        workspace = await prisma.workspace.create({
          data: { id: data.workspaceId, name: 'My Workspace', ownerId: data.userId }
        });
      } else {
        data.workspaceId = workspace.id;
      }
    }

    return prisma.video.create({
      data: {
        title: data.title,
        url: data.url,
        duration: 0, // Default for now
        status: 'PENDING',
        userId: data.userId,
        workspaceId: data.workspaceId,
      }
    });
  }

  async getVideoDetails(videoId: string) {
    return prisma.video.findUnique({
      where: { id: videoId },
      include: { clips: true }
    });
  }

  async importFromUrl(url: string, userId: string, workspaceId: string, requestedAspects?: string[], options?: any) {
    this.logger.log(`Starting download from URL: ${url}`);
    
    // Create or use existing temporary video record
    let videoRecord: any;
    if (options?.preCreatedId) {
      videoRecord = await prisma.video.findUnique({ where: { id: options.preCreatedId } });
    }
    
    if (!videoRecord) {
      videoRecord = await this.createVideoRecord({
        title: "Downloading...",
        url: "pending",
        userId,
        workspaceId
      });
    }

    // Start in background to return quickly
    (async () => {
      try {
        await this.updateProgress(videoRecord.id, 10, "Mengunduh video dari YouTube...", "PROCESSING");
        
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filename = `import-${Date.now()}-${Math.round(Math.random() * 1E9)}.mp4`;
        const outputPath = path.join(uploadDir, filename);

        // Determine format string based on quality
        let ytdlFormat = 'bestvideo[vcodec^=avc]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
        if (options?.quality === '1080p') {
          ytdlFormat = 'bestvideo[vcodec^=avc][height<=1080]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
        } else if (options?.quality === '720p') {
          ytdlFormat = 'bestvideo[vcodec^=avc][height<=720]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
        } else if (options?.quality === '480p') {
          ytdlFormat = 'bestvideo[vcodec^=avc][height<=480]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
        }

        // --- PROXY ROTATION ---
        const proxies = process.env.YOUTUBE_PROXIES ? process.env.YOUTUBE_PROXIES.split(',') : [];
        const selectedProxy = proxies.length > 0 ? proxies[Math.floor(Math.random() * proxies.length)].trim() : null;

        // --- COOKIE ROTATION ---
        let selectedCookiePath = null;
        const cookiesDir = path.join(process.cwd(), 'cookies');
        
        if (fs.existsSync(cookiesDir)) {
          const cookieFiles = fs.readdirSync(cookiesDir).filter((f: string) => f.endsWith('.txt'));
          if (cookieFiles.length > 0) {
            const randomFile = cookieFiles[Math.floor(Math.random() * cookieFiles.length)];
            selectedCookiePath = path.join(cookiesDir, randomFile);
          }
        }
        
        // Fallback to root cookies.txt if folder empty/missing
        if (!selectedCookiePath && fs.existsSync(path.join(process.cwd(), 'cookies.txt'))) {
          selectedCookiePath = path.join(process.cwd(), 'cookies.txt');
        }

        // Download the video as true MP4 and explicitly merge to MP4 format
        const ytdlOptions: any = {
          output: outputPath,
          format: ytdlFormat,
          mergeOutputFormat: 'mp4',
          ffmpegLocation: ffmpegInstaller.path,
          noCheckCertificates: true,
          noWarnings: true,
          fileAccessRetries: 10,
          // --- METADATA/SUBTITLE EXTRACTION ---
          writeAutoSubs: true,
          writeSubs: true,
          subLang: 'id,en',
          subFormat: 'vtt'
        };

        if (selectedProxy) {
          ytdlOptions.proxy = selectedProxy;
          this.logger.log(`Using proxy: ${selectedProxy}`);
        }
        if (selectedCookiePath) {
          ytdlOptions.cookies = selectedCookiePath;
          this.logger.log(`Using cookies from: ${selectedCookiePath}`);
        }

        if (options?.timeStart && options?.timeEnd) {
          ytdlOptions.downloadSections = `*${options.timeStart}-${options.timeEnd}`;
        }

        // Wrap youtube-dl (which uses ffmpeg to merge) in the queue
        await this.enqueueFfmpegTask(`Download & Merge YouTube URL: ${url}`, async () => {
          await youtubedl(url, ytdlOptions);
        });
        
        this.logger.log(`Download complete! Saved to ${outputPath}`);
        
        // Verify file exists
        if (!fs.existsSync(outputPath)) {
          throw new Error("Download completed but file not found");
        }

        // Try to get title
        let title = "Imported Video";
        try {
          const videoInfo = await youtubedl(url, { dumpSingleJson: true, noWarnings: true, noCheckCertificates: true });
          const parsedInfo = typeof videoInfo === 'string' ? JSON.parse(videoInfo) : videoInfo;
          if (parsedInfo && parsedInfo.title) {
            title = parsedInfo.title;
          }
        } catch (e) {
          this.logger.warn(`Could not fetch title for ${url}`);
        }

        await prisma.video.update({
          where: { id: videoRecord.id },
          data: { 
            title: title,
            url: `local://uploads/${filename}`
          }
        });

        this.logger.log(`Download complete: ${title}`);
        await this.updateProgress(videoRecord.id, 20, "Unduhan Selesai. Menyiapkan Pemrosesan...", "PROCESSING");
        
        // Start processing
        this.processVideo(videoRecord.id, requestedAspects, options);

      } catch (error: any) {
        this.logger.error(`Failed to download from URL: ${url}`, error);
        await this.updateProgress(videoRecord.id, 100, `Download Failed: ${error.message}`, "FAILED");
      }
    })();

    return videoRecord;
  }

  async updateProgress(id: string, progress: number, statusMessage: string, status?: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED') {
    try {
      const data: any = { progress, statusMessage };
      if (status) data.status = status;
      await prisma.video.update({ where: { id }, data });
      this.logger.debug(`Video ${id} progress: ${progress}% - ${statusMessage}`);
      
      this.gatewayClient.emit({ cmd: 'job_progress' }, {
        videoId: id,
        progress,
        statusMessage,
        status: status || 'PROCESSING'
      });
    } catch (e) {
      // Ignore errors if db locked
    }
  }

  async processVideo(videoId: string, requestedAspects?: string[], options?: any) {
    this.logger.log(`Starting FFmpeg processing for video: ${videoId}`);
    
    try {
      const video = await prisma.video.findUnique({ where: { id: videoId } });
      if (!video) throw new Error("Video not found");

      // Resolve path
      let relativePath = video.url;
      if (relativePath.startsWith('http://localhost:3345/')) {
        relativePath = relativePath.replace('http://localhost:3345/', '');
      } else if (relativePath.startsWith('local://')) {
        relativePath = relativePath.replace('local://', '');
      }
      const absoluteInputPath = path.join(process.cwd(), relativePath);

      if (!fs.existsSync(absoluteInputPath)) {
        throw new Error(`File not found: ${absoluteInputPath}`);
      }

      await prisma.video.update({ where: { id: videoId }, data: { status: 'PROCESSING' } });
      await this.updateProgress(videoId, 25, "Menyiapkan ekstraksi audio...", "PROCESSING");

      // 1. Get duration using ffprobe
      const duration = await new Promise<number>((resolve, reject) => {
        ffmpeg.ffprobe(absoluteInputPath, (err: any, metadata: any) => {
          if (err) return reject(err);
          resolve(metadata.format.duration || 0);
        });
      });

      await prisma.video.update({ where: { id: videoId }, data: { duration: Math.round(duration) } });
      this.logger.log(`Video duration: ${duration}s`);

      // 2. Transcribe the video (Real Local Whisper AI - Using large-v3)
      this.logger.log(`Transcribing video using Whisper...`);
      await this.updateProgress(videoId, 30, "Mendengarkan Audio (Transkripsi Whisper)...");
      let transcript = await this.transcriptionService.transcribeReal(absoluteInputPath, async (sec) => {
        const pct = Math.min(30 + Math.floor((sec / duration) * 10), 40);
        await this.updateProgress(videoId, pct, `Mendengarkan Audio... (${Math.round(sec)}/${Math.round(duration)} detik)`);
      }, options?.lang);

      // (Layer 16 dinonaktifkan karena Whisper large-v3 sudah sangat akurat)
      // transcript = await this.ollamaService.proofreadTranscript(transcript);

      // 2.5 The Architect: Semantic Video Chapter Mapping
      this.logger.log(`Executing Layer 0: The Architect...`);
      await this.updateProgress(videoId, 40, "Memetakan Struktur Video (Layer 0)...");
      const chapters = await this.ollamaService.mapVideoChapters(transcript, duration);
      this.logger.log(`Chapters Mapped: ${JSON.stringify(chapters)}`);

      // 3. Try Heatmap first, fallback to AI
      let aiClips: any[] = [];
      const ytVideoId = this.heatmapService.extractVideoId(video.url) || this.heatmapService.extractVideoId(options?.url || '');
      
      if (ytVideoId) {
        this.logger.log(`YouTube video detected (${ytVideoId}), trying to fetch heatmap data...`);
        await this.updateProgress(videoId, 50, "Mengekstrak Data Heatmap YouTube...");
        const heatmapSegments = await this.heatmapService.getMostReplayed(ytVideoId);
        
        if (heatmapSegments.length > 0) {
          this.logger.log(`Successfully fetched ${heatmapSegments.length} heatmap segments!`);
          aiClips = heatmapSegments.map((seg, i) => ({
            title: `Viral Heatmap Clip ${i+1}`,
            start: seg.start,
            end: seg.start + seg.duration,
            score: seg.score * 100 // Convert to 0-100 scale
          }));
        } else {
          this.logger.log(`No heatmap data found, falling back to DeepSeek AI analysis...`);
        }
      }

      if (aiClips.length === 0) {
        this.logger.log(`Analyzing transcript with AI...`);
        await this.updateProgress(videoId, 60, "DeepSeek Menganalisis Momen Viral...");
        aiClips = await this.ollamaService.analyzeTranscriptForClips(transcript, options?.intent, duration, chapters);
      }

      // Map AI returned clips to our required format (With Padding)
      const PADDING = 10;
      
      const clipsToGenerate = aiClips.map((clip, index) => {
        // Apply padding
        let clipStart = Math.max(0, (clip.start || 0) - PADDING);
        let originalEnd = clip.end || (clipStart + 15);
        let clipEnd = Math.min(duration, originalEnd + PADDING);
        const clipDuration = clipEnd - clipStart;

        const targetAspect = (requestedAspects && requestedAspects.length > 0) ? requestedAspects[0] : "9:16";

        return {
          title: clip.title || `Viral Clip ${index + 1}`,
          score: clip.score || (95 - index * 5),
          reason: clip.reason,
          socialCaption: clip.socialCaption,
          hashtags: clip.hashtags,
          wpm: clip.wpm,
          pacing: clip.pacing,
          brollKeyword: clip.brollKeyword,
          vibe: clip.vibe,
          hookStrength: clip.hookStrength,
          retentionRisk: clip.retentionRisk,
          targetDemographic: clip.targetDemographic,
          bgmSuggestion: clip.bgmSuggestion,
          alternativeTitle: clip.alternativeTitle,
          brandSafety: clip.brandSafety,
          ctaOverlay: clip.ctaOverlay,
          startTime: clipStart,
          duration: clipDuration > 0 ? clipDuration : 15,
          aspectRatio: targetAspect,
          platform: targetAspect === '16:9' ? 'YouTube' : (targetAspect === '1:1' ? 'Instagram' : 'TikTok/Reels'),
          brollEnabled: options?.broll === 'true'
        };
      });

      this.logger.log(`DeepSeek generated ${clipsToGenerate.length} smart clips!`);
      await this.updateProgress(videoId, 80, `Menjahit ${clipsToGenerate.length} Klip & Membakar Subtitle...`);

      // 4. Process clips sequentially
      for (let i = 0; i < clipsToGenerate.length; i++) {
        await this.updateProgress(videoId, 80 + Math.floor((i / clipsToGenerate.length) * 15), `Mengekspor Klip ${i + 1} dari ${clipsToGenerate.length}...`);
        const clipDef = clipsToGenerate[i];
        const clipFilename = `clip-${videoId}-${i}.mp4`;
        const clipThumbnail = `thumb-${videoId}-${i}.jpg`;
        const absoluteClipPath = path.join(process.cwd(), 'uploads', clipFilename);
        
        this.logger.log(`Extracting clip ${i + 1} (${clipDef.aspectRatio}): ${clipDef.startTime}s to ${clipDef.startTime + clipDef.duration}s`);

        // --- LOCAL AUDIO TRANSCRIPTION FALLBACK ---
        let clipTranscript = transcript;
        
        // If transcript is mock/dummy text, extract the audio of THIS clip and transcribe it locally
        if (transcript.length === 0 || transcript[0].text === "Tahukah Anda" || transcript[0].text === " ") {
            this.logger.log(`Using Local Python Transcriber Fallback for clip ${i + 1}...`);
            try {
                const tempWavPath = path.join(process.cwd(), 'uploads', `temp_audio_${Date.now()}.wav`);
                
                this.logger.log(`Extracting audio for on-the-fly transcription to ${tempWavPath}...`);
                await new Promise((res, rej) => {
                    ffmpeg(absoluteInputPath)
                      .setStartTime(clipDef.startTime)
                      .setDuration(clipDef.duration)
                      .outputOptions(['-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1'])
                      .output(tempWavPath)
                      .on('end', () => res(null))
                      .on('error', (err: any) => rej(err))
                      .run();
                });
                
                // 2. Transcribe using FastAPI Engine
                const fastApiUrl = `http://localhost:8000/api/transcribe`;
                const rawLang = options?.lang || 'id-ID';
                const lang = rawLang.split('-')[0].toLowerCase();
                
                this.logger.log(`Executing Audio AI Engine via FastAPI: POST ${fastApiUrl}`);
                const response = await fetch(fastApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ audio_path: tempWavPath, language: lang })
                });
                const result = await response.json();
                
                if (result.success && result.segments && result.segments.length > 0) {
                    this.logger.log(`Successfully transcribed clip ${i+1}: ${result.segments.length} segments found`);
                    
                    if (result.censorTimestamps) (clipDef as any).censorTimestamps = result.censorTimestamps;
                    if (result.jumpZoomStart !== undefined) (clipDef as any).jumpZoomStart = result.jumpZoomStart;
                    if (result.jumpZoomEnd !== undefined) (clipDef as any).jumpZoomEnd = result.jumpZoomEnd;

                    // --- TAHAP 1: Deteksi Emosi (Vibe) ---
                    if (result.vibe) {
                        clipDef.vibe = result.vibe;
                        this.logger.log(`Emotion detected: ${result.vibe}`);
                    }

                    // --- TAHAP 2: Smart Trimming (VAD via Whisper) ---
                    if (result.actualStart !== undefined && result.actualEnd !== undefined && result.actualEnd > result.actualStart) {
                        const originalStart = clipDef.startTime;
                        const trimStart = Math.max(0, result.actualStart - 0.2);
                        const trimEnd = Math.min(clipDef.duration, result.actualEnd + 0.5);
                        
                        clipDef.startTime = originalStart + trimStart;
                        clipDef.duration = trimEnd - trimStart;
                        
                        this.logger.log(`Smart Trimming Applied! New Start: ${clipDef.startTime}s, New Duration: ${clipDef.duration}s`);
                    }

                    clipTranscript = result.segments.map((seg: any) => ({
                        start: clipDef.startTime + seg.start,
                        end: clipDef.startTime + seg.end,
                        text: seg.text
                    }));
                } else {
                    this.logger.warn(`Python Transcriber returned empty or failed: ${result.error}`);
                }
                if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath);
            } catch (err: any) {
                this.logger.warn(`Failed to transcribe clip locally: ${err.message}`);
            }
        }

        // Generate Subtitles for this clip using the real (or locally transcribed) text!
        const absoluteSrtPath = SubtitleGenerator.generateAssSubtitles(`${videoId}-${i}`, clipTranscript, clipDef.startTime, clipDef.startTime + clipDef.duration);
        this.logger.log(`Starting FFmpeg extraction for clip ${i + 1}/${clipsToGenerate.length}...`);
        const escapedSrtPath = absoluteSrtPath.replace(/\\/g, '/').replace(/:/g, '\\:');
        const fontsDir = path.join(process.cwd(), 'fonts').replace(/\\/g, '/').replace(/:/g, '\\:');

        await this.enqueueFfmpegTask(`Extract & Subtitle Clip ${i + 1}`, async () => {
          await new Promise<void>(async (resolve, reject) => {
            let command = ffmpeg(absoluteInputPath).setStartTime(clipDef.startTime).setDuration(clipDef.duration);
            
            const tracker = new AITracker();
            const layoutModeStr = options?.layoutMode || 'auto_face';
            
            let manualXOffset = 50;
            if (layoutModeStr === 'auto_face') {
              try {
                this.logger.log(`Running Python OpenCV Face Tracker on ${absoluteInputPath}...`);
                const trackerOut = path.join(process.cwd(), 'uploads', `tracker-${videoId}-${i}.json`);
                const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
                const trackerScript = path.join(process.cwd(), '..', '..', 'ai-engine', 'tracker.py');
                
                await new Promise<void>((resolve, reject) => {
                  const { spawn } = require('child_process');
                  const child = spawn(pythonCmd, [trackerScript, '--video', absoluteInputPath, '--out', trackerOut, '--sample_frames', '10']);
                  child.on('close', (code: number) => {
                    if (code === 0) resolve();
                    else reject(new Error('Tracker failed'));
                  });
                });
                
                if (require('fs').existsSync(trackerOut)) {
                  const tData = JSON.parse(require('fs').readFileSync(trackerOut, 'utf-8'));
                  manualXOffset = Math.round(tData.x_offset * 100);
                  require('fs').unlinkSync(trackerOut);
                  this.logger.log(`[CLIP ${i+1}] OpenCV Face Tracker calculated optimal X-Offset: ${manualXOffset}%`);
                }
              } catch (e) {
                this.logger.warn(`OpenCV Tracker failed: ${e.message}, defaulting to center crop.`);
              }
            }
            
            const cropFilter = tracker.getDynamicCropFilter(clipDef.aspectRatio, { 
              mode: layoutModeStr === 'auto_face' ? 'manual' : layoutModeStr as any,
              manualXOffset 
            });
            
            let bleepPath = path.join(process.cwd(), 'assets', 'bleep.wav').replace(/\\/g, '/');
            let bgmPath = null;
            let bleepInputIndex = 1;
            let bgmInputIndex = 1;

            let hasBleep = (clipDef as any).censorTimestamps && (clipDef as any).censorTimestamps.length > 0;
            if (hasBleep) {
                command = command.input(bleepPath);
                bgmInputIndex = 2; // BGM gets pushed to index 2 if bleep exists
            }

            // Pick BGM based on Vibe
            if (clipDef.vibe) {
                let bgmName = 'upbeat.mp3';
                if (clipDef.vibe.includes('Sedih')) bgmName = 'sad.mp3';
                else if (clipDef.vibe.includes('Tegang')) bgmName = 'tense.mp3';
                
                let checkBgmPath = path.join(process.cwd(), 'assets', 'bgm', bgmName);
                if (require('fs').existsSync(checkBgmPath)) {
                    bgmPath = checkBgmPath.replace(/\\/g, '/');
                    // Add BGM and loop it infinitely so it covers the clip length
                    command = command.input(bgmPath).inputOptions(['-stream_loop', '-1']);
                }
            }

            // Always use complex filter to ensure strict video stream mapping
            let filterGraph: string[] = [];
            
            // --- 1. VISUAL CHAIN ---
            // If OpenCV dynamic tracker format is used, it already creates [out]
            let visualOut = '[out]';
            if (cropFilter && cropFilter.includes(';')) {
                filterGraph.push(cropFilter); // OpenCV outputs [out]
            } else {
                filterGraph.push(`[0:v]${cropFilter}[out]`); // Static crop outputs [out]
            }

            // TAHAP 3: Emotional Jump Zoom
            let hasZoom = (clipDef as any).jumpZoomStart !== undefined && (clipDef as any).jumpZoomStart !== null && (clipDef as any).jumpZoomEnd !== null;
            if (hasZoom) {
                // Split the frame, zoom the second, and overlay it during the timestamp
                let zStart = (clipDef as any).jumpZoomStart;
                let zEnd = (clipDef as any).jumpZoomEnd;
                filterGraph.push(`${visualOut}split[base1][base2]`);
                filterGraph.push(`[base2]scale=iw*1.2:ih*1.2,crop=iw/1.2:ih/1.2[zoomed]`);
                filterGraph.push(`[base1][zoomed]overlay=0:0:enable='between(t,${zStart},${zEnd})'[zoomed_out]`);
                visualOut = '[zoomed_out]';
            }

            // Subtitles
            let finalVisualOut = '[final_v]';
            if (options?.captions === 'false') {
                filterGraph.push(`${visualOut}null${finalVisualOut}`);
            } else {
                filterGraph.push(`${visualOut}subtitles='${escapedSrtPath}':fontsdir='${fontsDir}'${finalVisualOut}`);
            }

            // --- 2. AUDIO CHAIN ---
            let audioOut = '[0:a]';
            let finalAudioOut = '[final_a]';

            // TAHAP 2: Auto-Censor Bleep
            if (hasBleep) {
                let muteExpr = (clipDef as any).censorTimestamps.map((c: any) => `between(t,${c.start},${c.end})`).join('+');
                filterGraph.push(`${audioOut}volume=0:enable='${muteExpr}'[muted_v]`);
                
                // Mix in the bleep sounds for each timestamp
                // Using adelay requires milliseconds
                let delayFilters = (clipDef as any).censorTimestamps.map((c: any, idx: number) => {
                    let ms = Math.floor(c.start * 1000);
                    return `[${bleepInputIndex}:a]adelay=${ms}|${ms}[bleep${idx}]`;
                });
                filterGraph.push(...delayFilters);
                
                // Amix them all together
                let amixInputs = `[muted_v]` + (clipDef as any).censorTimestamps.map((_: any, idx: number) => `[bleep${idx}]`).join('');
                filterGraph.push(`${amixInputs}amix=inputs=${(clipDef as any).censorTimestamps.length + 1}:duration=first:dropout_transition=0[censored_a]`);
                audioOut = '[censored_a]';
            }

            // TAHAP 4: Auto-Ducking BGM
            if (bgmPath) {
                // Duck BGM based on Vocal
                filterGraph.push(`[${bgmInputIndex}:a]volume=0.3[bgm_low]`);
                // Use simple amix for BGM to avoid complex sidechain compress issues if channels mismatch
                filterGraph.push(`${audioOut}[bgm_low]amix=inputs=2:duration=first:dropout_transition=2[ducked_a]`);
                audioOut = '[ducked_a]';
            }

            filterGraph.push(`${audioOut}volume=1.0${finalAudioOut}`);

            command = command.complexFilter(filterGraph)
              .outputOptions([
                '-map', `${finalVisualOut}`,
                '-map', `${finalAudioOut}`,
                '-preset', 'fast',
                '-movflags', '+faststart'
              ])
              .videoCodec('libx264')
              .audioCodec('aac');

            command.output(absoluteClipPath)
              .on('end', () => resolve())
              .on('error', (err: any, stdout: any, stderr: any) => {
                this.logger.error(`FFmpeg Error on clip ${i + 1}: ${err.message}`);
                this.logger.error(`FFmpeg Stderr: ${stderr}`);
                reject(err);
              })
              .run();
          });
        });

        // Layer 3: The Garbage Collector (Cleanup temporary ASS files)
        try {
          if (fs.existsSync(absoluteSrtPath)) fs.unlinkSync(absoluteSrtPath);
          this.logger.log(`Cleaned up temp subtitle: ${absoluteSrtPath}`);
        } catch (e: any) {
          this.logger.warn(`Cleanup failed: ${e.message}`);
        }

        // Check if clip was generated properly
        if (!fs.existsSync(absoluteClipPath) || fs.statSync(absoluteClipPath).size < 1000) {
          this.logger.warn(`Clip ${i + 1} is empty or failed to generate. Skipping...`);
          continue;
        }

        // Generate thumbnail safely
        try {
          await this.enqueueFfmpegTask(`Generate Thumbnail Clip ${i + 1}`, async () => {
            await new Promise<void>((resolve, reject) => {
              ffmpeg(absoluteClipPath)
                .screenshots({
                  timestamps: ['50%'], // middle of the clip
                  filename: clipThumbnail,
                  folder: path.join(process.cwd(), 'uploads'),
                  size: '360x640'
                })
                .on('end', () => resolve())
                .on('error', (err: any) => reject(err));
            });
          });
        } catch (e: any) {
          this.logger.warn(`Failed to generate thumbnail for clip ${i + 1}: ${e.message}`);
          // Continue processing even if thumbnail fails
        }

        // --- TAHAP 3: Mata AI / Semantic Vision (CLIP) ---
        try {
            const absoluteThumbPath = path.join(process.cwd(), 'uploads', clipThumbnail);
            if (fs.existsSync(absoluteThumbPath)) {
                const { execSync } = require('child_process');
                const jsScript = path.join(process.cwd(), 'src', 'vision_local.js');
                const nodeCmd = 'node';
                
                this.logger.log(`Executing Vision AI Engine: ${nodeCmd} ${jsScript} ${absoluteThumbPath}`);
                const out = execSync(`"${nodeCmd}" "${jsScript}" "${absoluteThumbPath}"`, { maxBuffer: 1024 * 1024 * 5 }).toString();
                
                // Parse lines to get the JSON output from script
                const outLines = out.trim().split('\n');
                const jsonLine = outLines[outLines.length - 1];
                const result = JSON.parse(jsonLine.trim());
                
                if (result.success && result.tags) {
                    this.logger.log(`Vision AI detected visual tags: ${result.tags.join(', ')}`);
                    // Inject the semantic visual tags into brollKeyword
                    const visualTagsStr = result.tags.join(', ');
                    clipDef.brollKeyword = clipDef.brollKeyword 
                      ? `${clipDef.brollKeyword} | Visuals: ${visualTagsStr}` 
                      : `Visuals: ${visualTagsStr}`;
                }
            }
        } catch (e: any) {
            this.logger.warn(`Vision AI failed on clip ${i + 1}: ${e.message}`);
        }

        // Save to database
        await prisma.clip.create({
          data: {
            videoId,
            title: clipDef.title,
            score: clipDef.score,
            reason: clipDef.reason,
            socialCaption: clipDef.socialCaption,
            hashtags: clipDef.hashtags,
            wpm: clipDef.wpm,
            pacing: clipDef.pacing,
            brollKeyword: clipDef.brollKeyword,
            vibe: clipDef.vibe,
            hookStrength: clipDef.hookStrength,
            retentionRisk: clipDef.retentionRisk,
            targetDemographic: clipDef.targetDemographic,
            bgmSuggestion: clipDef.bgmSuggestion,
            alternativeTitle: clipDef.alternativeTitle,
            brandSafety: clipDef.brandSafety,
            ctaOverlay: clipDef.ctaOverlay,
            duration: clipDef.duration,
            startTime: clipDef.startTime,
            aspectRatio: clipDef.aspectRatio,
            platform: clipDef.platform,
            url: `local://uploads/${clipFilename}`,
            thumbnailUrl: `local://uploads/${clipThumbnail}`,
          }
        });
      }

      await this.updateProgress(videoId, 100, "Pemrosesan Selesai!", "READY");
      this.logger.log(`Video processing completed for ${videoId}`);
      await prisma.video.update({
        where: { id: videoId },
        data: { status: 'READY' }
      });
    } catch (e: any) {
      await this.updateProgress(videoId, 100, `Gagal: ${e.message}`, "FAILED");
      this.logger.error(`Error processing video:`, e);
      await prisma.video.update({
        where: { id: videoId },
        data: { status: 'FAILED' }
      });
    }
  }

  async exportClip(clipId: string, subtitleConfig: any, reframingMode: string, enhanceSpeech: boolean = false, brollSegments?: { start: number, duration: number, keyword: string }[]) {
    this.logger.log(`Exporting clip ${clipId} with custom styles... Enhance Speech: ${enhanceSpeech}`);
    const clip = await prisma.clip.findUnique({ where: { id: clipId }, include: { video: true } });
    if (!clip) throw new Error("Clip not found");

    // Extract index from clip url (clip-videoId-i.mp4)
    const urlParts = clip.url.split('-');
    const indexStr = urlParts[urlParts.length - 1].replace('.mp4', '');
    const assFilename = `subs-${clip.videoId}-${indexStr}.ass`;
    const assPath = path.join(process.cwd(), 'uploads', assFilename);

    let finalAssPath = assPath;

    // --- NEW: Apply Interactive Subtitles from Database ---
    const existingSubtitles = await prisma.subtitle.findFirst({ where: { clipId } });
    if (existingSubtitles && existingSubtitles.content) {
      this.logger.log(`Found custom subtitles for clip ${clipId}. Generating new ASS file...`);
      const newAssContent = SubtitleGenerator.generateAssSubtitles(
        `${clip.videoId}-${indexStr}`, 
        existingSubtitles.content as any[], 
        0, 
        clip.duration || 15
      );
      fs.writeFileSync(assPath, newAssContent, 'utf-8');
    }
    // --------------------------------------------------------

    if (fs.existsSync(assPath) && subtitleConfig) {
      // Modify ASS file
      let assContent = fs.readFileSync(assPath, 'utf-8');
      
      let font = 'Impact';
      if (subtitleConfig.font === 'Montserrat Black') font = 'Montserrat';
      if (subtitleConfig.font === 'Arial Black') font = 'Arial Black';

      let primaryColor = '&H00FFFFFF'; // White default
      if (subtitleConfig.color === 'Yellow') primaryColor = '&H0000FFFF';
      if (subtitleConfig.color === 'Green') primaryColor = '&H0000FF00';
      if (subtitleConfig.color === 'Cyan') primaryColor = '&H00FFFF00';

      let marginV = '450';
      if (subtitleConfig.location === 'center') marginV = '900';

      // Replace the Style line
      // Format: Style: Hormozi,Impact,95,&H00FFFFFF,...
      assContent = assContent.replace(/Style: Hormozi,[^,]+,[^,]+,[^,]+,([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+),[^,]+,/, `Style: Hormozi,${font},95,${primaryColor},$1,${marginV},`);
      
      finalAssPath = path.join(process.cwd(), 'uploads', `subs-${clip.videoId}-${indexStr}-custom.ass`);
      fs.writeFileSync(finalAssPath, assContent, 'utf-8');
    }

    // Now re-run ffmpeg to burn subtitle and reframe
    const clipFilename = `clip-${clip.videoId}-${indexStr}-export-${Date.now()}.mp4`;
    const absoluteClipPath = path.join(process.cwd(), 'uploads', clipFilename);
    const videoRelative = clip.video.url.replace('http://localhost:3345/', '');
    const absoluteInputPath = path.join(process.cwd(), videoRelative);

    let currentInputPath = absoluteInputPath;
    let currentStartTime: number | undefined = clip.startTime;
    let currentDuration: number | undefined = clip.duration;
    let cropFilter = '';

    const escapedSrtPath = finalAssPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    const fontsDir = path.join(process.cwd(), 'fonts').replace(/\\/g, '/').replace(/:/g, '\\:');
    const subFilter = `subtitles='${escapedSrtPath}':fontsdir='${fontsDir}'`;

    const actualReframingMode = reframingMode || 'auto_face';
    let rawSegmentPath = '';
    let trackedVideoPath = '';
    let trackedWithAudioPath = '';

    // If OpenCV Auto Face Tracking is requested
    if (actualReframingMode === 'auto_face') {
      this.logger.log(`Using Real OpenCV Face Tracking for Clip ${clipId}...`);
      const ts = Date.now();
      rawSegmentPath = path.join(process.cwd(), 'uploads', `raw-${ts}.mp4`);
      trackedVideoPath = path.join(process.cwd(), 'uploads', `tracked-${ts}.mp4`);
      trackedWithAudioPath = path.join(process.cwd(), 'uploads', `tracked-audio-${ts}.mp4`);
      
      // 1. Extract raw segment
      await this.enqueueFfmpegTask(`Extract Raw Segment ${clipId}`, async () => {
        await new Promise<void>((res, rej) => {
          ffmpeg(absoluteInputPath).setStartTime(clip.startTime).setDuration(clip.duration)
            .output(rawSegmentPath).on('end', () => res()).on('error', rej).run();
        });
      });

      // 2. Run Python Tracker
      const trackerScript = path.join(process.cwd(), '..', 'ai-engine', 'tracker.py');
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      this.logger.log(`Executing OpenCV VideoWriter Tracking...`);
      await execPromise(`"${pythonCmd}" "${trackerScript}" --input "${rawSegmentPath}" --output "${trackedVideoPath}"`);

      // 3. Merge Audio back
      await this.enqueueFfmpegTask(`Merge Audio ${clipId}`, async () => {
        await new Promise<void>((res, rej) => {
          ffmpeg(trackedVideoPath).input(rawSegmentPath)
            .outputOptions(['-c:v copy', '-c:a copy', '-map 0:v:0', '-map 1:a:0?'])
            .output(trackedWithAudioPath).on('end', () => res()).on('error', rej).run();
        });
      });

      currentInputPath = trackedWithAudioPath;
      currentStartTime = undefined; // Already cut
      currentDuration = undefined;  // Already cut
      cropFilter = ''; // OpenCV already cropped it to 9:16!
    } else {
      const tracker = new AITracker();
      const targetAspectRatio = subtitleConfig?.aspectRatio || clip.aspectRatio;
      cropFilter = tracker.getDynamicCropFilter(targetAspectRatio, { mode: (reframingMode as any) || 'auto_face' });
    }

    // Final Export Task
    await this.enqueueFfmpegTask(`Final Export ${clipId}`, async () => {
      await new Promise<void>(async (resolve, reject) => {
        let command = ffmpeg(currentInputPath);
        if (currentStartTime !== undefined) command = command.setStartTime(currentStartTime);
        if (currentDuration !== undefined) command = command.setDuration(currentDuration);

        if (brollSegments && brollSegments.length > 0) {
          const brollService = new BRollService();
          const filterChain: string[] = [];
          
          for (let i = 0; i < brollSegments.length; i++) {
            const seg = brollSegments[i];
            const brollPath = await brollService.fetchBRoll(seg.keyword, seg.duration);
            command = command.input(brollPath);
            
            const inputIdx = i + 1;
            filterChain.push(`[${inputIdx}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920[broll${i}]`);
          }

          let lastOutput = '[0:v]';
          if (cropFilter) {
            filterChain.push(`${cropFilter}[cropout]`);
            lastOutput = '[cropout]';
          }

          for (let i = 0; i < brollSegments.length; i++) {
            const seg = brollSegments[i];
            const currentOut = `[ov${i}]`;
            filterChain.push(`${lastOutput}[broll${i}]overlay=enable='between(t,${seg.start},${seg.start + seg.duration})'${currentOut}`);
            lastOutput = currentOut;
          }

          filterChain.push(`${lastOutput}${subFilter}[final]`);
          command = command.complexFilter(filterChain)
            .outputOptions(['-map', '[final]', '-map', '0:a?', '-preset fast', '-movflags +faststart']);

        } else {
          let filterGraph: string[] = [];
          if (cropFilter && cropFilter.includes(';')) {
            filterGraph = [cropFilter, `[out]${subFilter}[final]`];
          } else {
            filterGraph = [
              `[0:v]${cropFilter}[cropped]`,
              `[cropped]${subFilter}[final]`
            ];
          }
          
          command = command.complexFilter(filterGraph)
            .outputOptions(['-map', '[final]', '-map', '0:a?', '-preset fast', '-movflags +faststart']);
        }

        if (enhanceSpeech) {
          command = command.audioFilters('highpass=f=200,lowpass=f=3000,loudnorm=I=-16:TP=-1.5:LRA=11');
        }

        command
          .videoCodec('libx264')
          .audioCodec('aac')
          .output(absoluteClipPath)
          .on('end', () => resolve())
          .on('error', (err: any, stdout: any, stderr: any) => reject(new Error(`${err.message} - FFmpeg Stderr: ${stderr}`)))
          .run();
      });
    });

    // Layer 3: Garbage Collector (Clean up custom ASS file and temp raw video files)
    try {
      if (finalAssPath !== assPath && fs.existsSync(finalAssPath)) fs.unlinkSync(finalAssPath);
      if (rawSegmentPath && fs.existsSync(rawSegmentPath)) fs.unlinkSync(rawSegmentPath);
      if (trackedVideoPath && fs.existsSync(trackedVideoPath)) fs.unlinkSync(trackedVideoPath);
      if (trackedWithAudioPath && fs.existsSync(trackedWithAudioPath)) fs.unlinkSync(trackedWithAudioPath);
      this.logger.log(`Garbage Collector: Cleaned up temporary files for clip ${clipId}`);
    } catch (e: any) {
      this.logger.warn(`Garbage Collector failed: ${e.message}`);
    }

    // Update clip URL
    const finalUrl = `local://uploads/${clipFilename}`;
    await prisma.clip.update({ where: { id: clipId }, data: { url: finalUrl } });
    
    return { success: true, url: finalUrl.replace('local://', 'http://localhost:3345/') };
  }

  async createCustomClip(videoId: string, startTime: number, duration: number) {
    this.logger.log(`Creating custom clip for video ${videoId}: start=${startTime}, duration=${duration}`);
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) throw new Error("Video not found");

    const videoRelative = video.url.replace('http://localhost:3345/', '');
    const absoluteInputPath = path.join(process.cwd(), videoRelative);
    
    // Check if the video exists locally
    if (!fs.existsSync(absoluteInputPath)) {
      throw new Error("Original video file not found locally.");
    }

    // We'll generate a custom clip. No subtitle for now, they can add it via export later.
    // Or we could generate an empty subtitle.
    const customId = `custom-${Date.now()}`;
    const clipFilename = `clip-${videoId}-${customId}.mp4`;
    const clipThumbnail = `thumb-${videoId}-${customId}.jpg`;
    const absoluteClipPath = path.join(process.cwd(), 'uploads', clipFilename);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(absoluteInputPath)
        .setStartTime(startTime)
        .setDuration(duration)
        // Just crop to 9:16 Center by default for custom clips
        .videoFilters('crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-out_w)/2:(in_h-out_h)/2')
        .outputOptions(['-preset fast', '-movflags +faststart'])
        .videoCodec('libx264')
        .audioCodec('aac')
        .output(absoluteClipPath)
        .on('end', () => resolve())
        .on('error', (err: any, stdout: any, stderr: any) => reject(new Error(`${err.message} - FFmpeg Stderr: ${stderr}`)))
        .run();
    });

    // Generate thumbnail
    await new Promise<void>((resolve, reject) => {
      ffmpeg(absoluteClipPath)
        .screenshots({
          timestamps: ['50%'],
          filename: clipThumbnail,
          folder: path.join(process.cwd(), 'uploads'),
          size: '?x400' 
        })
        .on('end', () => resolve())
        .on('error', (err: any, stdout: any, stderr: any) => reject(new Error(`${err.message} - FFmpeg Stderr: ${stderr}`)));
    });

    // Generate a blank subtitle file so `exportClip` doesn't crash when looking for `subs-videoId-index.ass`
    const assFilename = `subs-${videoId}-${customId}.ass`;
    const assPath = path.join(process.cwd(), 'uploads', assFilename);
    const blankAss = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Hormozi,Impact,95,&H0000FFFF,&H000000FF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,1,8,12,2,40,40,450,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
    fs.writeFileSync(assPath, blankAss, 'utf-8');

    // Save to DB
    const newClip = await prisma.clip.create({
      data: {
        videoId,
        title: `Manual Custom Clip (${startTime}s)`,
        score: 100,
        duration: duration,
        startTime: startTime,
        aspectRatio: "9:16",
        platform: "TikTok/Reels",
        url: `local://uploads/${clipFilename}`,
        thumbnailUrl: `local://uploads/${clipThumbnail}`,
      }
    });

    return newClip;
  }

  async generateBRollForClip(clipId: string, keyword: string, duration?: number) {
    this.logger.log(`Generating B-Roll for clip ${clipId} with keyword: ${keyword}`);
    const brollService = new BRollService(); // Create an instance directly
    const brollPath = await brollService.fetchBRoll(keyword, duration || 3);
    
    // In a real implementation, we would save this to a B-Roll table linked to the clip.
    // For this prototype, we just return the local url and the frontend can append it to its state.
    const filename = path.basename(brollPath);
    const url = `http://localhost:3345/uploads/${filename}`;
    
    return { success: true, url, brollPath };
  }

  async transcribeClip(clipId: string) {
    const clip = await prisma.clip.findUnique({
      where: { id: clipId },
      include: { video: true, subtitles: true }
    });

    if (!clip) throw new Error("Clip not found");

    // If already transcribed, return existing
    if (clip.subtitles && clip.subtitles.length > 0) {
      return { success: true, segments: clip.subtitles[0].content, source: 'database' };
    }

    const tempWavPath = path.join(process.cwd(), 'uploads', `temp_audio_${clipId}.wav`);
    
    // Check if the clip url is local
    let clipUrl = clip.url;
    if (clipUrl.startsWith('local://')) {
      clipUrl = path.join(process.cwd(), clipUrl.replace('local://', ''));
    }

    this.logger.log(`Extracting audio from ${clipUrl} to ${tempWavPath}...`);
    await new Promise((resolve, reject) => {
      ffmpeg(clipUrl)
        .outputOptions(['-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1'])
        .output(tempWavPath)
        .on('end', () => resolve(null))
        .on('error', (err: any) => reject(err))
        .run();
    });

    // Call FastAPI
    const fastApiUrl = `http://localhost:8000/api/transcribe`;
    this.logger.log(`Calling AI Engine: POST ${fastApiUrl}`);
    const response = await fetch(fastApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_path: tempWavPath, language: 'id' })
    });
    
    const result = await response.json();
    if (fs.existsSync(tempWavPath)) fs.unlinkSync(tempWavPath);

    if (result.success && result.segments) {
      // Save to database
      await prisma.subtitle.create({
        data: {
          videoId: clip.videoId,
          clipId: clip.id,
          language: 'id',
          content: result.segments
        }
      });
      return { success: true, segments: result.segments, source: 'ai' };
    }

    throw new Error("Transcription failed: " + JSON.stringify(result));
  }

  async saveSubtitles(clipId: string, content: any) {
    // Upsert subtitle record
    const existing = await prisma.subtitle.findFirst({ where: { clipId } });
    if (existing) {
      return await prisma.subtitle.update({
        where: { id: existing.id },
        data: { content }
      });
    } else {
      const clip = await prisma.clip.findUnique({ where: { id: clipId } });
      return await prisma.subtitle.create({
        data: {
          videoId: clip?.videoId,
          clipId: clipId,
          language: 'id',
          content
        }
      });
    }
  }

  async getSubtitles(clipId: string) {
    const existing = await prisma.subtitle.findFirst({ where: { clipId } });
    if (existing) {
      return { success: true, segments: existing.content, source: 'database' };
    }
    return { success: false, segments: [], message: 'No subtitles found for this clip' };
  }
}
