import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as stream from 'stream';
import { promisify } from 'util';
const ffmpeg = require('fluent-ffmpeg');

const pipeline = promisify(stream.pipeline);

@Injectable()
export class BRollService {
  private readonly logger = new Logger(BRollService.name);
  private readonly PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

  /**
   * Fetches a B-Roll video matching the keyword from Pexels.
   */
  async fetchBRoll(keyword: string, duration: number = 3): Promise<string> {
    this.logger.log(`Fetching B-Roll for keyword: "${keyword}", duration: ${duration}s`);
    
    const safeKeyword = keyword.replace(/[^a-zA-Z0-9\s]/g, '').trim().substring(0, 50);
    const filename = `broll-${safeKeyword.replace(/\s+/g, '_')}-${Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), 'uploads', filename);

    if (this.PEXELS_API_KEY) {
      try {
        this.logger.log(`Searching Pexels API for: ${safeKeyword}`);
        // Search for Portrait videos
        const searchUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(safeKeyword)}&per_page=15&orientation=portrait`;
        
        const response = await fetch(searchUrl, {
          headers: { 'Authorization': this.PEXELS_API_KEY }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.videos && data.videos.length > 0) {
            // Pick a random video from the top results to add variety
            const randomIndex = Math.floor(Math.random() * Math.min(5, data.videos.length));
            const videoData = data.videos[randomIndex];
            
            // Find a suitable video file (prefer SD or HD mp4)
            const videoFiles = videoData.video_files;
            const targetFile = videoFiles.find((f: any) => f.quality === 'hd' && f.file_type === 'video/mp4') 
                            || videoFiles.find((f: any) => f.quality === 'sd' && f.file_type === 'video/mp4')
                            || videoFiles[0];

            if (targetFile && targetFile.link) {
              this.logger.log(`Found Pexels Video ID ${videoData.id}. Downloading from: ${targetFile.link}`);
              
              const videoResponse = await fetch(targetFile.link);
              if (!videoResponse.ok) throw new Error(`Failed to download from Pexels: ${videoResponse.statusText}`);
              
              // We need to write the Web Response body to a Node.js file stream
              // fetch in Node 18 returns a Web ReadableStream, so we use Buffer.from(await arrayBuffer()) for short clips
              // For large files, stream.pipeline is better but requires Node.js readable stream conversion.
              // For B-Rolls (usually < 10MB), arrayBuffer is fine.
              const arrayBuffer = await videoResponse.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              fs.writeFileSync(outputPath, buffer);

              this.logger.log(`Successfully downloaded real B-Roll to ${outputPath}`);
              
              // We could theoretically crop it strictly to 9:16 and trim duration here,
              // but video.service.ts already applies scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920
              // So returning the raw mp4 is perfectly fine!
              return outputPath;
            }
          } else {
            this.logger.warn(`Pexels returned no videos for keyword: ${safeKeyword}. Falling back to mock.`);
          }
        } else {
            this.logger.error(`Pexels API Error: ${response.status} ${response.statusText}`);
        }
      } catch (err: any) {
        this.logger.error(`Failed to fetch from Pexels: ${err.message}. Falling back to mock.`);
      }
    } else {
      this.logger.warn(`PEXELS_API_KEY not found in .env. Falling back to mock generated video.`);
    }

    // --- FALLBACK MOCK VIDEO ---
    // Create a mock video using FFmpeg if Pexels API fails or key is missing
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
              text: `[B-ROLL: ${safeKeyword || keyword}]`,
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

    this.logger.log(`Fallback mock B-Roll generated at ${outputPath}`);
    return outputPath;
  }
}
