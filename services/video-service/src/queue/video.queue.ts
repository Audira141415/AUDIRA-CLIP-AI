import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class VideoQueueProducer {
  private readonly logger = new Logger(VideoQueueProducer.name);

  constructor(
    @InjectQueue('video-processing') private readonly processingQueue: Queue,
    @InjectQueue('video-rendering') private readonly renderingQueue: Queue
  ) {}

  async addProcessJob(videoId: string, aspects?: string[], options?: any) {
    this.logger.log(`Adding process job for video ${videoId} to queue...`);
    const job = await this.processingQueue.add('process-video', { videoId, aspects, options }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
    return job;
  }

  async addImportJob(url: string, userId: string, workspaceId: string, aspects?: string[], options?: any) {
    this.logger.log(`Adding import job for URL ${url} to queue...`);
    const job = await this.processingQueue.add('import-url', { url, userId, workspaceId, aspects, options }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
    });
    return job;
  }
}
