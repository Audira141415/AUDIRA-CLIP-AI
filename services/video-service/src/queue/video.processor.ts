import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { VideoService } from '../video.service';
import { Logger } from '@nestjs/common';

@Processor('video-processing')
export class VideoProcessor extends WorkerHost {
  private readonly logger = new Logger(VideoProcessor.name);

  constructor(private readonly videoService: VideoService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing video job ${job.id} for type: ${job.name}`);
    
    if (job.name === 'process-video') {
      const { videoId, aspects, options } = job.data;
      await this.videoService.processVideo(videoId, aspects, options);
      return { success: true, videoId };
    }
    
    if (job.name === 'import-url') {
      const { url, userId, workspaceId, aspects, options } = job.data;
      // Note: importFromUrl in videoService should be awaited if it doesn't already fire and forget
      // We'll call the heavy logic directly if we can, or just call importFromUrl
      await this.videoService.importFromUrl(url, userId, workspaceId, aspects, options);
      return { success: true, url };
    }
  }
}
