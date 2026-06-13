import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS so Next.js frontend can communicate with this service
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Video Service API')
    .setDescription('Internal Video API for AUDIRA-CLIP-AI')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

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
  await app.listen(3345);
  console.log('Video Microservice is listening on HTTP port 3345 and Redis');
}
bootstrap();
