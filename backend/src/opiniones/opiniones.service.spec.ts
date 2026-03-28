import { Test, TestingModule } from '@nestjs/testing';
import { OpinionesService } from './opiniones.service';

describe('OpinionesService', () => {
  let service: OpinionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpinionesService],
    }).compile();

    service = module.get<OpinionesService>(OpinionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
