import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateOpinioneDto {
  @IsString()
  @IsNotEmpty()
  id_usuario: string;

  @IsString()
  @IsNotEmpty({ message: 'El id del libro es obligatorio' })
  id_libro: string;

  @IsInt()
  @Min(1, { message: 'La puntuación mínima es 1' })
  @Max(5, { message: 'La puntuación máxima es 5' })
  puntuacion: number;

  @IsString()
  @IsOptional()
  valoracion?: string;
}
