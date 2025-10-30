import { DONATION_TYPE } from '@/types/dontation-type';

export enum EVENTS_FILTER {
	CREATED_AT="createdAt",
	STATUS="status"
}

export interface DONATIONS_FILTER {
	type: DONATION_TYPE | undefined,
	search: string | undefined,
}