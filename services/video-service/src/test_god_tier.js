const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputVideo = path.join(process.cwd(), 'uploads', 'file-1781145688934-145894493.mp4');
const outVideo = path.join(process.cwd(), 'uploads', 'test-god-tier.mp4');
const bleepPath = path.join(process.cwd(), 'assets', 'bleep.wav').replace(/\\/g, '/');
const bgmPath = path.join(process.cwd(), 'assets', 'bgm', 'sad.mp3').replace(/\\/g, '/');

let command = ffmpeg(inputVideo).setStartTime(10).setDuration(10); // 10 seconds clip

// Inputs
command.input(bleepPath);
command.input(bgmPath).inputOptions(['-stream_loop', '-1']);

// Static crop for portrait
const cropFilter = "crop=ih*9/16:ih:(iw-ow)/2:0";

let filterGraph = [];

// 1. VISUAL CHAIN
filterGraph.push(`[0:v]${cropFilter}[out]`);
// Simulate Jump Zoom from second 3 to 6
filterGraph.push(`[out]split[base1][base2]`);
filterGraph.push(`[base2]scale=iw*1.2:ih*1.2,crop=iw/1.2:ih/1.2[zoomed]`);
filterGraph.push(`[base1][zoomed]overlay=0:0:enable='between(t,3.0,6.0)'[final_v]`);

// 2. AUDIO CHAIN
let audioOut = '[0:a]';
// Simulate Bleep Censor from second 4 to 5
filterGraph.push(`${audioOut}volume=0:enable='between(t,4.0,5.0)'[muted_v]`);
filterGraph.push(`[1:a]adelay=4000|4000[bleep0]`);
filterGraph.push(`[muted_v][bleep0]amix=inputs=2:duration=first:dropout_transition=0[censored_a]`);
audioOut = '[censored_a]';

// Simulate BGM Ducking
filterGraph.push(`[2:a]volume=0.3[bgm_low]`);
filterGraph.push(`${audioOut}[bgm_low]amix=inputs=2:duration=first:dropout_transition=2[ducked_a]`);
filterGraph.push(`[ducked_a]volume=1.0[final_a]`);

command = command.complexFilter(filterGraph)
    .outputOptions([
        '-map', '[final_v]',
        '-map', '[final_a]',
        '-preset', 'ultrafast'
    ])
    .videoCodec('libx264')
    .audioCodec('aac')
    .output(outVideo);

console.log("Building God-Tier Video...");
command.on('end', () => console.log('Done! Check uploads/test-god-tier.mp4'))
    .on('error', (err) => console.log('FFmpeg Error:', err.message))
    .run();
