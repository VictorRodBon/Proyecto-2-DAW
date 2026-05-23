import { Test, TestingModule } from '@nestjs/testing';
import { OpinionesService } from './opiniones.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
describe('OpinionesService', () => {
  let service: OpinionesService;
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
      providers: [
        OpinionesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<OpinionesService>(OpinionesService);
  });
  afterEach(() => jest.clearAllMocks());
  describe('create', () => {
    it('debe crear una opinión', async () => {
      const dto = {
        id_usuario: 'user-1',
        id_libro: '/works/OL123W',
        puntuacion: 4,
        valoracion: 'Buen libro',
      };
      const created = {
        id_opinion: 1,
        ...dto,
        fecha_creacion: new Date(),
      };
      mockPrisma.opiniones.create.mockResolvedValue(created);
      const result = await service.create(dto);
      expect(result).toEqual(created);
      expect(mockPrisma.opiniones.create).toHaveBeenCalledWith({
        data: dto,
      });
    });
  });
  describe('findByLibro', () => {
    it('debe devolver opiniones ordenadas por fecha', async () => {
      const opinions = [
        {
          id_opinion: 2,
          id_libro: '/works/OL123W',
          puntuacion: 5,
          fecha_creacion: new Date('2025-01-02'),
        },
        {
          id_opinion: 1,
          id_libro: '/works/OL123W',
          puntuacion: 3,
          fecha_creacion: new Date('2025-01-01'),
        },
      ];
      mockPrisma.opiniones.findMany.mockResolvedValue(opinions);
      const result = await service.findByLibro('/works/OL123W');
      expect(result).toHaveLength(2);
      expect(mockPrisma.opiniones.findMany).toHaveBeenCalledWith({
        where: { id_libro: '/works/OL123W' },
        orderBy: { fecha_creacion: 'desc' },
      });
    });
  });
  describe('update', () => {
    it('debe actualizar una opinión existente', async () => {
      const existing = { id_opinion: 1, puntuacion: 3, valoracion: 'OK' };
      mockPrisma.opiniones.findUnique.mockResolvedValue(existing);
      mockPrisma.opiniones.update.mockResolvedValue({
        ...existing,
        puntuacion: 5,
      });
      const result = await service.update(1, { puntuacion: 5 });
      expect(result.puntuacion).toBe(5);
    });
    it('debe lanzar NotFoundException si la opinión no existe', async () => {
      mockPrisma.opiniones.findUnique.mockResolvedValue(null);
      await expect(
        service.update(999, {
          puntuacion: 5,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('debe eliminar una opinión existente', async () => {
      mockPrisma.opiniones.findUnique.mockResolvedValue({ id_opinion: 1 });
      mockPrisma.opiniones.delete.mockResolvedValue({ id_opinion: 1 });
      const result = await service.remove(1);
      expect(result).toEqual({
        message: 'Opinión #1 eliminada correctamente',
      });
    });
    it('debe lanzar NotFoundException al eliminar una opinión inexistente', async () => {
      mockPrisma.opiniones.findUnique.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
