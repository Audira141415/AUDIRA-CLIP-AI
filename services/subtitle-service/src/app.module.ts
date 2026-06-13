import { Module } from '@nestjs/common';
import { SubtitleModule } from './subtitle/subtitle.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [SubtitleModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
