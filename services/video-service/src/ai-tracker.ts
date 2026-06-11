import { Logger } from '@nestjs/common';

export interface ReframingConfig {
  mode: 'auto_face' | 'center' | 'manual' | 'split_left' | 'split_right';
  manualXOffset?: number; // 0 to 100 percentage
}

export class AITracker {
  private logger = new Logger(AITracker.name);

  /**
   * Generates a dynamic FFmpeg crop filter or complex filter string.
   */
  getDynamicCropFilter(aspectRatio: string, config: ReframingConfig = { mode: 'auto_face' }): string {
    this.logger.log(`Applying AI Reframing filter: ${aspectRatio} | Mode: ${config.mode}`);

    let baseFilter = '';

    if (aspectRatio === "9:16") {
      if (config.mode === 'split_left' || config.mode === 'split_right') {
        const out_w = 720;
        const out_h = 1280;
        const top_h = 960;
        const bottom_h = 320;
        const x_offset_bottom = config.mode === 'split_left' ? '0' : `iw-${out_w}`;

        // Uses a scale to fit either height or width, then splits and crops top and bottom, stacking them.
        baseFilter = `scale='if(gte(iw/ih,${out_w}/${out_h}),-2,${out_w})':'if(gte(iw/ih,${out_w}/${out_h}),${out_h},-2)'[scaled];[scaled]split=2[s1][s2];[s1]crop=${out_w}:${top_h}:(iw-${out_w})/2:(ih-${out_h})/2[top];[s2]crop=${out_w}:${bottom_h}:${x_offset_bottom}:ih-${bottom_h}[bottom];[top][bottom]vstack[out]`;
      } else if (config.mode === 'center') {
        // Static Center Crop
        baseFilter = 'crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-ow)/2:(in_h-oh)/2';
      } else if (config.mode === 'manual') {
        // Manual Pan based on X Offset (0-100)
        const offsetMultiplier = (config.manualXOffset ?? 50) / 100;
        baseFilter = `crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-ow)*${offsetMultiplier}:(in_h-oh)/2`;
      } else {
        // OpusClip Killer: Default to stable Center Crop for fast previews.
        // During final export, the Python OpenCV Tracker will take over for dynamic tracking!
        baseFilter = `crop=min(in_w\\,in_h*9/16):min(in_h\\,in_w*16/9):(in_w-ow)/2:(in_h-oh)/2`;
      }
    } else if (aspectRatio === "1:1") {
      // Static center for square
      baseFilter = 'crop=min(in_w\\,in_h):min(in_w\\,in_h):(in_w-ow)/2:(in_h-oh)/2';
    } else if (aspectRatio === "16:9") {
      baseFilter = 'crop=min(in_w\\,in_h*16/9):min(in_h\\,in_w*9/16):(in_w-ow)/2:(in_h-oh)/2';
    }

    if (!baseFilter) {
      baseFilter = 'null';
    }

    return baseFilter;
  }
}
