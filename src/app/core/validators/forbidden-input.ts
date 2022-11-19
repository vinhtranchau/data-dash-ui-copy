import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ForbiddenInput {
  static createValidator(forbidden: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value === forbidden) {
        return { forbiddenInput: true };
      } else {
        return null;
      }
    };
  }
}
