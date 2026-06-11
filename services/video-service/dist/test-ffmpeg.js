"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
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
    await new Promise((resolve, reject) => {
        ffmpeg(inputVideo)
            .setStartTime(10)
            .setDuration(2)
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
            .on('progress', (progress) => {
            console.log(`Processing: ${progress.percent ? progress.percent.toFixed(2) : '??'}% done`);
        })
            .on('end', () => resolve())
            .on('error', (err, stdout, stderr) => {
            console.error("FFMPEG ERROR:", err.message);
            console.error("STDERR:", stderr);
            reject(err);
        })
            .run();
    });
    console.log("\n=== TEST COMPLETED SUCCESSFULLY! ===");
    console.log("Running FFprobe to verify output resolution...");
    await new Promise((resolve) => {
        ffmpeg.ffprobe(outputVideo, (err, metadata) => {
            if (err) {
                console.error("FFPROBE ERROR:", err);
                resolve();
                return;
            }
            const stream = metadata.streams.find((s) => s.codec_type === 'video');
            console.log(`VERIFIED RESOLUTION: ${stream.width}x${stream.height}`);
            if (stream.height > stream.width) {
                console.log("SUCCESS! Video is mathematically PORTRAIT (Vertical/9:16)!");
            }
            else {
                console.log("FAILED! Video is still LANDSCAPE (Horizontal)!");
            }
            resolve();
        });
    });
}
testExport();
//# sourceMappingURL=test-ffmpeg.js.map