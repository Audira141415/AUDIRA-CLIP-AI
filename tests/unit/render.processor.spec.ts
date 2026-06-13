import { Test, TestingModule } from '@nestjs/testing';
import { RenderProcessor } from '../../services/rendering-service/src/render.processor';
import { FfmpegService } from '../../services/rendering-service/src/ffmpeg.service';

describe('RenderProcessor', () => {
  let processor: RenderProcessor;

  const mockFfmpegService = {
    processVerticalClip: jest.fn().mockResolvedValue('output.mp4'),
  };

  const mockGatewayClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenderProcessor,
        {
          provide: FfmpegService,
          useValue: mockFfmpegService,
        },
        {
          provide: 'GATEWAY_SERVICE',
          useValue: mockGatewayClient,
        }
      ],
    }).compile();

    processor = module.get<RenderProcessor>(RenderProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  it('should process a render job', async () => {
    const mockJob: any = {
      id: 'job1',
      data: {
        inputPath: 'in.mp4',
        outputPath: 'out.mp4',
        startTime: 0,
        duration: 10
      },
      updateProgress: jest.fn()
    };

    const result = await processor.process(mockJob);
    expect(result).toEqual({ status: 'COMPLETED', url: 'output.mp4' });
    expect(mockFfmpegService.processVerticalClip).toHaveBeenCalled();
  });
});
