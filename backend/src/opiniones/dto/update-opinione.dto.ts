import { PartialType } from '@nestjs/mapped-types';
import { CreateOpinioneDto } from './create-opinione.dto';

export class UpdateOpinioneDto extends PartialType(CreateOpinioneDto) {}
