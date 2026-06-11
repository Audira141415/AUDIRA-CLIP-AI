import { NestFactory } from '@nestjs/core';
import { Module, Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import OpenAI from 'openai';
import * as fs from 'fs';

// Init OpenAI using env variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

@Controller('subtitles')
class SubtitleController {
  @Post('generate')
  @UseInterceptors(FileInterceptor('audio'))
  async generateSubtitles(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No audio file provided', HttpStatus.BAD_REQUEST);
    }

    try {
      // In a real scenario with Express.Multer.File, we'd write buffer to a temp file, 
      // or pass stream to OpenAI. For simplicity here, we assume buffer stream.
      const tempFilePath = `./uploads/temp_${Date.now()}.mp3`;
      if (!fs.existsSync('./uploads')) {
        fs.mkdirSync('./uploads');
      }
      fs.writeFileSync(tempFilePath, file.buffer);

      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
        response_format: 'vtt', // We want VTT for subtitles
      });

      // Cleanup
      fs.unlinkSync(tempFilePath);

      return {
        status: 'success',
        format: 'vtt',
        data: transcription,
      };
    } catch (error: any) {
      console.error('Whisper API Error:', error);
      throw new HttpException(error.message || 'Failed to process audio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Module({
  controllers: [SubtitleController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3004);
  console.log('Subtitle Service with Whisper AI is running on port 3004');
}
bootstrap();
