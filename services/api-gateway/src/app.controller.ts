import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('api/users')
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.authClient.send({ cmd: 'get_user' }, { userId: id });
  }
}
