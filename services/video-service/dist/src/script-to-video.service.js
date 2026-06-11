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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var ScriptToVideoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptToVideoService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const broll_service_1 = require("./broll.service");
const subtitle_generator_1 = require("./subtitle-generator");
const ffmpeg = require('fluent-ffmpeg');
let ScriptToVideoService = ScriptToVideoService_1 = class ScriptToVideoService {
    logger = new common_1.Logger(ScriptToVideoService_1.name);
    brollService = new broll_service_1.BRollService();
    async generateVideoFromScript(script) {
        this.logger.log(`Generating video from script: ${script.substring(0, 50)}...`);
        const id = Date.now().toString();
        const sentences = script.split('.').filter(s => s.trim().length > 0);
        const scenes = sentences.map((sentence, i) => {
            const words = sentence.split(' ');
            const keyword = words[Math.floor(Math.random() * words.length)].replace(/[^a-zA-Z]/g, '');
            return { id: i, text: sentence.trim(), keyword: keyword || 'abstract' };
        });
        const audioLength = scenes.length * 3;
        const audioPath = path.join(process.cwd(), 'uploads', `tts-${id}.mp3`);
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input('anullsrc')
                .inputFormat('lavfi')
                .duration(audioLength)
                .audioCodec('libmp3lame')
                .output(audioPath)
                .on('end', () => resolve())
                .on('error', (err) => reject(new Error(`TTS generation failed: ${err.message}`)))
                .run();
        });
        const brollPaths = [];
        for (const scene of scenes) {
            const brollPath = await this.brollService.fetchBRoll(scene.keyword, 3);
            brollPaths.push(brollPath);
        }
        const concatListPath = path.join(process.cwd(), 'uploads', `concat-${id}.txt`);
        const fileContent = brollPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
        fs.writeFileSync(concatListPath, fileContent);
        const mergedVideoPath = path.join(process.cwd(), 'uploads', `merged-${id}.mp4`);
        await new Promise((resolve, reject) => {
            ffmpeg()
                .input(concatListPath)
                .inputOptions(['-f concat', '-safe 0'])
                .outputOptions(['-c copy'])
                .output(mergedVideoPath)
                .on('end', () => resolve())
                .on('error', (err) => reject(new Error(`Concat failed: ${err.message}`)))
                .run();
        });
        const transcript = scenes.map((s, i) => ({
            start: i * 3,
            end: (i * 3) + 3,
            text: s.text
        }));
        const assPath = subtitle_generator_1.SubtitleGenerator.generateAssSubtitles(id, transcript, 0, audioLength);
        const finalOutputPath = path.join(process.cwd(), 'uploads', `script2video-${id}.mp4`);
        const escapedSrtPath = assPath.replace(/\\/g, '/').replace(':', '\\\\:');
        const fontsDir = 'fonts';
        await new Promise((resolve, reject) => {
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
                .on('error', (err) => reject(new Error(`Final assembly failed: ${err.message}`)))
                .run();
        });
        this.logger.log(`Script-to-Video generation complete: ${finalOutputPath}`);
        return finalOutputPath;
    }
};
exports.ScriptToVideoService = ScriptToVideoService;
exports.ScriptToVideoService = ScriptToVideoService = ScriptToVideoService_1 = __decorate([
    (0, common_1.Injectable)()
], ScriptToVideoService);
//# sourceMappingURL=script-to-video.service.js.map