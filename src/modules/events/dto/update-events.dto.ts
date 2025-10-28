import { CreateEventDTO } from '@/modules/events/dto/create-events.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEventDTO extends PartialType(CreateEventDTO) { }