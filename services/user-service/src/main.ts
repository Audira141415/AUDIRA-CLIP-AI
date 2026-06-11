import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';

@Controller('users')
class UserController {
  @Get('profile')
  getProfile() {
    return { id: 'u_123', name: 'Demo User', tier: 'Pro' };
  }
}

@Module({
  controllers: [UserController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
  console.log('User Service is running on port 3001');
}
bootstrap();
