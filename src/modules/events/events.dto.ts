import { IsBeforeConstraint } from '@/common/validators/IsBefore.validator';
import { IsBeforeDateConstraint } from '@/common/validators/IsBeforeDate.validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, Matches } from 'class-validator';


export class CreateEventDTO {


	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	@Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'startDate must be in MM-DD-YYYY format',
  })
	startDate: string;
	
	@IsNotEmpty()
	@Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'endDate must be in MM-DD-YYYY format',
  })
	@IsBeforeDateConstraint("startDate")
	endDate: string;

	@IsNotEmpty()
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: "startTime must follow HH:mm format"
	})
	startTime: string;

	@IsNotEmpty()
	@IsBeforeConstraint("startTime")
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: "endTime must follow HH:mm format"
	})
	endTime: string;
}

export class UpdateEventDTO extends PartialType(CreateEventDTO){}

export class PaginationDTO {
	@Type(() => Number)
	limit: number;

	@Type(() => Number)
	offset: number;
}



