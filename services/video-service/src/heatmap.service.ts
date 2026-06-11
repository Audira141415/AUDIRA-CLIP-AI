import { Injectable, Logger } from '@nestjs/common';

export interface HeatmapSegment {
  start: number;
  duration: number;
  score: number;
  title?: string;
}

@Injectable()
export class HeatmapService {
  private readonly logger = new Logger(HeatmapService.name);

  /**
   * Fetch and parse YouTube 'Most Replayed' heatmap data without API.
   * Returns a list of high-engagement segments.
   */
  async getMostReplayed(videoId: string, minScore: number = 0.40): Promise<HeatmapSegment[]> {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    this.logger.log(`Fetching heatmap data for video ID: ${videoId}`);

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(20000) // 20 seconds timeout
      });

      if (!response.ok) {
        this.logger.warn(`Failed to fetch YouTube page, status: ${response.status}`);
        return [];
      }

      const html = await response.text();

      // Regex to find markers
      const match = html.match(/"markers":\s*(\[.*?\])\s*,\s*"?markersMetadata"?/s);
      
      if (!match || !match[1]) {
        this.logger.debug(`No heatmap markers found in HTML for ${videoId}`);
        return [];
      }

      let markers;
      try {
        // Clean up escaped quotes
        const jsonStr = match[1].replace(/\\"/g, '"');
        markers = JSON.parse(jsonStr);
      } catch (err) {
        this.logger.error(`Error parsing heatmap JSON: ${err.message}`);
        return [];
      }

      const results: HeatmapSegment[] = [];

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
            duration: Math.min(durationMillis / 1000, 60), // Cap duration at 60s per segment base
            score: score
          });
        }
      }

      // Sort by highest score first
      results.sort((a, b) => b.score - a.score);
      
      this.logger.log(`Found ${results.length} high-engagement segments above score ${minScore}`);
      return results;

    } catch (error) {
      this.logger.error(`Failed to fetch heatmap data: ${error.message}`);
      return [];
    }
  }

  /**
   * Helper to extract Video ID from various YouTube URL formats
   */
  extractVideoId(url: string): string | null {
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
    } catch (e) {
      return null;
    }
  }
}
