import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_video_status' })
  getVideoStatus(data: { videoId: string }) {
    return { id: data.videoId, status: 'PROCESSING', progress: 45 };
  }
}
