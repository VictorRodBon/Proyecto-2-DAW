import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
//import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;

  const mockPrisma = {
    usuario: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => jest.clearAllMocks());

  it('debe devolver un usuario existente', async () => {
    const fakeUser = {
      id: 'user-1',
      nombre_usuario: 'testuser',
      estado: 'activo',
      foto_perfil: null,
      fecha_creacion: new Date(),
    };
    mockPrisma.usuario.findUnique.mockResolvedValue(fakeUser);

    const result = await service.findMe('user-1');
    expect(result).toEqual(fakeUser);
    expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: expect.any(Object),
    });
  });

  it('debe lanzar NotFoundException si el usuario no existe', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(null);

    await expect(service.findMe('no-existe')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debe actualizar un usuario existente', async () => {
    const dto = { nombre_usuario: 'nuevoNombre' };
    const updatedUser = {
      id: 'user-1',
      nombre_usuario: 'nuevoNombre',
      estado: 'activo',
      rol: 'usuario',
      foto_perfil: null,
      fecha_creacion: new Date(),
    };

    mockPrisma.usuario.findUnique.mockResolvedValue(updatedUser);
    mockPrisma.usuario.update.mockResolvedValue(updatedUser);

    const result = await service.updateMe('user-1', dto);
    expect(result.nombre_usuario).toBe('nuevoNombre');
  });
});
