import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OpinionesService } from './opiniones.service';
import { CreateOpinioneDto } from './dto/create-opinione.dto';
import { UpdateOpinioneDto } from './dto/update-opinione.dto';

@Controller('opiniones')
export class OpinionesController {
  constructor(private readonly opinionesService: OpinionesService) {}

  // POST /opiniones
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateOpinioneDto) {
    console.log('BODY RECIBIDO:', dto);
    return this.opinionesService.create(dto);
  }

  // GET /opiniones/libro/:id_libro
  @Get('libro/:id_libro')
  findByLibro(@Param('id_libro') id_libro: string) {
    return this.opinionesService.findByLibro(id_libro);
  }

  // GET /opiniones/usuario/:id_usuario
  @Get('usuario/:id_usuario')
  findByUsuario(@Param('id_usuario') id_usuario: string) {
    return this.opinionesService.findByUsuario(id_usuario);
  }

  // PATCH /opiniones/:id_opinion
  @Patch(':id_opinion')
  update(
    @Param('id_opinion', ParseIntPipe) id_opinion: number,
    @Body() dto: UpdateOpinioneDto,
  ) {
    return this.opinionesService.update(id_opinion, dto);
  }

  // DELETE /opiniones/:id_opinion
  @Delete(':id_opinion')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id_opinion', ParseIntPipe) id_opinion: number) {
    return this.opinionesService.remove(id_opinion);
  }
}
