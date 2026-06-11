import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('ai-video-processing')
export class AiProcessor extends WorkerHost {
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job.id} of type ${job.name}`);
    console.log('Data:', job.data);
    
    switch (job.name) {
      case 'transcribe-whisper':
        return this.handleWhisperTranscription(job.data);
      case 'detect-highlights':
        return this.handleHighlightDetection(job.data);
      default:
        console.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleWhisperTranscription(data: any) {
    // Mock Whisper API call
    console.log('Running Whisper Transcription for video:', data.videoId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'COMPLETED', subtitlesId: 'sub-123' };
  }

  private async handleHighlightDetection(data: any) {
    // Mock OpenAI / Claude API call
    console.log('Running Highlight Detection for video:', data.videoId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { status: 'COMPLETED', clips: [{ start: 10, end: 30, score: 95 }] };
  }
}
