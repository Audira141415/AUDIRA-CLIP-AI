import { NestFactory } from '@nestjs/core';
import { Module, Controller, Post, Body } from '@nestjs/common';

@Controller('events')
class AnalyticsController {
  @Post('track')
  trackEvent(@Body() payload: any) {
    // Save to Redis / Database
    console.log('Event tracked:', payload);
    return { success: true };
  }
}

@Module({
  controllers: [AnalyticsController],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3003);
  console.log('Analytics Service is running on port 3003');
}
bootstrap();
