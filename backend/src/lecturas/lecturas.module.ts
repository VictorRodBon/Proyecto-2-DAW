import { Module } from '@nestjs/common';
import { LecturasService } from './lecturas.service';
import { LecturasController } from './lecturas.controller';

@Module({
  controllers: [LecturasController],
  providers: [LecturasService],
})
export class LecturasModule {}
