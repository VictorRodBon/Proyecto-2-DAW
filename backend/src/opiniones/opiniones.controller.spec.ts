import { Test, TestingModule } from '@nestjs/testing';
import { OpinionesController } from './opiniones.controller';
import { OpinionesService } from './opiniones.service';

describe('OpinionesController', () => {
  let controller: OpinionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpinionesController],
      providers: [OpinionesService],
    }).compile();

    controller = module.get<OpinionesController>(OpinionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
