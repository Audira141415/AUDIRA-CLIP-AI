import { ClientProxy } from '@nestjs/microservices';
export declare class AppController {
    private authClient;
    constructor(authClient: ClientProxy);
    getUser(id: string): import("rxjs").Observable<any>;
}
