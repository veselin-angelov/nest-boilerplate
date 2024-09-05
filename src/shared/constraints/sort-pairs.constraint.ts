import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'emailExists' })
@Injectable()
export class SortPairConstraint implements ValidatorConstraintInterface {
  public validate(value: string[]): boolean {
    if (!Array.isArray(value)) {
      return false;
    }

    return value.every((pair) => {
      const [_, order] = pair.split(',');

      return ['asc', 'desc'].includes(order);
    });
  }

  public defaultMessage(): string {
    return 'Sorting fields must match field,(asc|desc) pattern.';
  }
}
