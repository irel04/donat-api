import { isBefore, isEqual, isPast, isValid, parse } from 'date-fns';


export const isValidDateFormat = (dateParam: string): boolean => {
	const date = parse(dateParam, 'MM-dd-yyyy', new Date());
	return isValid(date);
}

export const isValidDateRange = (startDateParam: string, endDateParam: string): boolean => {
	const start = new Date(startDateParam);
	const end = new Date(endDateParam);
	return (isBefore(start, end) || isEqual(start, end)) && !isPast(start) && !isPast(end);
}