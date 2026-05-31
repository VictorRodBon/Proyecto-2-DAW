import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@UseGuards(SupabaseAuthGuard)
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
