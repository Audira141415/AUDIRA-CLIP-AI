import { Injectable, Logger } from '@nestjs/common';
const ffmpeg = require('fluent-ffmpeg');
import * as ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as path from 'path';
import * as fs from 'fs';

// Set ffmpeg path using the installer
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  async processVerticalClip(
    inputPath: string,
    outputPath: string,
    startTime: number,
    duration: number,
    onProgress: (progress: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.logger.log(`Starting FFmpeg processing: ${inputPath} -> ${outputPath}`);

      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(duration)
        // Video filter: Crop to 9:16 aspect ratio (e.g., 1080x1920) from the center
        .videoFilters([
          {
            filter: 'crop',
            options: 'ih*(9/16):ih'
          },
          {
            filter: 'scale',
            options: '1080:1920'
          }
        ])
        .on('start', (commandLine) => {
          this.logger.debug(`FFmpeg started with command: ${commandLine}`);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            onProgress(Math.round(progress.percent));
          }
        })
        .on('end', () => {
          this.logger.log(`FFmpeg processing finished successfully.`);
          resolve(outputPath);
        })
        .on('error', (err) => {
          this.logger.error(`FFmpeg processing failed: ${err.message}`);
          reject(err);
        })
        .save(outputPath);
    });
  }
}
