import {Controller, Get, Patch, Body, Param,} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // GET /usuarios/me/:id
  @Get('me/:id')
  findMe(@Param('id') id: string) {
    return this.usuariosService.findMe(id);
  }

  // PATCH /usuarios/me/:id
  @Patch('me/:id')
  updateMe(
    @Param('id') id: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.updateMe(id, dto);
  }
}
