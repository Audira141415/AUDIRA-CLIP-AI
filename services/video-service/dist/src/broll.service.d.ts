export declare class BRollService {
    private readonly logger;
    private readonly PEXELS_API_KEY;
    fetchBRoll(keyword: string, duration?: number): Promise<string>;
}
