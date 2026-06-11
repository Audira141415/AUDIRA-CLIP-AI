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
const ffmpeg = require('fluent-ffmpeg');
let BRollService = BRollService_1 = class BRollService {
    logger = new common_1.Logger(BRollService_1.name);
    async fetchBRoll(keyword, duration = 3) {
        this.logger.log(`Fetching B-Roll for keyword: "${keyword}", duration: ${duration}s`);
        const filename = `broll-${keyword.replace(/[^a-zA-Z0-9]/g, '_')}-${Date.now()}.mp4`;
        const outputPath = path.join(process.cwd(), 'uploads', filename);
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
                .on('error', (err) => reject(new Error(`Failed to generate mock B-Roll: ${err.message}`)))
                .run();
        });
        this.logger.log(`B-Roll downloaded to ${outputPath}`);
        return outputPath;
    }
};
exports.BRollService = BRollService;
exports.BRollService = BRollService = BRollService_1 = __decorate([
    (0, common_1.Injectable)()
], BRollService);
//# sourceMappingURL=broll.service.js.map