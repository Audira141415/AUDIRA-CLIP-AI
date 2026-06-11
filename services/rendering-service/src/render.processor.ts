import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { FfmpegService } from './ffmpeg.service';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Processor('video-rendering')
export class RenderProcessor extends WorkerHost {
  private readonly logger = new Logger(RenderProcessor.name);

  constructor(
    private readonly ffmpegService: FfmpegService,
    @Inject('GATEWAY_SERVICE') private readonly gatewayClient: ClientProxy
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing render job ${job.id}`);
    
    const { inputPath, outputPath, startTime, duration } = job.data;
    
    // Fallback default values for testing
    const input = inputPath || 'sample_input.mp4';
    const output = outputPath || `out_clip_${job.id}.mp4`;
    const start = startTime || 0;
    const dur = duration || 10;

    try {
      const finalUrl = await this.ffmpegService.processVerticalClip(
        input, 
        output, 
        start, 
        dur, 
        (progress) => {
          this.logger.debug(`Job ${job.id} progress: ${progress}%`);
          job.updateProgress(progress);
          
          // Send Real-Time progress to API Gateway (WebSockets)
          this.gatewayClient.emit({ cmd: 'job_progress' }, {
            jobId: job.id,
            progress,
            status: 'PROCESSING'
          });
        }
      );

      this.gatewayClient.emit({ cmd: 'job_progress' }, {
        jobId: job.id,
        progress: 100,
        status: 'COMPLETED',
        url: finalUrl
      });

      return { status: 'COMPLETED', url: finalUrl };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed`, error);
      
      this.gatewayClient.emit({ cmd: 'job_progress' }, {
        jobId: job.id,
        progress: 0,
        status: 'FAILED',
      });
      throw error;
    }
  }
}
