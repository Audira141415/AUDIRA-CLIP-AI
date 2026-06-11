export interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
}
export declare class TranscriptionService {
    private readonly logger;
    private transcriber;
    transcribeReal(videoPath: string, onProgress?: (sec: number) => void, lang?: string): Promise<TranscriptSegment[]>;
}
