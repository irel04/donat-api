import { EVENTS_FILTER, ORDER } from '@/types/filter';
import { Type } from 'class-transformer';

export class PaginationDTO {
	@Type(() => Number)
	size: number;

	@Type(() => Number)
	page: number;

	search: string;

	sortBy: EVENTS_FILTER;

	sortOrder: ORDER;
}
