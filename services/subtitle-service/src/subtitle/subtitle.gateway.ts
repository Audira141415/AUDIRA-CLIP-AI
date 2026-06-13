import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SubtitleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SubtitleGateway.name);
  // Map client socket ID to their python AI WebSocket connection
  private aiConnections: Map<string, WebSocket> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    
    // Connect to Python AI Engine
    const aiWs = new WebSocket('ws://localhost:8000/api/stream');
    
    aiWs.on('open', () => {
      this.logger.log(`Connected to AI Engine for client ${client.id}`);
    });

    aiWs.on('message', (data: WebSocket.RawData) => {
      try {
        const result = JSON.parse(data.toString());
        // Forward the result back to the frontend
        client.emit('transcript', result);
      } catch (err) {
        this.logger.error('Failed to parse AI response', err);
      }
    });

    aiWs.on('close', () => {
      this.logger.log(`AI Engine disconnected for client ${client.id}`);
    });

    aiWs.on('error', (err) => {
      this.logger.error(`AI Engine error for client ${client.id}:`, err);
    });

    this.aiConnections.set(client.id, aiWs);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const aiWs = this.aiConnections.get(client.id);
    if (aiWs) {
      if (aiWs.readyState === WebSocket.OPEN) {
        aiWs.close();
      }
      this.aiConnections.delete(client.id);
    }
  }

  @SubscribeMessage('audio_chunk')
  handleAudioChunk(
    @MessageBody() data: Buffer,
    @ConnectedSocket() client: Socket,
  ) {
    const aiWs = this.aiConnections.get(client.id);
    if (aiWs && aiWs.readyState === WebSocket.OPEN) {
      // Forward the raw audio chunk to the AI engine
      aiWs.send(data);
    }
  }
}
