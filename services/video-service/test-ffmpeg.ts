import * as path from 'path';
import * as fs from 'fs';
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

async function testExport() {
  const inputVideo = path.join(process.cwd(), 'uploads', 'file-1780968651797-326375038.mp4');
  const outputVideo = path.join(process.cwd(), 'uploads', 'test-final-916.mp4');
  const assPath = path.join(process.cwd(), 'uploads', 'subs-TEST-HOAX.ass');

  if (!fs.existsSync(inputVideo)) {
    console.error("Input video not found!");
    return;
  }

  console.log("=== STARTING REAL E2E FFMPEG TEST ===");
  console.log("Input:", inputVideo);
  console.log("Output:", outputVideo);
  console.log("Subtitles:", assPath);
  console.log("Applying Aspect Ratio: 9:16 (Center Crop)");

  const cropFilter = 'crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-ow)/2:(in_h-oh)/2';
  
  const escapedSrtPath = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
  const fontsDir = path.join(process.cwd(), 'fonts').replace(/\\/g, '/').replace(/:/g, '\\:');
  const subFilter = `subtitles='${escapedSrtPath}':fontsdir='${fontsDir}'`;

  console.log("Filter Graph:", `[0:v]${cropFilter}[cropped];[cropped]${subFilter}[final]`);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputVideo)
      .setStartTime(10) // Start at 10 seconds
      .setDuration(2)   // Only 2 seconds for super fast test
      .complexFilter([
        `${cropFilter}[cropped]`,
        `[cropped]${subFilter}[final]`
      ])
      .outputOptions([
        '-map', '[final]',
        '-map', '0:a?',
        '-preset', 'ultrafast',
        '-crf', '28'
      ])
      .output(outputVideo)
      .on('progress', (progress: any) => {
        console.log(`Processing: ${progress.percent ? progress.percent.toFixed(2) : '??'}% done`);
      })
      .on('end', () => resolve())
      .on('error', (err: any, stdout: any, stderr: any) => {
        console.error("FFMPEG ERROR:", err.message);
        console.error("STDERR:", stderr);
        reject(err);
      })
      .run();
  });

  console.log("\n=== TEST COMPLETED SUCCESSFULLY! ===");
  console.log("Running FFprobe to verify output resolution...");

  await new Promise<void>((resolve) => {
    ffmpeg.ffprobe(outputVideo, (err: any, metadata: any) => {
      if (err) {
        console.error("FFPROBE ERROR:", err);
        resolve();
        return;
      }
      const stream = metadata.streams.find((s: any) => s.codec_type === 'video');
      console.log(`VERIFIED RESOLUTION: ${stream.width}x${stream.height}`);
      if (stream.height > stream.width) {
        console.log("SUCCESS! Video is mathematically PORTRAIT (Vertical/9:16)!");
      } else {
        console.log("FAILED! Video is still LANDSCAPE (Horizontal)!");
      }
      resolve();
    });
  });
}

testExport();
