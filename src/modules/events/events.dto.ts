import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';


export class CreateEventDTO {
	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	startDate: string;
	
	@IsNotEmpty()
	endDate: string;

	@IsNotEmpty()
	startTime: string;

	@IsNotEmpty()
	endTime: string;
}

export class UpdateEventDTO extends PartialType(CreateEventDTO){}

export class PaginationDTO {
	@Type(() => Number)
	limit: number;

	@Type(() => Number)
	offset: number;
}



