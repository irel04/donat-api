/* eslint-disable */

import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isBefore, isEqual, parse } from 'date-fns';

export function IsBeforeConstraint(property: string, validationOptions?: ValidationOptions){
	return function (object: any, propertyName: string){
		registerDecorator({
			name: "IsBeforeConstraint",
			target: object.constructor,
			propertyName,
			options: validationOptions,
			constraints: [property],
			validator: {
				validate(value: string, args: ValidationArguments){
					const [relatedPropertyName] = args.constraints
					const relatedValue = (args.object as any)[relatedPropertyName];

					if(!value || !relatedValue) return true;
					const format = "HH:mm";
					const referenceDate = new Date();

					const start = parse(relatedValue, format, referenceDate);
					const end = parse(value, format, referenceDate);

					return isBefore(start, end) || isEqual(start, end)
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} must be after ${args.constraints[0]}`
				}
			}
		})
	}
}