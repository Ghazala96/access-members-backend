import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { DateTime } from 'luxon';

@ValidatorConstraint({ async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: Date) {
    let inputDate: DateTime;
    if (value instanceof Date) {
      inputDate = DateTime.fromJSDate(value).toUTC();
    } else {
      inputDate = DateTime.fromISO(value, { zone: 'utc' });
    }
    const now = DateTime.utc();

    return inputDate > now;
  }

  defaultMessage() {
    return 'Date must be in the future';
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFutureDateConstraint
    });
  };
}
