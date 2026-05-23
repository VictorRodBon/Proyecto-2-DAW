import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  const mockService = {
    findMe: jest.fn(),
    updateMe: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: mockService }],
    }).compile();
    controller = module.get<UsuariosController>(UsuariosController);
  });
  it('GET /me/:id debe llamar al servicio', async () => {
    mockService.findMe.mockResolvedValue({
      id: 'user-1',
      nombre_usuario: 'test',
    });
    const result = await controller.findMe('user-1');
    expect(mockService.findMe).toHaveBeenCalledWith('user-1');
    expect(result).toEqual({ id: 'user-1', nombre_usuario: 'test' });
  });
});
