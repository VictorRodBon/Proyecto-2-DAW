import { Test, TestingModule } from '@nestjs/testing';
import { OpinionesService } from './opiniones.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('OpinionesService (integracion)', () => {
  let service: OpinionesService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [OpinionesService],
    }).compile();
    service = module.get<OpinionesService>(OpinionesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.opiniones.deleteMany();
  });
  afterAll(async () => {
    await prisma.$disconnect();
  });
  it('debe crear y recuperar opiniones por libro', async () => {
    const dto = {
      id_usuario: '05431d5a-6746-4d9a-9cf6-6f7bd28f0fda',
      id_libro: '/works/OL123W',
      puntuacion: 5,
      valoracion: 'Excelente',
    };
    const created = await service.create(dto);
    expect(created.id_opinion).toBeDefined();
    expect(created.puntuacion).toBe(5);
    const opinions = await service.findByLibro('/works/OL123W');
    expect(opinions).toHaveLength(1);
    expect(opinions[0].valoracion).toBe('Excelente');
  });
});
