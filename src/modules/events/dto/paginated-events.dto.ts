import { EVENTS_FILTER } from '@/types/filter';
import { ORDER } from '@/types/sort';
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
