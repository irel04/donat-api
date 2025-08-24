import { IsNotEmpty } from 'class-validator';


export class CreateEventDTO {
	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	startDate: string;
	
	@IsNotEmpty()
	endDate: string;
}

