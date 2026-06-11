import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Controller()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Extract userId from handshake auth/headers in production
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Listen to TCP/Redis messages from other microservices
  @MessagePattern({ cmd: 'job_progress' })
  handleJobProgress(data: { jobId: string; progress: number; status: string }) {
    console.log(`Broadcasting progress to clients: ${data.jobId} - ${data.progress}%`);
    // Emit to all connected clients (or a specific user room in production)
    this.server.emit('job_progress', data);
  }
}
