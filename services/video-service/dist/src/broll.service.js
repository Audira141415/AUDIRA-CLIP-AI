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
var BRollService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BRollService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const stream = __importStar(require("stream"));
const util_1 = require("util");
const ffmpeg = require('fluent-ffmpeg');
const pipeline = (0, util_1.promisify)(stream.pipeline);
let BRollService = BRollService_1 = class BRollService {
    logger = new common_1.Logger(BRollService_1.name);
    PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';
    async fetchBRoll(keyword, duration = 3) {
        this.logger.log(`Fetching B-Roll for keyword: "${keyword}", duration: ${duration}s`);
        const safeKeyword = keyword.replace(/[^a-zA-Z0-9\s]/g, '').trim().substring(0, 50);
        const filename = `broll-${safeKeyword.replace(/\s+/g, '_')}-${Date.now()}.mp4`;
        const outputPath = path.join(process.cwd(), 'uploads', filename);
        if (this.PEXELS_API_KEY) {
            try {
                this.logger.log(`Searching Pexels API for: ${safeKeyword}`);
                const searchUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(safeKeyword)}&per_page=15&orientation=portrait`;
                const response = await fetch(searchUrl, {
                    headers: { 'Authorization': this.PEXELS_API_KEY }
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.videos && data.videos.length > 0) {
                        const randomIndex = Math.floor(Math.random() * Math.min(5, data.videos.length));
                        const videoData = data.videos[randomIndex];
                        const videoFiles = videoData.video_files;
                        const targetFile = videoFiles.find((f) => f.quality === 'hd' && f.file_type === 'video/mp4')
                            || videoFiles.find((f) => f.quality === 'sd' && f.file_type === 'video/mp4')
                            || videoFiles[0];
                        if (targetFile && targetFile.link) {
                            this.logger.log(`Found Pexels Video ID ${videoData.id}. Downloading from: ${targetFile.link}`);
                            const videoResponse = await fetch(targetFile.link);
                            if (!videoResponse.ok)
                                throw new Error(`Failed to download from Pexels: ${videoResponse.statusText}`);
                            const arrayBuffer = await videoResponse.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);
                            fs.writeFileSync(outputPath, buffer);
                            this.logger.log(`Successfully downloaded real B-Roll to ${outputPath}`);
                            return outputPath;
                        }
                    }
                    else {
                        this.logger.warn(`Pexels returned no videos for keyword: ${safeKeyword}. Falling back to mock.`);
                    }
                }
                else {
                    this.logger.error(`Pexels API Error: ${response.status} ${response.statusText}`);
                }
            }
            catch (err) {
                this.logger.error(`Failed to fetch from Pexels: ${err.message}. Falling back to mock.`);
            }
        }
        else {
            this.logger.warn(`PEXELS_API_KEY not found in .env. Falling back to mock generated video.`);
        }
        const colors = ['darkblue', 'darkgreen', 'darkred', 'purple', 'black'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        await new Promise((resolve, reject) => {
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
                .on('error', (err) => reject(new Error(`Failed to generate mock B-Roll: ${err.message}`)))
                .run();
        });
        this.logger.log(`Fallback mock B-Roll generated at ${outputPath}`);
        return outputPath;
    }
};
exports.BRollService = BRollService;
exports.BRollService = BRollService = BRollService_1 = __decorate([
    (0, common_1.Injectable)()
], BRollService);
//# sourceMappingURL=broll.service.js.map