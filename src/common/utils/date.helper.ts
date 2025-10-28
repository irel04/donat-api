import { BadRequestException, Logger } from '@nestjs/common';
import { isBefore, isEqual, isPast, isValid, parse } from 'date-fns';

const logger = new Logger("Helper is being loaded")

logger.log("Helper Function")

export const isValidDateFormat = (dateParam: string): boolean => {
	const date = parse(dateParam, 'MM-dd-yyyy', new Date());
	return isValid(date);
}

export const isValidDateRange = (startDateParam: string, endDateParam: string): boolean => {
	const start = new Date(startDateParam);
	const end = new Date(endDateParam);
	return (isBefore(start, end) || isEqual(start, end)) && !isPast(start) && !isPast(end);
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
	const format = "HH:mm:ss"
	const referenceDate = new Date()

	const start = parse(startTime, format, referenceDate)
	const end = parse(endTime, format, referenceDate)

	if (!isValid(start) || !isValid(end)) {
		throw new BadRequestException("Use HH:mm format");
	}
	

	return isBefore(start, end) || isEqual(start, end)
}