import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getVideoStatus(data: {
        videoId: string;
    }): {
        id: string;
        status: string;
        progress: number;
    };
}
