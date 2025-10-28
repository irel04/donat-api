/* eslint-disable */
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isAfter, parse } from 'date-fns';


export function IsAfterDateConstraint (property: string, validationOptions?: ValidationOptions){
	return function (object: any, propertyName: string){
		registerDecorator({
			name: "IsAfterDateConstraint",
			propertyName,
			target: object.constructor,
			constraints: [property],
			options: validationOptions,
			validator: {
				validate(value: string, args: ValidationArguments){
					const [relatedPropertyName] = args.constraints;
					const relatedValue = (args.object as any)[relatedPropertyName];

					if(!value || !relatedValue) return true;

					const format = "yyyy-MM-dd";
					const referenceDate = new Date();

					const start = parse(relatedValue, format, referenceDate);

					const end = parse(value, format, referenceDate);
					
					return !isAfter(start, end);

				},
				defaultMessage(args: ValidationArguments){
					return `${args.constraints[0]} must be before or same ${args.property}`
				}
			}
		})
	}
} 