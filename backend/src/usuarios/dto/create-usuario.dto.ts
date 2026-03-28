import {IsString, IsNotEmpty, IsOptional, IsIn,} from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    nombre_usuario: string;

    @IsString()
    @IsIn(['activo', 'no-activo'], {
        message: 'Estado debe ser: activo o no-activo',
    })
    @IsOptional()
    estado?: string;

    @IsString()
    @IsIn(['usuario', 'admin'], {
        message: 'Rol debe ser: usuario o admin',
    })
    @IsOptional()
    rol?: string;

    @IsString()
    @IsOptional()
    foto_perfil?: string;
}
