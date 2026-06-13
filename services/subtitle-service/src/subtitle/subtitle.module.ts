import { Module } from '@nestjs/common';
import { SubtitleController } from './subtitle.controller';
import { SubtitleService } from './subtitle.service';
import { SubtitleGateway } from './subtitle.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [SubtitleController],
  providers: [SubtitleService, PrismaService, SubtitleGateway],
})
export class SubtitleModule {}
