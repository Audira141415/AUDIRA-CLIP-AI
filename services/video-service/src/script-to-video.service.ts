import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { BRollService } from './broll.service';
import { SubtitleGenerator } from './subtitle-generator';

const ffmpeg = require('fluent-ffmpeg');

@Injectable()
export class ScriptToVideoService {
  private readonly logger = new Logger(ScriptToVideoService.name);
  private brollService = new BRollService();

  /**
   * Generates a full TikTok/Reels video from a plain text script.
   */
  async generateVideoFromScript(script: string): Promise<string> {
    this.logger.log(`Generating video from script: ${script.substring(0, 50)}...`);
    const id = Date.now().toString();

    // 1. Scene Breakage & Keyword Extraction (Mocked)
    // In a real app, send to Ollama to get: [{ text: "...", keyword: "..." }]
    const sentences = script.split('.').filter(s => s.trim().length > 0);
    const scenes = sentences.map((sentence, i) => {
      // Mock keyword extraction
      const words = sentence.split(' ');
      const keyword = words[Math.floor(Math.random() * words.length)].replace(/[^a-zA-Z]/g, '');
      return { id: i, text: sentence.trim(), keyword: keyword || 'abstract' };
    });

    // 2. Mock TTS (Text to Speech)
    // We generate a silent audio file or use a dummy mp3 of proper length.
    // Let's create an audio track that says the words using OS TTS or just 3s silence per scene.
    // For simplicity, we just assign 3 seconds per scene.
    const audioLength = scenes.length * 3;
    const audioPath = path.join(process.cwd(), 'uploads', `tts-${id}.mp3`);
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input('anullsrc')
        .inputFormat('lavfi')
        .duration(audioLength)
        .audioCodec('libmp3lame')
        .output(audioPath)
        .on('end', () => resolve())
        .on('error', (err: any) => reject(new Error(`TTS generation failed: ${err.message}`)))
        .run();
    });

    // 3. Fetch B-Rolls
    const brollPaths = [];
    for (const scene of scenes) {
      const brollPath = await this.brollService.fetchBRoll(scene.keyword, 3);
      brollPaths.push(brollPath);
    }

    // 4. Concat B-Rolls
    const concatListPath = path.join(process.cwd(), 'uploads', `concat-${id}.txt`);
    const fileContent = brollPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(concatListPath, fileContent);

    const mergedVideoPath = path.join(process.cwd(), 'uploads', `merged-${id}.mp4`);
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(concatListPath)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions(['-c copy'])
        .output(mergedVideoPath)
        .on('end', () => resolve())
        .on('error', (err: any) => reject(new Error(`Concat failed: ${err.message}`)))
        .run();
    });

    // 5. Generate Subtitles (Mocked format for SubtitleGenerator)
    const transcript = scenes.map((s, i) => ({
      start: i * 3,
      end: (i * 3) + 3,
      text: s.text
    }));
    
    const assPath = SubtitleGenerator.generateAssSubtitles(id, transcript, 0, audioLength);

    // 6. Final Assembly (Video + Audio + Subs)
    const finalOutputPath = path.join(process.cwd(), 'uploads', `script2video-${id}.mp4`);
    const escapedSrtPath = assPath.replace(/\\/g, '/').replace(':', '\\\\:');
    const fontsDir = 'fonts';

    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(mergedVideoPath)
        .input(audioPath)
        .videoFilters(`subtitles='${escapedSrtPath}':fontsdir='${fontsDir}'`)
        .outputOptions([
          '-map 0:v:0',
          '-map 1:a:0',
          '-c:v libx264',
          '-c:a aac',
          '-preset fast',
          '-movflags +faststart'
        ])
        .output(finalOutputPath)
        .on('end', () => resolve())
        .on('error', (err: any) => reject(new Error(`Final assembly failed: ${err.message}`)))
        .run();
    });

    this.logger.log(`Script-to-Video generation complete: ${finalOutputPath}`);
    return finalOutputPath;
  }
}
