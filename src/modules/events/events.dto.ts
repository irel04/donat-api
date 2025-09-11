import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';


export class CreateEventDTO {
	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	startDate: string;
	
	@IsNotEmpty()
	endDate: string;
}

export class PaginationDTO {
	@Type(() => Number)
	limit: number;

	@Type(() => Number)
	offset: number;
}



