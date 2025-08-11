import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidDateFormat(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsValidDateFormat',
      target: object!.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return (
            typeof value === 'string' &&
            /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(value)
          );
        },
        defaultMessage() {
          return `${propertyName} must be in the format MM/DD/YYYY`;
        },
      },
    });
  };
}
