import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Cloudinary', () => {
  let provider: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    provider = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
