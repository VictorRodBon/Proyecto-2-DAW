import {Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus,} from '@nestjs/common';
import { LecturasService } from './lecturas.service';
import { CreateLecturaDto } from './dto/create-lectura.dto';
import { UpdateLecturaDto } from './dto/update-lectura.dto';

@Controller('lecturas')
export class LecturasController {
  constructor(private readonly lecturasService: LecturasService) {}

  // POST /lecturas
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body('id_usuario') id_usuario: string,
    @Body() dto: CreateLecturaDto,
  ) {
    return this.lecturasService.create(id_usuario, dto);
  }

  // GET /lecturas/usuario/:id_usuario
  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.lecturasService.findByUsuario(id_usuario);
  }

  // PATCH /lecturas/:id_lectura
  @Patch(':id_lectura')
  update(
    @Param('id_lectura') id_lectura: string,
    @Body() dto: UpdateLecturaDto,
  ) {
    return this.lecturasService.update(id_lectura, dto);
  }

  // DELETE /lecturas/:id_lectura
  @Delete(':id_lectura')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id_lectura') id_lectura: string) {
    return this.lecturasService.remove(id_lectura);
  }
}
