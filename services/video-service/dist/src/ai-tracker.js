"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITracker = void 0;
const common_1 = require("@nestjs/common");
class AITracker {
    logger = new common_1.Logger(AITracker.name);
    getDynamicCropFilter(aspectRatio, config = { mode: 'auto_face' }) {
        this.logger.log(`Applying AI Reframing filter: ${aspectRatio} | Mode: ${config.mode}`);
        let baseFilter = '';
        if (aspectRatio === "9:16") {
            if (config.mode === 'split_left' || config.mode === 'split_right') {
                const out_w = 720;
                const out_h = 1280;
                const top_h = 960;
                const bottom_h = 320;
                const x_offset_bottom = config.mode === 'split_left' ? '0' : `iw-${out_w}`;
                baseFilter = `scale='if(gte(iw/ih,${out_w}/${out_h}),-2,${out_w})':'if(gte(iw/ih,${out_w}/${out_h}),${out_h},-2)'[scaled];[scaled]split=2[s1][s2];[s1]crop=${out_w}:${top_h}:(iw-${out_w})/2:(ih-${out_h})/2[top];[s2]crop=${out_w}:${bottom_h}:${x_offset_bottom}:ih-${bottom_h}[bottom];[top][bottom]vstack[out]`;
            }
            else if (config.mode === 'center') {
                baseFilter = 'crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-ow)/2:(in_h-oh)/2';
            }
            else if (config.mode === 'manual') {
                const offsetMultiplier = (config.manualXOffset ?? 50) / 100;
                baseFilter = `crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-ow)*${offsetMultiplier}:(in_h-oh)/2`;
            }
            else {
                baseFilter = `crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-ow)/2:(in_h-oh)/2`;
            }
        }
        else if (aspectRatio === "1:1") {
            baseFilter = 'crop=min(in_w\\,in_h):min(in_w\\,in_h):(in_w-ow)/2:(in_h-oh)/2';
        }
        else if (aspectRatio === "16:9") {
            baseFilter = 'crop=min(in_w\\,in_h*16/9):min(in_h\\,in_w*9/16):(in_w-ow)/2:(in_h-oh)/2';
        }
        if (!baseFilter) {
            baseFilter = 'null';
        }
        return baseFilter;
    }
}
exports.AITracker = AITracker;
//# sourceMappingURL=ai-tracker.js.map