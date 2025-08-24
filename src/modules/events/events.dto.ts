import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';


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
	@IsInt()
	@Min(1)
	limit: number;

	@Type(() => Number)
	@IsInt()
	@Min(0)
	offset: number;
}

