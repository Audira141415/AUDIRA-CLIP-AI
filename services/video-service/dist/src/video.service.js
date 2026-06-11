"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var VideoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const common_1 = require("@nestjs/common");
const database_1 = require("@audira/database");
const ffmpegInstaller = __importStar(require("@ffmpeg-installer/ffmpeg"));
const ffprobeInstaller = __importStar(require("@ffprobe-installer/ffprobe"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const util = __importStar(require("util"));
const execPromise = util.promisify(child_process_1.exec);
const ai_tracker_1 = require("./ai-tracker");
const subtitle_generator_1 = require("./subtitle-generator");
const ollama_service_1 = require("./ollama.service");
const transcription_service_1 = require("./transcription.service");
const heatmap_service_1 = require("./heatmap.service");
const broll_service_1 = require("./broll.service");
const ffmpeg = require('fluent-ffmpeg');
const youtubedl = require('youtube-dl-exec');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);
let VideoService = VideoService_1 = class VideoService {
    ollamaService;
    transcriptionService;
    heatmapService;
    logger = new common_1.Logger(VideoService_1.name);
    ffmpegQueue = Promise.resolve();
    async enqueueFfmpegTask(taskName, task) {
        this.logger.log(`Queueing FFmpeg Task: ${taskName}`);
        return new Promise((resolve, reject) => {
            this.ffmpegQueue = this.ffmpegQueue.then(async () => {
                this.logger.log(`Starting FFmpeg Task: ${taskName}`);
                try {
                    const result = await task();
                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }
            }).catch(async () => {
                this.logger.log(`Starting FFmpeg Task (after previous failure): ${taskName}`);
                try {
                    const result = await task();
                    resolve(result);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    constructor(ollamaService, transcriptionService, heatmapService) {
        this.ollamaService = ollamaService;
        this.transcriptionService = transcriptionService;
        this.heatmapService = heatmapService;
    }
    async getDashboardStats(userId, workspaceId) {
        const [totalVideos, totalClips] = await Promise.all([
            database_1.prisma.video.count({ where: { userId, workspaceId } }),
            database_1.prisma.clip.count({ where: { video: { userId, workspaceId } } }),
        ]);
        return {
            totalVideos,
            totalClips,
            totalExports: 0,
            storageUsed: "256 MB",
            aiUsage: "12%",
            teamMembers: 1,
        };
    }
    async getLibrary(userId, workspaceId, query) {
        const { tab, sortBy, folder } = query || {};
        const videoWhere = { userId, workspaceId, isDeleted: false };
        const clipWhere = { video: { userId, workspaceId }, isDeleted: false };
        const projectWhere = { userId, workspaceId };
        if (folder && folder !== 'All Folders') {
            videoWhere.folder = folder;
            clipWhere.folder = folder;
        }
        let orderBy = { createdAt: 'desc' };
        if (sortBy === 'Sort: Oldest')
            orderBy = { createdAt: 'asc' };
        if (sortBy === 'Sort: Duration')
            orderBy = { duration: 'desc' };
        if (tab === 'CLIPS') {
            return database_1.prisma.clip.findMany({ where: clipWhere, orderBy, include: { video: true } });
        }
        else if (tab === 'PROJECTS') {
            return database_1.prisma.project.findMany({ where: projectWhere, orderBy });
        }
        else if (tab === 'FAVORITES') {
            const videos = await database_1.prisma.video.findMany({ where: { ...videoWhere, isFavorite: true }, orderBy, include: { _count: { select: { clips: true } } } });
            const clips = await database_1.prisma.clip.findMany({ where: { ...clipWhere, isFavorite: true }, orderBy, include: { video: true } });
            return { videos, clips };
        }
        else if (tab === 'TRASH') {
            const videos = await database_1.prisma.video.findMany({ where: { userId, workspaceId, isDeleted: true }, orderBy, include: { _count: { select: { clips: true } } } });
            const clips = await database_1.prisma.clip.findMany({ where: { video: { userId, workspaceId }, isDeleted: true }, orderBy, include: { video: true } });
            return { videos, clips };
        }
        else {
            return database_1.prisma.video.findMany({ where: videoWhere, orderBy, include: { _count: { select: { clips: true } } } });
        }
    }
    async toggleFavorite(type, id) {
        if (type === 'video') {
            const v = await database_1.prisma.video.findUnique({ where: { id } });
            return database_1.prisma.video.update({ where: { id }, data: { isFavorite: !v?.isFavorite } });
        }
        else if (type === 'clip') {
            const c = await database_1.prisma.clip.findUnique({ where: { id } });
            return database_1.prisma.clip.update({ where: { id }, data: { isFavorite: !c?.isFavorite } });
        }
    }
    async moveToTrash(type, id) {
        if (type === 'video') {
            return database_1.prisma.video.update({ where: { id }, data: { isDeleted: true } });
        }
        else if (type === 'clip') {
            return database_1.prisma.clip.update({ where: { id }, data: { isDeleted: true } });
        }
    }
    async restoreFromTrash(type, id) {
        if (type === 'video') {
            return database_1.prisma.video.update({ where: { id }, data: { isDeleted: false } });
        }
        else if (type === 'clip') {
            return database_1.prisma.clip.update({ where: { id }, data: { isDeleted: false } });
        }
    }
    async deletePermanently(type, id) {
        if (type === 'video') {
            return database_1.prisma.video.delete({ where: { id } });
        }
        else if (type === 'clip') {
            return database_1.prisma.clip.delete({ where: { id } });
        }
    }
    async createVideoRecord(data) {
        return database_1.prisma.video.create({
            data: {
                title: data.title,
                url: data.url,
                duration: 0,
                status: 'PENDING',
                userId: data.userId,
                workspaceId: data.workspaceId,
            }
        });
    }
    async getVideoDetails(videoId) {
        return database_1.prisma.video.findUnique({
            where: { id: videoId },
            include: { clips: true }
        });
    }
    async importFromUrl(url, userId, workspaceId, requestedAspects, options) {
        this.logger.log(`Starting download from URL: ${url}`);
        const videoRecord = await this.createVideoRecord({
            title: "Downloading...",
            url: "pending",
            userId,
            workspaceId
        });
        (async () => {
            try {
                await this.updateProgress(videoRecord.id, 10, "Mengunduh video dari YouTube...", "PROCESSING");
                const filename = `import-${Date.now()}-${Math.round(Math.random() * 1E9)}.mp4`;
                const outputPath = path.join(process.cwd(), 'uploads', filename);
                let ytdlFormat = 'bestvideo[vcodec^=avc]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
                if (options?.quality === '1080p') {
                    ytdlFormat = 'bestvideo[vcodec^=avc][height<=1080]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
                }
                else if (options?.quality === '720p') {
                    ytdlFormat = 'bestvideo[vcodec^=avc][height<=720]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
                }
                else if (options?.quality === '480p') {
                    ytdlFormat = 'bestvideo[vcodec^=avc][height<=480]+bestaudio[acodec^=mp4a]/best[ext=mp4]/best';
                }
                const proxies = process.env.YOUTUBE_PROXIES ? process.env.YOUTUBE_PROXIES.split(',') : [];
                const selectedProxy = proxies.length > 0 ? proxies[Math.floor(Math.random() * proxies.length)].trim() : null;
                const fs = require('fs');
                let selectedCookiePath = null;
                const cookiesDir = path.join(process.cwd(), 'cookies');
                if (fs.existsSync(cookiesDir)) {
                    const cookieFiles = fs.readdirSync(cookiesDir).filter((f) => f.endsWith('.txt'));
                    if (cookieFiles.length > 0) {
                        const randomFile = cookieFiles[Math.floor(Math.random() * cookieFiles.length)];
                        selectedCookiePath = path.join(cookiesDir, randomFile);
                    }
                }
                if (!selectedCookiePath && fs.existsSync(path.join(process.cwd(), 'cookies.txt'))) {
                    selectedCookiePath = path.join(process.cwd(), 'cookies.txt');
                }
                const ytdlOptions = {
                    output: outputPath,
                    format: ytdlFormat,
                    mergeOutputFormat: 'mp4',
                    ffmpegLocation: ffmpegInstaller.path,
                    noCheckCertificates: true,
                    noWarnings: true,
                    fileAccessRetries: 10,
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
                await this.enqueueFfmpegTask(`Download & Merge YouTube URL: ${url}`, async () => {
                    await youtubedl(url, ytdlOptions);
                });
                this.logger.log(`Download complete! Saved to ${outputPath}`);
                if (!fs.existsSync(outputPath)) {
                    throw new Error("Download completed but file not found");
                }
                let title = "Imported Video";
                try {
                    const videoInfo = await youtubedl(url, { dumpSingleJson: true, noWarnings: true, noCheckCertificates: true });
                    const parsedInfo = typeof videoInfo === 'string' ? JSON.parse(videoInfo) : videoInfo;
                    if (parsedInfo && parsedInfo.title) {
                        title = parsedInfo.title;
                    }
                }
                catch (e) {
                    this.logger.warn(`Could not fetch title for ${url}`);
                }
                await database_1.prisma.video.update({
                    where: { id: videoRecord.id },
                    data: {
                        title: title,
                        url: `local://uploads/${filename}`
                    }
                });
                this.logger.log(`Download complete: ${title}`);
                await this.updateProgress(videoRecord.id, 20, "Unduhan Selesai. Menyiapkan Pemrosesan...", "PROCESSING");
                this.processVideo(videoRecord.id, requestedAspects, options);
            }
            catch (error) {
                this.logger.error(`Failed to download from URL: ${url}`, error);
                await this.updateProgress(videoRecord.id, 100, `Download Failed: ${error.message}`, "FAILED");
            }
        })();
        return videoRecord;
    }
    async updateProgress(id, progress, statusMessage, status) {
        try {
            const data = { progress, statusMessage };
            if (status)
                data.status = status;
            await database_1.prisma.video.update({ where: { id }, data });
            this.logger.debug(`Video ${id} progress: ${progress}% - ${statusMessage}`);
        }
        catch (e) {
        }
    }
    async processVideo(videoId, requestedAspects, options) {
        this.logger.log(`Starting FFmpeg processing for video: ${videoId}`);
        try {
            const video = await database_1.prisma.video.findUnique({ where: { id: videoId } });
            if (!video)
                throw new Error("Video not found");
            let relativePath = video.url;
            if (relativePath.startsWith('http://localhost:3001/')) {
                relativePath = relativePath.replace('http://localhost:3001/', '');
            }
            else if (relativePath.startsWith('local://')) {
                relativePath = relativePath.replace('local://', '');
            }
            const absoluteInputPath = path.join(process.cwd(), relativePath);
            if (!fs.existsSync(absoluteInputPath)) {
                throw new Error(`File not found: ${absoluteInputPath}`);
            }
            await database_1.prisma.video.update({ where: { id: videoId }, data: { status: 'PROCESSING' } });
            await this.updateProgress(videoId, 25, "Menyiapkan ekstraksi audio...", "PROCESSING");
            const duration = await new Promise((resolve, reject) => {
                ffmpeg.ffprobe(absoluteInputPath, (err, metadata) => {
                    if (err)
                        return reject(err);
                    resolve(metadata.format.duration || 0);
                });
            });
            await database_1.prisma.video.update({ where: { id: videoId }, data: { duration: Math.round(duration) } });
            this.logger.log(`Video duration: ${duration}s`);
            this.logger.log(`Transcribing video using Whisper...`);
            await this.updateProgress(videoId, 30, "Mendengarkan Audio (Transkripsi Whisper)...");
            const transcript = await this.transcriptionService.transcribeReal(absoluteInputPath, async (sec) => {
                const pct = Math.min(30 + Math.floor((sec / duration) * 10), 40);
                await this.updateProgress(videoId, pct, `Mendengarkan Audio... (${Math.round(sec)}/${Math.round(duration)} detik)`);
            }, options?.lang);
            this.logger.log(`Executing Layer 0: The Architect...`);
            await this.updateProgress(videoId, 40, "Memetakan Struktur Video (Layer 0)...");
            const chapters = await this.ollamaService.mapVideoChapters(transcript, duration);
            this.logger.log(`Chapters Mapped: ${JSON.stringify(chapters)}`);
            let aiClips = [];
            const ytVideoId = this.heatmapService.extractVideoId(video.url) || this.heatmapService.extractVideoId(options?.url || '');
            if (ytVideoId) {
                this.logger.log(`YouTube video detected (${ytVideoId}), trying to fetch heatmap data...`);
                await this.updateProgress(videoId, 50, "Mengekstrak Data Heatmap YouTube...");
                const heatmapSegments = await this.heatmapService.getMostReplayed(ytVideoId);
                if (heatmapSegments.length > 0) {
                    this.logger.log(`Successfully fetched ${heatmapSegments.length} heatmap segments!`);
                    aiClips = heatmapSegments.map((seg, i) => ({
                        title: `Viral Heatmap Clip ${i + 1}`,
                        start: seg.start,
                        end: seg.start + seg.duration,
                        score: seg.score * 100
                    }));
                }
                else {
                    this.logger.log(`No heatmap data found, falling back to DeepSeek AI analysis...`);
                }
            }
            if (aiClips.length === 0) {
                this.logger.log(`Analyzing transcript with AI...`);
                await this.updateProgress(videoId, 60, "DeepSeek Menganalisis Momen Viral...");
                aiClips = await this.ollamaService.analyzeTranscriptForClips(transcript, options?.intent, duration, chapters);
            }
            const PADDING = 10;
            const clipsToGenerate = aiClips.map((clip, index) => {
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
            for (let i = 0; i < clipsToGenerate.length; i++) {
                await this.updateProgress(videoId, 80 + Math.floor((i / clipsToGenerate.length) * 15), `Mengekspor Klip ${i + 1} dari ${clipsToGenerate.length}...`);
                const clipDef = clipsToGenerate[i];
                const clipFilename = `clip-${videoId}-${i}.mp4`;
                const clipThumbnail = `thumb-${videoId}-${i}.jpg`;
                const absoluteClipPath = path.join(process.cwd(), 'uploads', clipFilename);
                this.logger.log(`Extracting clip ${i + 1} (${clipDef.aspectRatio}): ${clipDef.startTime}s to ${clipDef.startTime + clipDef.duration}s`);
                let clipTranscript = transcript;
                if (transcript.length === 0 || transcript[0].text === "Tahukah Anda" || transcript[0].text === " ") {
                    this.logger.log(`Using Local Python Transcriber Fallback for clip ${i + 1}...`);
                    try {
                        const tempWavPath = path.join(process.cwd(), 'uploads', `temp-${videoId}-${i}.wav`);
                        await new Promise((res, rej) => {
                            ffmpeg(absoluteInputPath)
                                .setStartTime(clipDef.startTime)
                                .setDuration(clipDef.duration)
                                .outputOptions(['-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1'])
                                .output(tempWavPath)
                                .on('end', () => res(null))
                                .on('error', (err) => rej(err))
                                .run();
                        });
                        const { execSync } = require('child_process');
                        const jsScript = path.join(process.cwd(), 'src', 'audio_ai_engine.js');
                        const nodeCmd = 'node';
                        const rawLang = options?.lang || 'id-ID';
                        const lang = rawLang.split('-')[0].toLowerCase();
                        this.logger.log(`Executing Audio AI Engine: ${nodeCmd} ${jsScript} ${tempWavPath} ${lang}`);
                        const out = execSync(`"${nodeCmd}" "${jsScript}" "${tempWavPath}" "${lang}"`, { maxBuffer: 1024 * 1024 * 10 }).toString();
                        const outLines = out.trim().split('\n');
                        const jsonLine = outLines[outLines.length - 1];
                        const result = JSON.parse(jsonLine.trim());
                        if (result.success && result.text) {
                            this.logger.log(`Successfully transcribed clip ${i + 1}: ${result.text}`);
                            if (result.censorTimestamps)
                                clipDef.censorTimestamps = result.censorTimestamps;
                            if (result.jumpZoomStart !== undefined)
                                clipDef.jumpZoomStart = result.jumpZoomStart;
                            if (result.jumpZoomEnd !== undefined)
                                clipDef.jumpZoomEnd = result.jumpZoomEnd;
                            if (result.vibe) {
                                clipDef.vibe = result.vibe;
                                this.logger.log(`Emotion detected: ${result.vibe}`);
                            }
                            if (result.actualStart !== undefined && result.actualEnd !== undefined && result.actualEnd > result.actualStart) {
                                const originalStart = clipDef.startTime;
                                const trimStart = Math.max(0, result.actualStart - 0.2);
                                const trimEnd = Math.min(clipDef.duration, result.actualEnd + 0.5);
                                clipDef.startTime = originalStart + trimStart;
                                clipDef.duration = trimEnd - trimStart;
                                this.logger.log(`Smart Trimming Applied! New Start: ${clipDef.startTime}s, New Duration: ${clipDef.duration}s`);
                            }
                            const words = result.text.split(' ');
                            const wordDur = clipDef.duration / words.length;
                            clipTranscript = [];
                            for (let w = 0; w < words.length; w++) {
                                clipTranscript.push({
                                    start: clipDef.startTime + (w * wordDur),
                                    end: clipDef.startTime + ((w + 1) * wordDur),
                                    text: words[w]
                                });
                            }
                        }
                        else {
                            this.logger.warn(`Python Transcriber returned empty or failed: ${result.error}`);
                        }
                        if (fs.existsSync(tempWavPath))
                            fs.unlinkSync(tempWavPath);
                    }
                    catch (err) {
                        this.logger.warn(`Failed to transcribe clip locally: ${err.message}`);
                    }
                }
                const absoluteSrtPath = subtitle_generator_1.SubtitleGenerator.generateAssSubtitles(`${videoId}-${i}`, clipTranscript, clipDef.startTime, clipDef.startTime + clipDef.duration);
                this.logger.log(`Starting FFmpeg extraction for clip ${i + 1}/${clipsToGenerate.length}...`);
                const escapedSrtPath = absoluteSrtPath.replace(/\\/g, '/').replace(/:/g, '\\:');
                const fontsDir = path.join(process.cwd(), 'fonts').replace(/\\/g, '/').replace(/:/g, '\\:');
                await this.enqueueFfmpegTask(`Extract & Subtitle Clip ${i + 1}`, async () => {
                    await new Promise(async (resolve, reject) => {
                        let command = ffmpeg(absoluteInputPath).setStartTime(clipDef.startTime).setDuration(clipDef.duration);
                        const tracker = new ai_tracker_1.AITracker();
                        const layoutModeStr = options?.layoutMode || 'auto_face';
                        let manualXOffset = 50;
                        if (layoutModeStr === 'auto_face') {
                            try {
                                this.logger.log(`Running Python OpenCV Face Tracker on ${absoluteInputPath}...`);
                                const trackerOut = path.join(process.cwd(), 'uploads', `tracker-${videoId}-${i}.json`);
                                const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
                                const trackerScript = path.join(process.cwd(), '..', '..', 'ai-engine', 'tracker.py');
                                await new Promise((resolve, reject) => {
                                    const { spawn } = require('child_process');
                                    const child = spawn(pythonCmd, [trackerScript, '--video', absoluteInputPath, '--out', trackerOut, '--sample_frames', '10']);
                                    child.on('close', (code) => {
                                        if (code === 0)
                                            resolve();
                                        else
                                            reject(new Error('Tracker failed'));
                                    });
                                });
                                if (require('fs').existsSync(trackerOut)) {
                                    const tData = JSON.parse(require('fs').readFileSync(trackerOut, 'utf-8'));
                                    manualXOffset = Math.round(tData.x_offset * 100);
                                    require('fs').unlinkSync(trackerOut);
                                    this.logger.log(`[CLIP ${i + 1}] OpenCV Face Tracker calculated optimal X-Offset: ${manualXOffset}%`);
                                }
                            }
                            catch (e) {
                                this.logger.warn(`OpenCV Tracker failed: ${e.message}, defaulting to center crop.`);
                            }
                        }
                        const cropFilter = tracker.getDynamicCropFilter(clipDef.aspectRatio, {
                            mode: layoutModeStr === 'auto_face' ? 'manual' : layoutModeStr,
                            manualXOffset
                        });
                        let bleepPath = path.join(process.cwd(), 'assets', 'bleep.wav').replace(/\\/g, '/');
                        let bgmPath = null;
                        let bleepInputIndex = 1;
                        let bgmInputIndex = 1;
                        let hasBleep = clipDef.censorTimestamps && clipDef.censorTimestamps.length > 0;
                        if (hasBleep) {
                            command = command.input(bleepPath);
                            bgmInputIndex = 2;
                        }
                        if (clipDef.vibe) {
                            let bgmName = 'upbeat.mp3';
                            if (clipDef.vibe.includes('Sedih'))
                                bgmName = 'sad.mp3';
                            else if (clipDef.vibe.includes('Tegang'))
                                bgmName = 'tense.mp3';
                            let checkBgmPath = path.join(process.cwd(), 'assets', 'bgm', bgmName);
                            if (require('fs').existsSync(checkBgmPath)) {
                                bgmPath = checkBgmPath.replace(/\\/g, '/');
                                command = command.input(bgmPath).inputOptions(['-stream_loop', '-1']);
                            }
                        }
                        let filterGraph = [];
                        let visualOut = '[out]';
                        if (cropFilter && cropFilter.includes(';')) {
                            filterGraph.push(cropFilter);
                        }
                        else {
                            filterGraph.push(`[0:v]${cropFilter}[out]`);
                        }
                        let hasZoom = clipDef.jumpZoomStart !== undefined && clipDef.jumpZoomStart !== null && clipDef.jumpZoomEnd !== null;
                        if (hasZoom) {
                            let zStart = clipDef.jumpZoomStart;
                            let zEnd = clipDef.jumpZoomEnd;
                            filterGraph.push(`${visualOut}split[base1][base2]`);
                            filterGraph.push(`[base2]scale=iw*1.2:ih*1.2,crop=iw/1.2:ih/1.2[zoomed]`);
                            filterGraph.push(`[base1][zoomed]overlay=0:0:enable='between(t,${zStart},${zEnd})'[zoomed_out]`);
                            visualOut = '[zoomed_out]';
                        }
                        let finalVisualOut = '[final_v]';
                        if (options?.captions === 'false') {
                            filterGraph.push(`${visualOut}null${finalVisualOut}`);
                        }
                        else {
                            filterGraph.push(`${visualOut}subtitles='${escapedSrtPath}':fontsdir='${fontsDir}'${finalVisualOut}`);
                        }
                        let audioOut = '[0:a]';
                        let finalAudioOut = '[final_a]';
                        if (hasBleep) {
                            let muteExpr = clipDef.censorTimestamps.map((c) => `between(t,${c.start},${c.end})`).join('+');
                            filterGraph.push(`${audioOut}volume=0:enable='${muteExpr}'[muted_v]`);
                            let delayFilters = clipDef.censorTimestamps.map((c, idx) => {
                                let ms = Math.floor(c.start * 1000);
                                return `[${bleepInputIndex}:a]adelay=${ms}|${ms}[bleep${idx}]`;
                            });
                            filterGraph.push(...delayFilters);
                            let amixInputs = `[muted_v]` + clipDef.censorTimestamps.map((_, idx) => `[bleep${idx}]`).join('');
                            filterGraph.push(`${amixInputs}amix=inputs=${clipDef.censorTimestamps.length + 1}:duration=first:dropout_transition=0[censored_a]`);
                            audioOut = '[censored_a]';
                        }
                        if (bgmPath) {
                            filterGraph.push(`[${bgmInputIndex}:a]volume=0.3[bgm_low]`);
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
                            .on('error', (err, stdout, stderr) => {
                            this.logger.error(`FFmpeg Error on clip ${i + 1}: ${err.message}`);
                            this.logger.error(`FFmpeg Stderr: ${stderr}`);
                            reject(err);
                        })
                            .run();
                    });
                });
                try {
                    if (fs.existsSync(absoluteSrtPath))
                        fs.unlinkSync(absoluteSrtPath);
                    this.logger.log(`Cleaned up temp subtitle: ${absoluteSrtPath}`);
                }
                catch (e) {
                    this.logger.warn(`Cleanup failed: ${e.message}`);
                }
                if (!fs.existsSync(absoluteClipPath) || fs.statSync(absoluteClipPath).size < 1000) {
                    this.logger.warn(`Clip ${i + 1} is empty or failed to generate. Skipping...`);
                    continue;
                }
                try {
                    await this.enqueueFfmpegTask(`Generate Thumbnail Clip ${i + 1}`, async () => {
                        await new Promise((resolve, reject) => {
                            ffmpeg(absoluteClipPath)
                                .screenshots({
                                timestamps: ['50%'],
                                filename: clipThumbnail,
                                folder: path.join(process.cwd(), 'uploads'),
                                size: '360x640'
                            })
                                .on('end', () => resolve())
                                .on('error', (err) => reject(err));
                        });
                    });
                }
                catch (e) {
                    this.logger.warn(`Failed to generate thumbnail for clip ${i + 1}: ${e.message}`);
                }
                try {
                    const absoluteThumbPath = path.join(process.cwd(), 'uploads', clipThumbnail);
                    if (fs.existsSync(absoluteThumbPath)) {
                        const { execSync } = require('child_process');
                        const jsScript = path.join(process.cwd(), 'src', 'vision_local.js');
                        const nodeCmd = 'node';
                        this.logger.log(`Executing Vision AI Engine: ${nodeCmd} ${jsScript} ${absoluteThumbPath}`);
                        const out = execSync(`"${nodeCmd}" "${jsScript}" "${absoluteThumbPath}"`, { maxBuffer: 1024 * 1024 * 5 }).toString();
                        const outLines = out.trim().split('\n');
                        const jsonLine = outLines[outLines.length - 1];
                        const result = JSON.parse(jsonLine.trim());
                        if (result.success && result.tags) {
                            this.logger.log(`Vision AI detected visual tags: ${result.tags.join(', ')}`);
                            const visualTagsStr = result.tags.join(', ');
                            clipDef.brollKeyword = clipDef.brollKeyword
                                ? `${clipDef.brollKeyword} | Visuals: ${visualTagsStr}`
                                : `Visuals: ${visualTagsStr}`;
                        }
                    }
                }
                catch (e) {
                    this.logger.warn(`Vision AI failed on clip ${i + 1}: ${e.message}`);
                }
                await database_1.prisma.clip.create({
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
            await database_1.prisma.video.update({
                where: { id: videoId },
                data: { status: 'READY' }
            });
        }
        catch (e) {
            await this.updateProgress(videoId, 100, `Gagal: ${e.message}`, "FAILED");
            this.logger.error(`Error processing video:`, e);
            await database_1.prisma.video.update({
                where: { id: videoId },
                data: { status: 'FAILED' }
            });
        }
    }
    async exportClip(clipId, subtitleConfig, reframingMode, enhanceSpeech = false, brollSegments) {
        this.logger.log(`Exporting clip ${clipId} with custom styles... Enhance Speech: ${enhanceSpeech}`);
        const clip = await database_1.prisma.clip.findUnique({ where: { id: clipId }, include: { video: true } });
        if (!clip)
            throw new Error("Clip not found");
        const urlParts = clip.url.split('-');
        const indexStr = urlParts[urlParts.length - 1].replace('.mp4', '');
        const assFilename = `subs-${clip.videoId}-${indexStr}.ass`;
        const assPath = path.join(process.cwd(), 'uploads', assFilename);
        let finalAssPath = assPath;
        if (fs.existsSync(assPath) && subtitleConfig) {
            let assContent = fs.readFileSync(assPath, 'utf-8');
            let font = 'Impact';
            if (subtitleConfig.font === 'Montserrat Black')
                font = 'Montserrat';
            if (subtitleConfig.font === 'Arial Black')
                font = 'Arial Black';
            let primaryColor = '&H00FFFFFF';
            if (subtitleConfig.color === 'Yellow')
                primaryColor = '&H0000FFFF';
            if (subtitleConfig.color === 'Green')
                primaryColor = '&H0000FF00';
            if (subtitleConfig.color === 'Cyan')
                primaryColor = '&H00FFFF00';
            let marginV = '450';
            if (subtitleConfig.location === 'center')
                marginV = '900';
            assContent = assContent.replace(/Style: Hormozi,[^,]+,[^,]+,[^,]+,([^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+,[^,]+),[^,]+,/, `Style: Hormozi,${font},95,${primaryColor},$1,${marginV},`);
            finalAssPath = path.join(process.cwd(), 'uploads', `subs-${clip.videoId}-${indexStr}-custom.ass`);
            fs.writeFileSync(finalAssPath, assContent, 'utf-8');
        }
        const clipFilename = `clip-${clip.videoId}-${indexStr}-export-${Date.now()}.mp4`;
        const absoluteClipPath = path.join(process.cwd(), 'uploads', clipFilename);
        const videoRelative = clip.video.url.replace('http://localhost:3001/', '');
        const absoluteInputPath = path.join(process.cwd(), videoRelative);
        let currentInputPath = absoluteInputPath;
        let currentStartTime = clip.startTime;
        let currentDuration = clip.duration;
        let cropFilter = '';
        const escapedSrtPath = finalAssPath.replace(/\\/g, '/').replace(/:/g, '\\:');
        const fontsDir = path.join(process.cwd(), 'fonts').replace(/\\/g, '/').replace(/:/g, '\\:');
        const subFilter = `subtitles='${escapedSrtPath}':fontsdir='${fontsDir}'`;
        const actualReframingMode = reframingMode || 'auto_face';
        let rawSegmentPath = '';
        let trackedVideoPath = '';
        let trackedWithAudioPath = '';
        if (actualReframingMode === 'auto_face') {
            this.logger.log(`Using Real OpenCV Face Tracking for Clip ${clipId}...`);
            const ts = Date.now();
            rawSegmentPath = path.join(process.cwd(), 'uploads', `raw-${ts}.mp4`);
            trackedVideoPath = path.join(process.cwd(), 'uploads', `tracked-${ts}.mp4`);
            trackedWithAudioPath = path.join(process.cwd(), 'uploads', `tracked-audio-${ts}.mp4`);
            await this.enqueueFfmpegTask(`Extract Raw Segment ${clipId}`, async () => {
                await new Promise((res, rej) => {
                    ffmpeg(absoluteInputPath).setStartTime(clip.startTime).setDuration(clip.duration)
                        .output(rawSegmentPath).on('end', () => res()).on('error', rej).run();
                });
            });
            const trackerScript = path.join(process.cwd(), '..', 'ai-engine', 'tracker.py');
            await execPromise(`python "${trackerScript}" --input "${rawSegmentPath}" --output "${trackedVideoPath}"`);
            await this.enqueueFfmpegTask(`Merge Audio ${clipId}`, async () => {
                await new Promise((res, rej) => {
                    ffmpeg(trackedVideoPath).input(rawSegmentPath)
                        .outputOptions(['-c:v copy', '-c:a copy', '-map 0:v:0', '-map 1:a:0?'])
                        .output(trackedWithAudioPath).on('end', () => res()).on('error', rej).run();
                });
            });
            currentInputPath = trackedWithAudioPath;
            currentStartTime = undefined;
            currentDuration = undefined;
            cropFilter = '';
        }
        else {
            const tracker = new ai_tracker_1.AITracker();
            const targetAspectRatio = subtitleConfig?.aspectRatio || clip.aspectRatio;
            cropFilter = tracker.getDynamicCropFilter(targetAspectRatio, { mode: reframingMode || 'auto_face' });
        }
        await this.enqueueFfmpegTask(`Final Export ${clipId}`, async () => {
            await new Promise(async (resolve, reject) => {
                let command = ffmpeg(currentInputPath);
                if (currentStartTime !== undefined)
                    command = command.setStartTime(currentStartTime);
                if (currentDuration !== undefined)
                    command = command.setDuration(currentDuration);
                if (brollSegments && brollSegments.length > 0) {
                    const brollService = new broll_service_1.BRollService();
                    const filterChain = [];
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
                }
                else {
                    let filterGraph = [];
                    if (cropFilter && cropFilter.includes(';')) {
                        filterGraph = [cropFilter, `[out]${subFilter}[final]`];
                    }
                    else {
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
                    .on('error', (err, stdout, stderr) => reject(new Error(`${err.message} - FFmpeg Stderr: ${stderr}`)))
                    .run();
            });
        });
        try {
            if (finalAssPath !== assPath && fs.existsSync(finalAssPath))
                fs.unlinkSync(finalAssPath);
            if (rawSegmentPath && fs.existsSync(rawSegmentPath))
                fs.unlinkSync(rawSegmentPath);
            if (trackedVideoPath && fs.existsSync(trackedVideoPath))
                fs.unlinkSync(trackedVideoPath);
            if (trackedWithAudioPath && fs.existsSync(trackedWithAudioPath))
                fs.unlinkSync(trackedWithAudioPath);
            this.logger.log(`Garbage Collector: Cleaned up temporary files for clip ${clipId}`);
        }
        catch (e) {
            this.logger.warn(`Garbage Collector failed: ${e.message}`);
        }
        const finalUrl = `local://uploads/${clipFilename}`;
        await database_1.prisma.clip.update({ where: { id: clipId }, data: { url: finalUrl } });
        return { success: true, url: finalUrl.replace('local://', 'http://localhost:3001/') };
    }
    async createCustomClip(videoId, startTime, duration) {
        this.logger.log(`Creating custom clip for video ${videoId}: start=${startTime}, duration=${duration}`);
        const video = await database_1.prisma.video.findUnique({ where: { id: videoId } });
        if (!video)
            throw new Error("Video not found");
        const videoRelative = video.url.replace('http://localhost:3001/', '');
        const absoluteInputPath = path.join(process.cwd(), videoRelative);
        if (!fs.existsSync(absoluteInputPath)) {
            throw new Error("Original video file not found locally.");
        }
        const customId = `custom-${Date.now()}`;
        const clipFilename = `clip-${videoId}-${customId}.mp4`;
        const clipThumbnail = `thumb-${videoId}-${customId}.jpg`;
        const absoluteClipPath = path.join(process.cwd(), 'uploads', clipFilename);
        await new Promise((resolve, reject) => {
            ffmpeg(absoluteInputPath)
                .setStartTime(startTime)
                .setDuration(duration)
                .videoFilters('crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-out_w)/2:(in_h-out_h)/2')
                .outputOptions(['-preset fast', '-movflags +faststart'])
                .videoCodec('libx264')
                .audioCodec('aac')
                .output(absoluteClipPath)
                .on('end', () => resolve())
                .on('error', (err, stdout, stderr) => reject(new Error(`${err.message} - FFmpeg Stderr: ${stderr}`)))
                .run();
        });
        await new Promise((resolve, reject) => {
            ffmpeg(absoluteClipPath)
                .screenshots({
                timestamps: ['50%'],
                filename: clipThumbnail,
                folder: path.join(process.cwd(), 'uploads'),
                size: '?x400'
            })
                .on('end', () => resolve())
                .on('error', (err, stdout, stderr) => reject(new Error(`${err.message} - FFmpeg Stderr: ${stderr}`)));
        });
        const assFilename = `subs-${videoId}-${customId}.ass`;
        const assPath = path.join(process.cwd(), 'uploads', assFilename);
        const blankAss = `[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Hormozi,Impact,95,&H0000FFFF,&H000000FF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,1,8,12,2,40,40,450,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n`;
        fs.writeFileSync(assPath, blankAss, 'utf-8');
        const newClip = await database_1.prisma.clip.create({
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
    async generateBRollForClip(clipId, keyword, duration) {
        this.logger.log(`Generating B-Roll for clip ${clipId} with keyword: ${keyword}`);
        const brollService = new broll_service_1.BRollService();
        const brollPath = await brollService.fetchBRoll(keyword, duration || 3);
        const filename = path.basename(brollPath);
        const url = `http://localhost:3001/uploads/${filename}`;
        return { success: true, url, brollPath };
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = VideoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ollama_service_1.OllamaService,
        transcription_service_1.TranscriptionService,
        heatmap_service_1.HeatmapService])
], VideoService);
//# sourceMappingURL=video.service.js.map