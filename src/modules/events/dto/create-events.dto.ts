import { IsAfterConstraint } from '@/common/validators/is-after.validator';
import { IsAfterDateConstraint } from '@/common/validators/is-after-date.validator';
import { IsNotEmpty, Matches } from 'class-validator';


export class CreateEventDTO {


	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'startDate must be in YYYY-MM-DD format',
	})
	startDate: string;

	@IsNotEmpty()
	@Matches(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'endDate must be in YYYY-MM-DD format',
	})
	@IsAfterDateConstraint("startDate")
	endDate: string;

	@IsNotEmpty()
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: "startTime must follow HH:mm format"
	})
	startTime: string;

	@IsNotEmpty()
	@IsAfterConstraint("startTime")
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: "endTime must follow HH:mm format"
	})
	endTime: string;
}



