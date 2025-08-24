import { registerDecorator, ValidationOptions } from 'class-validator';
import { parse, isValid, format } from 'date-fns';

export function IsValidDateFormat(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsValidDateFormat',
      target: object!.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;

          // List of accepted formats
          const formats = [
            'MM/dd/yyyy', // US
            'dd/MM/yyyy', // Most of world
            'yyyy-MM-dd', // ISO
            'dd-MM-yyyy', // European
            'MM-dd-yyyy', // Alt US
          ];

          return formats.some((fmt) => {
            const parsed = parse(value, fmt, new Date());
            return isValid(parsed) && value === format(parsed, fmt);
          });
        },
        defaultMessage() {
          return `${propertyName} must be a valid date (accepted formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY, MM-DD-YYYY)`;
        },
      },
    });
  };
}
