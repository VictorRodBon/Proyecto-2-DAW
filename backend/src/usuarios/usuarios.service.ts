import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /usuarios/me
  async findMe(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre_usuario: true,
        estado: true,
        rol: true,
        foto_perfil: true,
        fecha_creacion: true,
      },
    });
    if (!usuario) throw new NotFoundException(`Usuario #${id} no encontrado`);
    return usuario;
  }

  // PATCH /usuarios/me
  async updateMe(id: string, dto: UpdateUsuarioDto) {
    await this.findMe(id);
    return this.prisma.usuario.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        nombre_usuario: true,
        estado: true,
        rol: true,
        foto_perfil: true,
        fecha_creacion: true,
      },
    });
  }
}
