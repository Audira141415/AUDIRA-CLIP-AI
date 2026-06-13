import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BullModule } from '@nestjs/bullmq';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
import { VideoQueueProducer } from './queue/video.queue';
import { VideoProcessor } from './queue/video.processor';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'video-rendering',
    }),
    BullModule.registerQueue({
      name: 'video-processing',
    }),
    ClientsModule.register([
      {
        name: 'GATEWAY_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379'),
        },
      },
    ]),
  ],
  controllers: [AppController, VideoController, ProjectController],
  providers: [
    AppService, 
    VideoService, 
    ProjectService, 
    OllamaService, 
    TranscriptionService, 
    HeatmapService,
    VideoQueueProducer,
    VideoProcessor
  ],
})
export class AppModule {}
