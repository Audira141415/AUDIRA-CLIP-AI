export interface ReframingConfig {
    mode: 'auto_face' | 'center' | 'manual' | 'split_left' | 'split_right';
    manualXOffset?: number;
}
export declare class AITracker {
    private logger;
    getDynamicCropFilter(aspectRatio: string, config?: ReframingConfig): string;
}
