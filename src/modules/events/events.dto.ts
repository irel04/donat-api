import { IsValidDateFormat } from '@/common/validators/dateValidator';
import { IsNotEmpty } from 'class-validator';


export class CreateEventDTO {
	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	@IsValidDateFormat()
	startDate: string;
	
	@IsNotEmpty()
	@IsValidDateFormat()
	endDate: string;
}