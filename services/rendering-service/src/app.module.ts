import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RenderProcessor } from './render.processor';
import { FfmpegService } from './ffmpeg.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue({
      name: 'video-rendering',
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
  controllers: [AppController],
  providers: [AppService, RenderProcessor, FfmpegService],
})
export class AppModule {}
