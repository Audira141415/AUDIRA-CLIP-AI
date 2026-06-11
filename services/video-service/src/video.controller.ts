import { Controller, Post, Param, Get, Query, UseInterceptors, UploadedFile, BadRequestException, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('stats')
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
    @Query('folder') folder?: string
  ) {
    if (!userId || !workspaceId) throw new BadRequestException('userId and workspaceId are required');
    return this.videoService.getLibrary(userId, workspaceId, { tab, sortBy, folder });
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
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
      url: `http://localhost:3001/uploads/${file.filename}`,
      userId,
      workspaceId
    });

    const aspects = aspectsStr ? aspectsStr.split(',') : undefined;

    // Start background processing
    this.videoService.processVideo(videoRecord.id, aspects, { intent, lang, captions, broll, layoutMode });

    return {
      success: true,
      message: "Video uploaded successfully",
      video: videoRecord
    };
  }

  @Post('process/:id')
  async processVideo(@Param('id') id: string, @Query('aspects') aspectsStr?: string, @Query('intent') intent?: string) {
    const aspects = aspectsStr ? aspectsStr.split(',') : undefined;
    this.videoService.processVideo(id, aspects, { intent });
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

    // This will start the download and processing in the background
    const videoRecord = await this.videoService.importFromUrl(url, userId, workspaceId, aspects, { 
      intent, lang, captions, broll, quality, timeStart, timeEnd, clipLength, layoutMode, topic 
    });

    return {
      success: true,
      message: "Download started",
      video: videoRecord
    };
  }

  @Post('clip/:id/export')
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
}
