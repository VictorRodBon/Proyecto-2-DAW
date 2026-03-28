import {IsString, IsNotEmpty, IsOptional, IsDateString, IsIn,} from 'class-validator';

export class CreateLecturaDto {
    @IsString()
    @IsNotEmpty({ message: 'El id del libro es obligatorio' })
    id_libro: string;

    @IsDateString()
    @IsOptional()
    fecha_inicio?: string;

    @IsDateString()
    @IsOptional()
    fecha_fin?: string;

    @IsString()
    @IsIn(['Pendiente', 'Leyendo', 'Terminado', 'Abandonado'], {
        message: 'Estado debe ser: Pendiente, Leyendo, Terminado o Abandonado',
    })
    estado: string;
}