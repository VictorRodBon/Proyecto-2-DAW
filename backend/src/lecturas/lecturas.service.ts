import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';

@Injectable()
export class LecturasService {
  constructor(private readonly prisma: PrismaService) {}

  // POST /lecturas
  create(id_usuario: string, dto: CreateLecturaDto) {
    return this.prisma.lecturasUsuarios.create({
      data: {
        id_usuario,
        id_libro: dto.id_libro,
        fecha_inicio: dto.fecha_inicio ? new Date(dto.fecha_inicio) : null,
        fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : null,
        estado: dto.estado,
      },
    });
  }

  // GET /lecturas/usuario/:id_usuario
  findByUsuario(id_usuario: string) {
    return this.prisma.lecturasUsuarios.findMany({
      where: { id_usuario },
      orderBy: { fecha_inicio: 'desc' },
    });
  }

  // PATCH /lecturas/:id_lectura
  async update(id_lectura: string, dto: UpdateLecturaDto) {
    const lectura = await this.prisma.lecturasUsuarios.findUnique({
      where: { id_lectura },
    });
    if (!lectura) throw new NotFoundException(`Lectura #${id_lectura} no encontrada`);

    return this.prisma.lecturasUsuarios.update({
      where: { id_lectura },
      data: {
        ...(dto.id_libro && { id_libro: dto.id_libro }),
        ...(dto.fecha_inicio && { fecha_inicio: new Date(dto.fecha_inicio) }),
        ...(dto.fecha_fin && { fecha_fin: new Date(dto.fecha_fin) }),
        ...(dto.estado && { estado: dto.estado }),
      },
    });
  }

  // DELETE /lecturas/:id_lectura
  async remove(id_lectura: string) {
    const lectura = await this.prisma.lecturasUsuarios.findUnique({
      where: { id_lectura },
    });
    if (!lectura) throw new NotFoundException(`Lectura #${id_lectura} no encontrada`);

    await this.prisma.lecturasUsuarios.delete({ where: { id_lectura } });
    return { message: `Lectura #${id_lectura} eliminada correctamente` };
  }
}