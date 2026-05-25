import { Test, TestingModule } from '@nestjs/testing';
import { OpinionesController } from './opiniones.controller';
import { OpinionesService } from './opiniones.service';
import { PrismaService } from '../prisma/prisma.service';

describe('OpinionesController', () => {
  let controller: OpinionesController;

  const mockPrisma = {
    opiniones: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpinionesController],
      providers: [
        OpinionesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    controller = module.get<OpinionesController>(OpinionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
