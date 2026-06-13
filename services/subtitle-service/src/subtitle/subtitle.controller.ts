import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SubtitleService } from './subtitle.service';

@Controller('subtitles')
export class SubtitleController {
  constructor(private readonly subtitleService: SubtitleService) {}

  @Post('generate')
  @UseInterceptors(FileInterceptor('audio'))
  async generateSubtitles(
    @UploadedFile() file: Express.Multer.File,
    @Body('videoId') videoId?: string,
    @Body('clipId') clipId?: string,
  ) {
    if (!file) {
      throw new HttpException('No audio file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.subtitleService.generateAndSaveSubtitles(file, videoId, clipId);
      return {
        status: 'success',
        format: 'vtt',
        data: result,
      };
    } catch (error: any) {
      throw new HttpException(error.message || 'Failed to process audio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
