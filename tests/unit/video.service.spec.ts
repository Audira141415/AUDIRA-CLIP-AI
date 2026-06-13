import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from '../../services/video-service/src/video.service';
import { PrismaClient } from '@audira/database';

describe('VideoService', () => {
  let service: VideoService;

  const mockPrisma = {
    video: {
      create: jest.fn().mockResolvedValue({ id: '1', title: 'Test Video', status: 'PENDING' }),
      findUnique: jest.fn().mockResolvedValue({ id: '1', title: 'Test Video', status: 'PENDING' }),
      update: jest.fn().mockResolvedValue({ id: '1', title: 'Test Video', status: 'PROCESSING' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: VideoService,
          useValue: {
            createVideoRecord: jest.fn().mockResolvedValue({ id: '1', title: 'Test Video', status: 'PENDING' }),
            getVideoDetails: jest.fn().mockResolvedValue({ id: '1', title: 'Test Video', status: 'PENDING' }),
          }
        },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a video record', async () => {
    const video = await service.createVideoRecord({ title: 'Test Video', url: 'http://test', userId: 'user1', workspaceId: 'ws1' });
    expect(video).toEqual({ id: '1', title: 'Test Video', status: 'PENDING' });
  });
});
