import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS so Next.js frontend can communicate with this service
  app.enableCors();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryAttempts: 10,
      retryDelay: 3000,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
  console.log('Video Microservice is listening on HTTP port 3001 and Redis');
}
bootstrap();
