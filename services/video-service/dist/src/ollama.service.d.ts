import { TranscriptSegment } from './transcription.service';
export declare class OllamaService {
    private readonly logger;
    private readonly OLLAMA_URL;
    private readonly MODEL;
    private fetchWithRetry;
    generateClipTitles(topic: string, intent: string): Promise<string[]>;
    private getFallbackClips;
    mapVideoChapters(transcript: TranscriptSegment[], duration: number): Promise<any[]>;
    analyzeTranscriptForClips(transcript: TranscriptSegment[], intent: string, duration: number, chapters?: any[]): Promise<any[]>;
    proofreadTranscript(transcript: TranscriptSegment[]): Promise<TranscriptSegment[]>;
}
