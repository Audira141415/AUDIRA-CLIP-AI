import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_user' })
  getUser(data: { userId: string }) {
    // Mock user response for Phase 2 integration test
    return { id: data.userId, email: 'admin@audira.ai', name: 'Admin', role: 'OWNER' };
  }
}
