export interface HeatmapSegment {
    start: number;
    duration: number;
    score: number;
    title?: string;
}
export declare class HeatmapService {
    private readonly logger;
    getMostReplayed(videoId: string, minScore?: number): Promise<HeatmapSegment[]>;
    extractVideoId(url: string): string | null;
}
