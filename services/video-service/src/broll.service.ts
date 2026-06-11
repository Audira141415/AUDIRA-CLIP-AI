import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
const ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class BRollService {
  private readonly logger = new Logger(BRollService.name);

  /**
   * Fetches a B-Roll video matching the keyword.
   * In a real implementation, this hits Pexels or Pixabay API, downloads the MP4,
   * and returns the local path. Here we mock it by generating a short video with ffmpeg.
   */
  async fetchBRoll(keyword: string, duration: number = 3): Promise<string> {
    this.logger.log(`Fetching B-Roll for keyword: "${keyword}", duration: ${duration}s`);
    
    const filename = `broll-${keyword.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), 'uploads', filename);

    // Create a mock video using FFmpeg (a solid color with the keyword as text)
    // We make it 1080x1920 (9:16) which is standard for Shorts/Reels
    const colors = ['darkblue', 'darkgreen', 'darkred', 'purple', 'black'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(`color=c=${randomColor}:s=1080x1920:d=${duration}`)
        .inputFormat('lavfi')
        .videoFilters([
          {
            filter: 'drawtext',
            options: {
              text: `[B-ROLL: ${keyword}]`,
              fontsize: 72,
              fontcolor: 'white',
              x: '(w-text_w)/2',
              y: '(h-text_h)/2'
            }
          }
        ])
        .outputOptions(['-preset fast', '-movflags +faststart'])
        .videoCodec('libx264')
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err: any) => reject(new Error(`Failed to generate mock B-Roll: ${err.message}`)))
        .run();
    });

    this.logger.log(`B-Roll downloaded to ${outputPath}`);
    return outputPath;
  }
}
