import { DONATION_TYPE } from '@/types/dontation-type';
import { ORDER, SORT_BY } from '@/types/sort';
import { Type } from 'class-transformer';

export class DonationQueryDto {
	search?: string;
	@Type(() => Number)
	page: number;
	@Type(() => Number)
	size: number;
	sortBy?: SORT_BY;
	sortOrder?: ORDER;
	type?: DONATION_TYPE
}