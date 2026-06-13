import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SubtitleService {
  private openai: OpenAI;
  private readonly logger = new Logger(SubtitleService.name);

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
    });
  }

  async generateAndSaveSubtitles(file: Express.Multer.File, videoId?: string, clipId?: string) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const tempFilePath = path.join(uploadDir, `temp_${Date.now()}.mp3`);
    fs.writeFileSync(tempFilePath, file.buffer);

    try {
      this.logger.log(`Starting Whisper transcription for file: ${tempFilePath}`);
      
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
        response_format: 'vtt', // VTT format for video players
      });

      // Save to database
      const subtitleRecord = await this.prisma.subtitle.create({
        data: {
          videoId: videoId || null,
          clipId: clipId || null,
          language: 'auto',
          content: transcription as unknown as any, // In Prisma we defined this as Json, but VTT is string. We can wrap it in an object.
        },
      });

      this.logger.log(`Subtitles saved to database with ID: ${subtitleRecord.id}`);

      return {
        id: subtitleRecord.id,
        vtt: transcription,
      };
    } catch (error: any) {
      this.logger.error('Error during transcription:', error);
      throw error;
    } finally {
      // Cleanup
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
}
