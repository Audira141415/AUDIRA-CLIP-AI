import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { OllamaService } from './ollama.service';
import { TranscriptionService } from './transcription.service';
import { HeatmapService } from './heatmap.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController, VideoController, ProjectController],
  providers: [AppService, VideoService, ProjectService, OllamaService, TranscriptionService, HeatmapService],
})
export class AppModule {}
