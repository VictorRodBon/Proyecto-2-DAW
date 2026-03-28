import { Test, TestingModule } from '@nestjs/testing';
import { LecturasService } from './lecturas.service';

describe('LecturasService', () => {
  let service: LecturasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LecturasService],
    }).compile();

    service = module.get<LecturasService>(LecturasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
