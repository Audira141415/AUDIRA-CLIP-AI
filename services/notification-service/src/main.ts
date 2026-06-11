import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('ping')
  handlePing(client: any, payload: any) {
    return 'pong';
  }
}

@Module({
  providers: [NotificationGateway],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3002);
  console.log('Notification Service (WS) running on port 3002');
}
bootstrap();
