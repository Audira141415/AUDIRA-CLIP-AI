"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HeatmapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapService = void 0;
const common_1 = require("@nestjs/common");
let HeatmapService = HeatmapService_1 = class HeatmapService {
    logger = new common_1.Logger(HeatmapService_1.name);
    async getMostReplayed(videoId, minScore = 0.40) {
        const url = `https://www.youtube.com/watch?v=${videoId}`;
        this.logger.log(`Fetching heatmap data for video ID: ${videoId}`);
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                },
                signal: AbortSignal.timeout(20000)
            });
            if (!response.ok) {
                this.logger.warn(`Failed to fetch YouTube page, status: ${response.status}`);
                return [];
            }
            const html = await response.text();
            const match = html.match(/"markers":\s*(\[.*?\])\s*,\s*"?markersMetadata"?/s);
            if (!match || !match[1]) {
                this.logger.debug(`No heatmap markers found in HTML for ${videoId}`);
                return [];
            }
            let markers;
            try {
                const jsonStr = match[1].replace(/\\"/g, '"');
                markers = JSON.parse(jsonStr);
            }
            catch (err) {
                this.logger.error(`Error parsing heatmap JSON: ${err.message}`);
                return [];
            }
            const results = [];
            for (let marker of markers) {
                if (marker.heatMarkerRenderer) {
                    marker = marker.heatMarkerRenderer;
                }
                const score = parseFloat(marker.intensityScoreNormalized || 0);
                if (score >= minScore) {
                    const startMillis = parseFloat(marker.timeRangeStartMillis || marker.startMillis || 0);
                    const durationMillis = parseFloat(marker.durationMillis || 0);
                    results.push({
                        start: startMillis / 1000,
                        duration: Math.min(durationMillis / 1000, 60),
                        score: score
                    });
                }
            }
            results.sort((a, b) => b.score - a.score);
            this.logger.log(`Found ${results.length} high-engagement segments above score ${minScore}`);
            return results;
        }
        catch (error) {
            this.logger.error(`Failed to fetch heatmap data: ${error.message}`);
            return [];
        }
    }
    extractVideoId(url) {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname === 'youtu.be' || parsedUrl.hostname === 'www.youtu.be') {
                return parsedUrl.pathname.substring(1);
            }
            if (parsedUrl.hostname === 'youtube.com' || parsedUrl.hostname === 'www.youtube.com') {
                if (parsedUrl.pathname === '/watch') {
                    return parsedUrl.searchParams.get('v');
                }
                if (parsedUrl.pathname.startsWith('/shorts/')) {
                    return parsedUrl.pathname.split('/')[2];
                }
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
};
exports.HeatmapService = HeatmapService;
exports.HeatmapService = HeatmapService = HeatmapService_1 = __decorate([
    (0, common_1.Injectable)()
], HeatmapService);
//# sourceMappingURL=heatmap.service.js.map