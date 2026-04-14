import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOpinioneDto } from './dto/create-opinione.dto';
import { UpdateOpinioneDto } from './dto/update-opinione.dto';

@Injectable()
export class OpinionesService {
  constructor(private readonly prisma: PrismaService) {}

  // POST /opiniones
  create(dto: CreateOpinioneDto) {
    return this.prisma.opiniones.create({
      data: {
        id_usuario: dto.id_usuario,
        id_libro: dto.id_libro,
        puntuacion: dto.puntuacion,
        valoracion: dto.valoracion,
      },
    });
  }

  // GET /opiniones/libro/:id_libro
  findByLibro(id_libro: string) {
    return this.prisma.opiniones.findMany({
      where: { id_libro },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  // GET /opiniones/usuario/:id_usuario
  findByUsuario(id_usuario: string) {
    return this.prisma.opiniones.findMany({
      where: { id_usuario },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  // PATCH /opiniones/:id_opinion
  async update(id_opinion: number, dto: UpdateOpinioneDto) {
    const opinion = await this.prisma.opiniones.findUnique({
      where: { id_opinion: BigInt(id_opinion) },
    });
    if (!opinion)
      throw new NotFoundException(`Opinión #${id_opinion} no encontrada`);

    return this.prisma.opiniones.update({
      where: { id_opinion: BigInt(id_opinion) },
      data: dto,
    });
  }

  // DELETE /opiniones/:id_opinion
  async remove(id_opinion: number) {
    const opinion = await this.prisma.opiniones.findUnique({
      where: { id_opinion: BigInt(id_opinion) },
    });
    if (!opinion)
      throw new NotFoundException(`Opinión #${id_opinion} no encontrada`);

    await this.prisma.opiniones.delete({
      where: { id_opinion: BigInt(id_opinion) },
    });
    return { message: `Opinión #${id_opinion} eliminada correctamente` };
  }
}
