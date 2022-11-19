import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PositiveNumber {
  static createValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value >= 0) {
        return null;
      } else {
        return { nonNegative: true };
      }
    };
  }
}
