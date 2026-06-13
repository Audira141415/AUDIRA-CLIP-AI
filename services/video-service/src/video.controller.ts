import { Controller, Post, Param, Get, Query, UseInterceptors, UploadedFile, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { VideoQueueProducer } from './queue/video.queue';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Video')
@Controller('video')
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly queueProducer: VideoQueueProducer
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  healthCheck() {
    return { status: 'ok', service: 'video-service' };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get video dashboard statistics' })
  async getStats(@Query('userId') userId: string, @Query('workspaceId') workspaceId: string) {
    if (!userId || !workspaceId) throw new BadRequestException('userId and workspaceId are required');
    return this.videoService.getDashboardStats(userId, workspaceId);
  }

  @Get('library')
  async getLibrary(
    @Query('userId') userId: string, 
    @Query('workspaceId') workspaceId: string,
    @Query('tab') tab?: string,
    @Query('sortBy') sortBy?: string,
    @Query('folder') folder?: string,
    @Query('search') search?: string,
    @Query('tag') tag?: string,
    @Query('duration') duration?: string,
    @Query('owner') owner?: string
  ) {
    if (!userId || !workspaceId) throw new BadRequestException('userId and workspaceId are required');
    return this.videoService.getLibrary(userId, workspaceId, { tab, sortBy, folder, search, tag, duration, owner });
  }

  @Post('favorite/:type/:id')
  async toggleFavorite(@Param('type') type: string, @Param('id') id: string) {
    return this.videoService.toggleFavorite(type, id);
  }

  @Post('trash/:type/:id')
  async moveToTrash(@Param('type') type: string, @Param('id') id: string) {
    return this.videoService.moveToTrash(type, id);
  }

  @Post('restore/:type/:id')
  async restoreFromTrash(@Param('type') type: string, @Param('id') id: string) {
    return this.videoService.restoreFromTrash(type, id);
  }

  @Post('delete/:type/:id')
  async deletePermanently(@Param('type') type: string, @Param('id') id: string) {
    return this.videoService.deletePermanently(type, id);
  }

  @Post('rename/:type/:id')
  async renameMedia(@Param('type') type: string, @Param('id') id: string, @Body('title') title: string) {
    if (!title) throw new BadRequestException('title is required');
    return this.videoService.renameMedia(type, id, title);
  }

  @Post('merge')
  async mergeClips(@Body('clipIds') clipIds: string[], @Query('userId') userId: string, @Query('workspaceId') workspaceId: string) {
    if (!clipIds || !clipIds.length) throw new BadRequestException('clipIds are required');
    if (!userId || !workspaceId) throw new BadRequestException('userId and workspaceId are required');
    return this.videoService.mergeClips(clipIds, userId, workspaceId);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a new video file' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads';
        if (!require('fs').existsSync(uploadPath)) {
          require('fs').mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Query('userId') userId: string,
    @Query('workspaceId') workspaceId: string,
    @Query('aspects') aspectsStr?: string,
    @Query('intent') intent?: string,
    @Query('lang') lang?: string,
    @Query('captions') captions?: string,
    @Query('broll') broll?: string,
    @Query('layoutMode') layoutMode?: string
  ) {
    if (!file) throw new BadRequestException('File is required');
    if (!userId || !workspaceId) throw new BadRequestException('userId and workspaceId are required');

    const videoRecord = await this.videoService.createVideoRecord({
      title: file.originalname,
      url: `http://localhost:3345/uploads/${file.filename}`,
      userId,
      workspaceId
    });

    const aspects = aspectsStr ? aspectsStr.split(',') : undefined;

    // Start background processing via Queue
    this.queueProducer.addProcessJob(videoRecord.id, aspects, { intent, lang, captions, broll, layoutMode });

    return {
      success: true,
      message: "Video uploaded successfully",
      video: videoRecord
    };
  }

  @Post('process/:id')
  async processVideo(@Param('id') id: string, @Query('aspects') aspectsStr?: string, @Query('intent') intent?: string) {
    const aspects = aspectsStr ? aspectsStr.split(',') : undefined;
    this.queueProducer.addProcessJob(id, aspects, { intent });
    return { success: true, message: "Processing started" };
  }

  @Post('import-url')
  async importUrl(
    @Query('url') url: string,
    @Query('userId') userId: string,
    @Query('workspaceId') workspaceId: string,
    @Query('aspects') aspectsStr?: string,
    @Query('intent') intent?: string,
    @Query('lang') lang?: string,
    @Query('captions') captions?: string,
    @Query('broll') broll?: string,
    @Query('quality') quality?: string,
    @Query('timeStart') timeStart?: string,
    @Query('timeEnd') timeEnd?: string,
    @Query('clipLength') clipLength?: string,
    @Query('layoutMode') layoutMode?: string,
    @Query('topic') topic?: string
  ) {
    if (!url) throw new BadRequestException('url is required');
    if (!userId || !workspaceId) throw new BadRequestException('userId and workspaceId are required');

    const aspects = aspectsStr ? aspectsStr.split(',') : undefined;

    // This will start the download and processing in the background via Queue
    
    // First create a pending record so we can return quickly
    const videoRecord = await this.videoService.createVideoRecord({
      title: "Menunggu Antrean...",
      url: "pending",
      userId,
      workspaceId
    });

    this.queueProducer.addImportJob(url, userId, workspaceId, aspects, { 
      intent, lang, captions, broll, quality, timeStart, timeEnd, clipLength, layoutMode, topic,
      // Pass the pre-created ID so the worker can update it
      preCreatedId: videoRecord.id 
    });

    return {
      success: true,
      message: "Download started",
      video: videoRecord
    };
  }

  @Post('clip/:id/export')
  @ApiOperation({ summary: 'Export and render a generated clip' })
  async exportClip(
    @Param('id') clipId: string,
    @Body() body: { subtitleConfig: any; reframingMode: string }
  ) {
    if (!clipId) throw new BadRequestException('clipId is required');
    const result = await this.videoService.exportClip(clipId, body.subtitleConfig, body.reframingMode);
    return result;
  }

  @Post(':id/clip/custom')
  async createCustomClip(
    @Param('id') videoId: string,
    @Body() body: { startTime: number; duration: number }
  ) {
    if (!videoId || body.startTime == null || body.duration == null) {
      throw new BadRequestException('videoId, startTime, and duration are required');
    }
    const clip = await this.videoService.createCustomClip(videoId, body.startTime, body.duration);
    return clip;
  }

  @Get(':id')
  async getVideoDetails(@Param('id') id: string) {
    return this.videoService.getVideoDetails(id);
  }

  @Post('clip/:id/broll')
  async generateBRoll(
    @Param('id') clipId: string,
    @Body() body: { keyword: string; duration?: number }
  ) {
    if (!clipId || !body.keyword) throw new BadRequestException('clipId and keyword are required');
    return this.videoService.generateBRollForClip(clipId, body.keyword, body.duration);
  }

  @Post('clip/:id/transcribe')
  async transcribeClip(@Param('id') clipId: string) {
    if (!clipId) throw new BadRequestException('clipId is required');
    return this.videoService.transcribeClip(clipId);
  }

  @Get('clip/:id/subtitles')
  async getSubtitles(@Param('id') clipId: string) {
    if (!clipId) throw new BadRequestException('clipId is required');
    return this.videoService.getSubtitles(clipId);
  }

  @Post('clip/:id/subtitles')
  async saveSubtitles(@Param('id') clipId: string, @Body() content: any) {
    if (!clipId || !content) throw new BadRequestException('clipId and content are required');
    return this.videoService.saveSubtitles(clipId, content);
  }
}
