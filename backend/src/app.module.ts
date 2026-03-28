import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { OpinionesModule } from './opiniones/opiniones.module';
import { LecturasModule } from './lecturas/lecturas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    OpinionesModule,
    LecturasModule,
    UsuariosModule,
  ],
})
export class AppModule {}