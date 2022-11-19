import { FormControl } from '@angular/forms';

export interface YearOptionsForm {
  lines: FormControl<any>;
  fills: FormControl<any>;
}

export const yearOptionsFormGroup = {
  lines: new FormControl([[]]),
  fills: new FormControl([[]]),
};
