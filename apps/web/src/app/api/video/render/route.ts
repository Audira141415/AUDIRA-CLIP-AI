import { NextResponse } from 'next/server';
import { prisma } from '@audira/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { videoId, startTime, duration, outputFormat = 'mp4', isVertical = true, subtitles, hookText } = body;

    if (!videoId) {
      return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId, userId: session.user.id },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    const inputPath = path.resolve(process.cwd(), 'public', video.storagePath.replace(/^\//, ''));
    if (!fs.existsSync(inputPath)) {
      return NextResponse.json({ error: 'Source video file not found locally' }, { status: 404 });
    }

    const outputFileName = `render_${Date.now()}.${outputFormat}`;
    const outputPath = path.resolve(process.cwd(), 'public', 'renders', outputFileName);

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    // Generate ASS Subtitle File locally if subtitles are provided
    let assFilePath = null;
    if (subtitles && subtitles.length > 0) {
      const { generateHormoziASS } = require('../../../../../../lib/assGenerator');
      const assContent = generateHormoziASS(subtitles);
      assFilePath = path.resolve(process.cwd(), 'public', 'renders', `sub_${Date.now()}.ass`);
      fs.writeFileSync(assFilePath, assContent);
    }

    // Return early to let the request finish, run ffmpeg in background
    processVideoAsync(inputPath, outputPath, startTime, duration, isVertical, videoId, assFilePath, hookText);

    return NextResponse.json({ 
      success: true, 
      message: 'Rendering started in background',
      renderId: outputFileName 
    });

  } catch (error) {
    console.error('Render error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processVideoAsync(
  inputPath: string, 
  outputPath: string, 
  startTime: number, 
  duration: number, 
  isVertical: boolean,
  videoId: string,
  assFilePath: string | null,
  hookText?: string
) {
  try {
    const tempDir = path.dirname(outputPath);
    const baseName = path.basename(outputPath, path.extname(outputPath));
    
    // Step 0: Get GPU Arguments
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    let gpuArgs = ['-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '18'];
    try {
      const gpuScript = path.resolve(process.cwd(), '../../ai-engine/utils/gpu_detector.py');
      const { stdout } = await execPromise(`python "${gpuScript}"`);
      if (stdout) {
         const parsedArgs = JSON.parse(stdout.trim());
         if (Array.isArray(parsedArgs) && parsedArgs.length > 0) {
            gpuArgs = parsedArgs;
            console.log(`[Render] Using GPU Encoder Args: ${gpuArgs.join(' ')}`);
         }
      }
    } catch (err) {
      console.log(`[Render] GPU Detector failed, falling back to CPU:`, err);
    }
    
    // Step 1: Trim Video
    const trimmedPath = path.join(tempDir, `${baseName}_trimmed.mp4`);
    console.log(`[Render] Step 1: Trimming video -> ${trimmedPath}`);
    await new Promise((resolve, reject) => {
      let cmd = ffmpeg(inputPath);
      if (startTime !== undefined) cmd = cmd.setStartTime(startTime);
      if (duration !== undefined) cmd = cmd.setDuration(duration);
      cmd.outputOptions([...gpuArgs, '-c:a', 'aac'])
         .on('end', resolve)
         .on('error', reject)
         .save(trimmedPath);
    });

    let currentInput = trimmedPath;

    // Step 2: Face Tracking Auto-Reframe
    if (isVertical) {
      const trackedPath = path.join(tempDir, `${baseName}_tracked.mp4`);
      console.log(`[Render] Step 2: Face Tracking -> ${trackedPath}`);
      
      const trackerScript = path.resolve(process.cwd(), '../../ai-engine/tracker.py');
      const cmd = `python "${trackerScript}" --input "${currentInput}" --output "${trackedPath}"`;
      await execPromise(cmd);
      currentInput = trackedPath;
    }

    // Step 2.5: Generate Hook Intro
    let finalInput = currentInput;
    let hookPath = null;
    if (hookText) {
       console.log(`[Render] Step 2.5: Generating Hook -> ${hookText}`);
       hookPath = path.join(tempDir, `${baseName}_hook.mp4`);
       const hookScript = path.resolve(process.cwd(), '../../ai-engine/hook_generator.py');
       // Pass GPU args directly as JSON string if possible, or fallback
       const gpuArgsStr = JSON.stringify(gpuArgs).replace(/"/g, '\\"');
       const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
       const ffprobePath = require('@ffprobe-installer/ffprobe').path;
       const hookCmd = `python "${hookScript}" --input "${currentInput}" --text "${hookText}" --output "${hookPath}" --gpu-args "${gpuArgsStr}" --ffmpeg "${ffmpegPath}" --ffprobe "${ffprobePath}"`;
       await execPromise(hookCmd);
    }

    // Step 3: Burn Subtitles & Final Render
    console.log(`[Render] Step 3: Final Output -> ${outputPath}`);
    
    if (hookText && hookPath) {
       // We need to burn subtitles to currentInput first, then concat with hook
       let trackedSubs = currentInput;
       if (assFilePath) {
          trackedSubs = path.join(tempDir, `${baseName}_tracked_subs.mp4`);
          await new Promise((resolve, reject) => {
             let escapedAss = assFilePath.replace(/\\/g, '/').replace(/:/g, '\\\\:');
             ffmpeg(currentInput)
               .videoFilters(`ass='${escapedAss}'`)
               .outputOptions([...gpuArgs, '-c:a', 'aac'])
               .on('end', resolve).on('error', reject).save(trackedSubs);
          });
       }
       
       // Concat hook and trackedSubs
       // Create a concat text file
       const concatTxtPath = path.join(tempDir, `${baseName}_concat.txt`);
       const hookPathFFmpeg = hookPath.replace(/\\/g, '/');
       const trackedSubsFFmpeg = trackedSubs.replace(/\\/g, '/');
       fs.writeFileSync(concatTxtPath, `file '${hookPathFFmpeg}'\nfile '${trackedSubsFFmpeg}'`);
       
       await new Promise((resolve, reject) => {
          ffmpeg()
            .input(concatTxtPath)
            .inputOptions(['-f concat', '-safe 0'])
            .outputOptions(['-c copy']) // Since they are encoded identically, we can stream copy!
            .on('end', resolve).on('error', reject).save(outputPath);
       });
       
       if (fs.existsSync(concatTxtPath)) fs.unlinkSync(concatTxtPath);
       if (trackedSubs !== currentInput && fs.existsSync(trackedSubs)) fs.unlinkSync(trackedSubs);
       if (fs.existsSync(hookPath)) fs.unlinkSync(hookPath);
    } else {
       await new Promise((resolve, reject) => {
         let cmd = ffmpeg(currentInput);
         
         if (assFilePath) {
            let escapedAss = assFilePath.replace(/\\/g, '/').replace(/:/g, '\\\\:');
            cmd = cmd.videoFilters(`ass='${escapedAss}'`);
         }
         
         cmd.outputOptions([...gpuArgs, '-c:a', 'aac'])
            .on('end', resolve)
            .on('error', reject)
            .save(outputPath);
       });
    }

    // Cleanup Temporary Files
    if (fs.existsSync(trimmedPath)) fs.unlinkSync(trimmedPath);
    if (isVertical && currentInput !== trimmedPath && fs.existsSync(currentInput)) fs.unlinkSync(currentInput);
    if (assFilePath && fs.existsSync(assFilePath)) fs.unlinkSync(assFilePath);

    console.log(`Finished rendering: ${outputPath}`);
    
    await prisma.clip.create({
      data: {
        title: `Smart Clip from ${videoId}`,
        storagePath: `/renders/${path.basename(outputPath)}`,
        duration: duration || 0,
        startTime: startTime || 0,
        endTime: (startTime || 0) + (duration || 0),
        status: 'COMPLETED',
        videoId: videoId
      }
    });

    return outputPath;
  } catch (error) {
    console.error('Pipeline error:', error);
  }
}
