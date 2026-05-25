import { Test, TestingModule } from '@nestjs/testing';
import { LecturasService } from './lecturas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LecturasService', () => {
  let service: LecturasService;

  const mockPrisma = {
    lecturas: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LecturasService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<LecturasService>(LecturasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
