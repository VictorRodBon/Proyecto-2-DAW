import { Test, TestingModule } from '@nestjs/testing';
import { LecturasController } from './lecturas.controller';
import { LecturasService } from './lecturas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LecturasController', () => {
  let controller: LecturasController;

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
      controllers: [LecturasController],
      providers: [
        LecturasService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<LecturasController>(LecturasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
