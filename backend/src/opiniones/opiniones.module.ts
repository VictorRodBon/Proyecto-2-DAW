import { Module } from '@nestjs/common';
import { OpinionesService } from './opiniones.service';
import { OpinionesController } from './opiniones.controller';

@Module({
  controllers: [OpinionesController],
  providers: [OpinionesService],
})
export class OpinionesModule {}
