import { DONATION_TYPE } from '@/types/dontation-type';
import { IsNotEmpty } from 'class-validator';

export class CreateDonationDto {
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	description: string;

	@IsNotEmpty()
	type: DONATION_TYPE;
}
